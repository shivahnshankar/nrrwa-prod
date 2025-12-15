# Copilot / AI Agent instructions for NRRWA Hugo site

Short, action-oriented guidance to help an AI coding agent be productive quickly.

## Big picture
- This is a **Hugo static site** (see `hugo.toml`) using **multilingual mode** (English `en` and Kannada `kn`). Content files use suffixes: `*.en.md` and `*.kn.md`.
- The site is data-driven: many pages read from `data/*.yaml` with top-level language keys (e.g., `en`, `kn`). Templates access them with: `index .Site.Data.<name> .Language.Lang`.
- Search is handled by **Pagefind** (run with `npx pagefind --site public`) and the UI is embedded in `layouts/_default/baseof.html` (`pagefind-ui.js` / `pagefind-ui.css`).

## Dev / build workflow (explicit commands)
- Quick dev (build + search index + server):
  ```bash
  ./dev-server.sh
  ```
- Manual alternatives:
  - Start dev server with drafts: `hugo server -D`
  - Production build: `hugo --minify` then `npx pagefind --site public`
  - To include drafts in build: `hugo --buildDrafts`
- Note: `dev-server.sh` continues even if Pagefind indexing fails (safe to iterate locally).

## Key files & patterns (where to look)
- Config: `hugo.toml` (languages, menus, params, perms)
- Base layout + global integrations: `layouts/_default/baseof.html`
  - Asset pipeline examples: `{{ $css := resources.Get "css/style.css" | minify | fingerprint }}`
  - Search anchor: `<main data-pagefind-body>` and Pagefind UI init in the footer script
- Section templates: `layouts/<section>/` (e.g., `focus`, `news`, `membership`, `reports`) — these show how the site expects data shapes
- Data-driven pages: `data/*.yaml` (e.g., `focus`, `directory`, `members`, `faqs`) — these are keyed by language: `en:` / `kn:`. Example access: `{{ $faqs := index .Site.Data.faqs .Language.Lang }}`
- Shortcodes: `layouts/shortcodes/` (examples: `initiative.html`, `gallery.html`, `csv-to-table.html`, `donor-accordion.html`) — use these for reusable UI blocks
- i18n translation strings: `i18n/en.toml` and `i18n/kn.toml` and `T "key"` usage in templates
- JS behavior that depends on plugin/data: `assets/js/directory.js` reads a JSON API URL from `data-api-url` which is set from `Site.Params.directory.json_api_url`.

## Patterns & conventions to follow (concrete)
- Multilingual content: Create `content/<section>/<slug>.en.md` and `<slug>.kn.md` for translations. The page's translation base name (`.File.TranslationBaseName`) is used as the key for `data/*.yaml` lookups (see `layouts/focus/single.html`).
- Per-language data: `data/<name>.yaml` uses `en:` and `kn:` top-level keys. Templates expect `index .Site.Data.<name> .Language.Lang` and then fields like `.intro`, `.initiatives`, `.impact`, `.cta` depending on the section.
- Assets & images: prefer storing images under `assets/` and reference them in frontmatter like `/assets/images/...`. Templates often use Hugo Pipes with `resources.Get` then `.Resize`, `.Fill` or `.Fit` before using `.RelPermalink`.
- Don't edit `public/` — it is generated output.
- Page-level metadata: common frontmatter keys include `title`, `date`, `featuredImage`, `summary`, `tags`, `author`. Shortcodes and templates expect these keys (see `content/news/*.en.md`).
- UI localization: language switchers use `.Translations` or `.Site.Home.AllTranslations` (e.g. in `baseof.html`); use `T "key"` for small strings.

## Integration notes / gotchas
- Search: Pagefind must be run after `hugo --minify` to populate `/public/pagefind` before the search UI works. CI or deployment should include this step.
- External directory API: `assets/js/directory.js` expects JSON with `{ name, contacts: [...] }` sections. The API URL is configured in `hugo.toml` under `[params.directory].json_api_url`.
- Asset fingerprinting relies on Hugo Pipes — make sure Hugo is a recent binary supporting `resources` methods.
- The site uses `relativeURLs = true` & `defaultContentLanguageInSubdir = true`. If deploying under a subpath, update `baseURL` accordingly.

## Troubleshooting tips (where to check first)
- If CSS/JS integrity or fingerprint changes cause issues: check `resources.Get` usages in `layouts/_default/baseof.html` and re-run `hugo --minify`.
- If search shows no results: ensure Pagefind ran successfully and `public/pagefind` exists, then refresh the browser (check console for pagefind errors).
- If focus pages show empty initiatives/impact: verify `data/focus.yaml` contains an entry keyed by page translation base name, e.g., `data/focus.yaml` has `public-amenities:` with `en:` and `kn:` children.
- If dynamic directory is empty: check `hugo.toml` for `params.directory.json_api_url`, and test the URL returns the expected JSON shape and CORS headers.

## Suggested quick tasks (to get productive)
- To add a new focus area: create `content/focus/<slug>.en.md` and `content/focus/<slug>.kn.md`; add `data/focus.yaml -> <slug> -> en/kn` entries and place images in `assets/images/focus/`.
- To fix search: run `hugo --minify && npx pagefind --site public`, then start `hugo server -D` or open files under `public/`.

---
If anything above is unclear or you want additional snippets (e.g., example `data/focus.yaml` entry, common frontmatter template, or a CI step to run Pagefind), tell me which part to expand and I'll iterate. ✅
