# Online Post Writer

The online writer is a static GitHub Pages admin page:

```text
https://tom19840813.github.io/admin.html
```

It does not use a normal username/password database because GitHub Pages cannot run private server code. Instead, it authenticates with GitHub and writes posts through the GitHub Contents API.

## Setup

1. Open GitHub fine-grained personal access tokens:

```text
https://github.com/settings/personal-access-tokens/new
```

2. Create a token for only this repository:

```text
Tom19840813/Tom19840813.github.io
```

3. Give it this repository permission:

```text
Contents: Read and write
```

4. Set a short expiry, for example 30 or 90 days.
5. Copy the token.
6. Open `admin.html`, paste the token, then click `Save token on this browser`.

## Workflow

1. Open `admin.html`.
2. Click `Load posts`.
3. Click `New post`.
4. Write the title, tags, and Markdown content.
5. Click `Publish post`.

The writer creates or updates files in `_posts` on the `main` branch. GitHub Pages should rebuild the site automatically after each publish.

## Security Notes

- Keep the token private.
- Use a fine-grained token for this repository only.
- Do not use a classic broad-access token.
- Click `Forget token` on shared computers.
- This page is marked `noindex`, but it is still a public URL. The GitHub token is what protects publishing.
