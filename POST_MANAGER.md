# Jekyll Post Manager

This repo includes a small local app for creating and editing Jekyll posts without installing a CMS.

## Run

```powershell
npm run posts
```

Open:

```text
http://localhost:4317
```

## Debug

```powershell
npm run posts:debug
```

Or inspect the debug API while the app is running:

```text
http://localhost:4317/api/debug
```

## Jekyll

Published posts are saved to `_posts` as:

```text
YYYY-MM-DD-post-title.md
```

Drafts are saved to `_drafts` as:

```text
post-title.md
```

The generated front matter looks like:

```yaml
---
layout: post
title: "My post"
date: 2026-04-29
tags: [jekyll, ai]
---
```

To preview the Jekyll site locally after Ruby/Bundler are installed:

```powershell
npm run jekyll:serve
```

## Push To GitHub

Check what changed:

```powershell
git status
git diff
```

Stage and commit:

```powershell
git add _config.yml _layouts blog.html _posts _drafts scripts package.json .gitignore POST_MANAGER.md
git commit -m "Add Jekyll post manager"
```

Push:

```powershell
git push origin main
```

GitHub Pages will run Jekyll automatically for this repository unless Pages is configured to deploy from another build pipeline.

## Why This Helps

- Posts become simple Markdown files with searchable history in Git.
- Drafts stay separate from published posts.
- GitHub Pages can build the blog without a database or admin backend.
- The app runs only on your machine, so there is no public admin login to secure.
- The file format stays portable if you later move to another static site generator.
