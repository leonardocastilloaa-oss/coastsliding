# CoastSlide Cloudflare Deployment Notes

## Current production target

Production domain: `https://coastslide.com`

Cloudflare is deploying this repository as a static Workers site with `npx wrangler deploy`.

## Required Cloudflare settings

Use these exact settings in the Cloudflare project:

- Repository: `leonardocastilloaa-oss/Coastsliding`
- Branch: `main` or `cloudflare/workers-autoconfig` after both branches are synced
- Build command: `npx wrangler deploy`
- Build output directory: leave empty/default

The root `wrangler.jsonc` must stay simple:

```json
{
  "name": "coastsliding",
  "main": "src/worker.js",
  "compatibility_date": "2026-05-12",
  "assets": {
    "directory": ".",
    "binding": "ASSETS"
  }
}
```

Do not add `assets.exclude`; Wrangler 4 warns on that field and may still scan the wrong assets. Files that should not be uploaded, including `.git`, are controlled by `.assetsignore`.

## Current deploy fix

The previous deploy error happened because Cloudflare scanned `.git/objects/pack/...`, which means the deploy was using an old config or ignoring the latest repo state. The current repository includes:

- `.assetsignore` excluding `.git`, `.wrangler`, `node_modules`, `src`, `_worker.js`, logs, ZIPs, and RARs.
- `wrangler.jsonc` without unsupported `assets.exclude`.
- `src/worker.js` serving the website through the assets binding.

If a new Cloudflare log still says `Unexpected fields found in assets field: "exclude"`, Cloudflare is not deploying the latest commit from this repository/branch.

## Google files

Submit this sitemap in Google Search Console:

`https://coastslide.com/sitemap.xml`

Robots file:

`https://coastslide.com/robots.txt`

## Update workflow

Codex edits this GitHub repository directly. After every push, Cloudflare should create a new deployment automatically from the latest commit.
