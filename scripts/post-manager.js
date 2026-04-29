#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const http = require("http");
const { URL } = require("url");

const root = path.resolve(__dirname, "..");
const postsDir = path.join(root, "_posts");
const draftsDir = path.join(root, "_drafts");
const port = Number(process.env.POST_MANAGER_PORT || getArg("--port") || 4317);
const debugMode = process.argv.includes("--debug");

ensureDir(postsDir);
ensureDir(draftsDir);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/") {
      return send(res, 200, renderApp(), "text/html; charset=utf-8");
    }

    if (req.method === "GET" && url.pathname === "/api/posts") {
      return json(res, listPosts());
    }

    if (req.method === "GET" && url.pathname === "/api/post") {
      const postPath = safePostPath(url.searchParams.get("path"));
      const raw = fs.readFileSync(postPath, "utf8");
      return json(res, { path: relativePath(postPath), ...parsePost(raw) });
    }

    if (req.method === "GET" && url.pathname === "/api/debug") {
      return json(res, debugInfo());
    }

    if (req.method === "POST" && url.pathname === "/api/save") {
      const body = await readJson(req);
      const saved = savePost(body);
      return json(res, saved);
    }

    if (req.method === "POST" && url.pathname === "/api/delete") {
      const body = await readJson(req);
      const postPath = safePostPath(body.path);
      fs.unlinkSync(postPath);
      return json(res, { ok: true });
    }

    if (req.method === "POST" && url.pathname === "/api/publish") {
      const body = await readJson(req);
      const source = safePostPath(body.path);
      const parsed = parsePost(fs.readFileSync(source, "utf8"));
      const title = body.title || parsed.frontMatter.title || titleFromFile(source);
      const date = body.date || today();
      const target = path.join(postsDir, `${date}-${slugify(title)}.md`);

      if (fs.existsSync(target) && path.resolve(target) !== path.resolve(source)) {
        return json(res, { ok: false, error: "A published post with that date/title already exists." }, 409);
      }

      const frontMatter = {
        layout: parsed.frontMatter.layout || "post",
        title,
        date,
        tags: normalizeTags(body.tags || parsed.frontMatter.tags || []),
      };

      fs.writeFileSync(target, stringifyPost(frontMatter, parsed.content), "utf8");
      if (path.resolve(source) !== path.resolve(target)) fs.unlinkSync(source);
      return json(res, { ok: true, path: relativePath(target) });
    }

    return json(res, { ok: false, error: "Not found" }, 404);
  } catch (error) {
    if (debugMode) console.error(error);
    return json(res, { ok: false, error: error.message }, 500);
  }
});

server.listen(port, () => {
  console.log(`Jekyll post manager running at http://localhost:${port}`);
  if (debugMode) console.log(JSON.stringify(debugInfo(), null, 2));
});

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function listPosts() {
  const files = [
    ...readMarkdownFiles(postsDir).map((file) => ({ file, status: "published" })),
    ...readMarkdownFiles(draftsDir).map((file) => ({ file, status: "draft" })),
  ];

  return files
    .map(({ file, status }) => {
      const raw = fs.readFileSync(file, "utf8");
      const parsed = parsePost(raw);
      return {
        path: relativePath(file),
        status,
        title: parsed.frontMatter.title || titleFromFile(file),
        date: parsed.frontMatter.date || dateFromFile(file),
        tags: normalizeTags(parsed.frontMatter.tags || []),
        excerpt: firstParagraph(parsed.content),
        updatedAt: fs.statSync(file).mtime.toISOString(),
      };
    })
    .sort((a, b) => String(b.date || b.updatedAt).localeCompare(String(a.date || a.updatedAt)));
}

function readMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".markdown"))
    .map((file) => path.join(dir, file));
}

function parsePost(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontMatter: {}, content: raw };
  return { frontMatter: parseFrontMatter(match[1]), content: match[2] };
}

function parseFrontMatter(text) {
  const data = {};
  for (const line of text.split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    const [, key, value] = pair;
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => unquote(item.trim()))
        .filter(Boolean);
    } else {
      data[key] = unquote(value.trim());
    }
  }
  return data;
}

function stringifyPost(frontMatter, content) {
  const lines = Object.entries(frontMatter)
    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${key}: [${value.map(yamlQuote).join(", ")}]`;
      return `${key}: ${yamlQuote(value)}`;
    });

  return `---\n${lines.join("\n")}\n---\n\n${content.trim()}\n`;
}

function savePost(body) {
  const status = body.status === "published" ? "published" : "draft";
  const title = String(body.title || "Untitled post").trim();
  const date = String(body.date || today()).trim();
  const tags = normalizeTags(body.tags || []);
  const content = String(body.content || "").trim() || "Write your post here.";
  const layout = String(body.layout || "post").trim();
  const currentPath = body.path ? safePostPath(body.path) : null;
  const directory = status === "published" ? postsDir : draftsDir;
  const filename = status === "published" ? `${date}-${slugify(title)}.md` : `${slugify(title)}.md`;
  const target = path.join(directory, filename);

  if (currentPath && fs.existsSync(currentPath) && path.resolve(currentPath) !== path.resolve(target)) {
    if (fs.existsSync(target)) throw new Error("A post with that title/date already exists.");
    fs.unlinkSync(currentPath);
  } else if (!currentPath && fs.existsSync(target)) {
    throw new Error("A post with that title/date already exists.");
  }

  fs.writeFileSync(target, stringifyPost({ layout, title, date, tags }, content), "utf8");
  return { ok: true, path: relativePath(target) };
}

function safePostPath(input) {
  if (!input) throw new Error("Missing post path.");
  const normalized = String(input).replaceAll("\\", "/").replace(/^\/+/, "");
  const resolved = path.resolve(root, normalized);
  const allowed = [postsDir, draftsDir].some((dir) => resolved.startsWith(path.resolve(dir) + path.sep));
  if (!allowed || !/\.(md|markdown)$/i.test(resolved)) throw new Error("Invalid post path.");
  return resolved;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) reject(new Error("Request body too large."));
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON."));
      }
    });
  });
}

function debugInfo() {
  return {
    root,
    postsDir,
    draftsDir,
    postCount: readMarkdownFiles(postsDir).length,
    draftCount: readMarkdownFiles(draftsDir).length,
    node: process.version,
  };
}

function json(res, data, status = 200) {
  send(res, status, JSON.stringify(data, null, 2), "application/json; charset=utf-8");
}

function send(res, status, body, type) {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
  });
  res.end(body);
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map(String).map((tag) => tag.trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function yamlQuote(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_./:-]+$/.test(text)) return text;
  return `"${text.replaceAll('"', '\\"')}"`;
}

function unquote(value) {
  return value.replace(/^["']|["']$/g, "");
}

function relativePath(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled-post";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function dateFromFile(file) {
  const match = path.basename(file).match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : "";
}

function titleFromFile(file) {
  return path
    .basename(file, path.extname(file))
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function firstParagraph(content) {
  return content
    .replace(/^# .+$/m, "")
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .find(Boolean) || "";
}

function renderApp() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jekyll Post Manager</title>
  <style>
    :root { color-scheme: light dark; --bg: #f6f7f9; --panel: #ffffff; --text: #111827; --muted: #64748b; --border: #d9dee7; --accent: #0f766e; --danger: #b91c1c; }
    @media (prefers-color-scheme: dark) { :root { --bg: #0f141b; --panel: #151c25; --text: #e5e7eb; --muted: #9ca3af; --border: #2f3a48; --accent: #2dd4bf; --danger: #f87171; } }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 24px; border-bottom: 1px solid var(--border); background: var(--panel); position: sticky; top: 0; z-index: 2; }
    h1 { margin: 0; font-size: 20px; }
    main { display: grid; grid-template-columns: minmax(260px, 360px) minmax(0, 1fr); min-height: calc(100vh - 67px); }
    aside { border-right: 1px solid var(--border); background: var(--panel); padding: 16px; overflow: auto; }
    section { padding: 18px; }
    button, input, select, textarea { font: inherit; }
    button { border: 1px solid var(--border); background: var(--panel); color: var(--text); padding: 9px 12px; border-radius: 7px; cursor: pointer; }
    button.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    button.danger { color: var(--danger); }
    label { display: grid; gap: 6px; font-size: 13px; color: var(--muted); }
    input, select, textarea { width: 100%; border: 1px solid var(--border); border-radius: 7px; padding: 10px 11px; color: var(--text); background: var(--panel); }
    textarea { min-height: 48vh; resize: vertical; line-height: 1.5; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
    .toolbar, .form-grid, .actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: end; }
    .form-grid { display: grid; grid-template-columns: 1.4fr 160px 140px; margin-bottom: 12px; }
    .post-list { display: grid; gap: 8px; }
    .post { display: grid; gap: 4px; width: 100%; text-align: left; }
    .post strong { font-size: 14px; }
    .post small { color: var(--muted); }
    .status { display: inline-block; border: 1px solid var(--border); border-radius: 999px; padding: 2px 7px; font-size: 12px; color: var(--muted); }
    .editor { max-width: 1080px; }
    .message { min-height: 20px; color: var(--muted); }
    .empty { color: var(--muted); padding: 18px 4px; }
    @media (max-width: 860px) { main { grid-template-columns: 1fr; } aside { border-right: 0; border-bottom: 1px solid var(--border); } .form-grid { grid-template-columns: 1fr; } header { align-items: flex-start; flex-direction: column; } }
  </style>
</head>
<body>
  <header>
    <h1>Jekyll Post Manager</h1>
    <div class="toolbar">
      <button id="newDraft">New draft</button>
      <button id="refresh">Refresh</button>
      <button id="debug">Debug</button>
    </div>
  </header>
  <main>
    <aside>
      <div id="postList" class="post-list"></div>
    </aside>
    <section>
      <div class="editor">
        <div class="form-grid">
          <label>Title <input id="title" autocomplete="off"></label>
          <label>Date <input id="date" type="date"></label>
          <label>Status <select id="status"><option value="draft">Draft</option><option value="published">Published</option></select></label>
        </div>
        <label>Tags <input id="tags" placeholder="jekyll, ai, projects"></label>
        <p></p>
        <label>Content <textarea id="content" spellcheck="true"></textarea></label>
        <p class="message" id="message"></p>
        <div class="actions">
          <button class="primary" id="save">Save</button>
          <button id="publish">Publish</button>
          <button class="danger" id="deletePost">Delete</button>
        </div>
      </div>
    </section>
  </main>
  <script>
    const state = { path: null, posts: [] };
    const $ = (id) => document.getElementById(id);
    const today = () => new Date().toISOString().slice(0, 10);

    $("newDraft").onclick = () => loadBlank();
    $("refresh").onclick = () => loadPosts();
    $("debug").onclick = async () => {
      const data = await api("/api/debug");
      $("message").textContent = "Debug: " + JSON.stringify(data);
    };
    $("save").onclick = () => save();
    $("publish").onclick = () => publish();
    $("deletePost").onclick = () => removePost();

    async function api(url, options) {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok || data.ok === false) throw new Error(data.error || "Request failed");
      return data;
    }

    async function loadPosts() {
      state.posts = await api("/api/posts");
      $("postList").innerHTML = state.posts.length ? state.posts.map((post) => \`
        <button class="post" data-path="\${post.path}">
          <strong>\${escapeHtml(post.title)}</strong>
          <small><span class="status">\${post.status}</span> \${post.date || ""}</small>
          <small>\${escapeHtml(post.excerpt || post.path)}</small>
        </button>\`).join("") : '<div class="empty">No posts yet. Create a draft to start.</div>';

      document.querySelectorAll(".post").forEach((button) => {
        button.onclick = () => loadPost(button.dataset.path);
      });
    }

    async function loadPost(path) {
      const post = await api("/api/post?path=" + encodeURIComponent(path));
      state.path = post.path;
      $("title").value = post.frontMatter.title || "";
      $("date").value = post.frontMatter.date || today();
      $("status").value = post.path.startsWith("_posts/") ? "published" : "draft";
      $("tags").value = Array.isArray(post.frontMatter.tags) ? post.frontMatter.tags.join(", ") : (post.frontMatter.tags || "");
      $("content").value = post.content || "";
      $("message").textContent = post.path;
    }

    function loadBlank() {
      state.path = null;
      $("title").value = "";
      $("date").value = today();
      $("status").value = "draft";
      $("tags").value = "";
      $("content").value = "# New post\\n\\nWrite your post here.";
      $("message").textContent = "New draft";
      $("title").focus();
    }

    async function save() {
      try {
        const data = await api("/api/save", requestBody());
        $("message").textContent = "Saved " + data.path;
        await loadPosts();
        await loadPost(data.path);
      } catch (error) {
        $("message").textContent = error.message;
      }
    }

    async function publish() {
      try {
        if (!state.path) await save();
        const data = await api("/api/publish", requestBody({ path: state.path }));
        $("message").textContent = "Published " + data.path;
        await loadPosts();
        await loadPost(data.path);
      } catch (error) {
        $("message").textContent = error.message;
      }
    }

    async function removePost() {
      if (!state.path || !confirm("Delete this post file?")) return;
      try {
        await api("/api/delete", requestBody({ path: state.path }));
        await loadPosts();
        loadBlank();
      } catch (error) {
        $("message").textContent = error.message;
      }
    }

    function requestBody(extra = {}) {
      return {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          path: state.path,
          title: $("title").value,
          date: $("date").value,
          status: $("status").value,
          tags: $("tags").value,
          content: $("content").value,
          layout: "post",
          ...extra,
        }),
      };
    }

    function escapeHtml(text) {
      return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
    }

    loadBlank();
    loadPosts().catch((error) => $("message").textContent = error.message);
  </script>
</body>
</html>`;
}
