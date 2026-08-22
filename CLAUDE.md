# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The **NRRWA (Namma Roopanagara Residents Welfare Association) website** — a Hugo static site in English (`en`) and Kannada (`kn`). Migrated from Eleventy (see `MIGRATION_SUMMARY.md`). Built with Hugo v0.165 extended; full production build is ~200ms producing ~90 EN / ~95 KN pages.

There is no test suite, no linter, and no CI. Verification = the site builds clean and the affected page renders.

## Commands

```bash
./dev-server.sh                  # build + pagefind index + `hugo server -D` (the normal loop)
hugo server -D                   # live-reload only; search will be stale/broken
hugo --minify                    # production build into public/
npx pagefind --site public       # search index; MUST run after every production build
```

`public/` and `resources/` are gitignored build output — never edit them.

### Known-benign build warnings

- `deprecated: languageCode / languageName / .Language.LanguageName / .Site.Data` — the codebase deliberately still uses the pre-0.158 forms. Match the surrounding code; don't opportunistically migrate one call site and leave the rest inconsistent.
- `found no layout file for "html" for kind "section"` — from the stray empty `content/posts/news/` section.

## Architecture

### Multilingual model

Every page is a `<slug>.en.md` / `<slug>.kn.md` pair in the same directory; Hugo pairs them by **translation base name** and routes to `/en/...` and `/kn/...` (`defaultContentLanguageInSubdir = true`). Missing a `.kn.md` doesn't break the build — the language switcher silently falls back to the KN homepage — so always author both files.

UI strings come from `i18n/en.toml` / `i18n/kn.toml` (~267 lines each, kept in lockstep) via `{{ T "key" }}`. Some older templates instead inline `{{ if eq .Language.Lang "en" }}...{{ else }}...{{ end }}`; prefer `T` in new code.

### Two different data-file shapes (this is the main gotcha)

Most of `data/*.yaml` is **language-first**:

```yaml
en: { ... }
kn: { ... }
```
```go
{{ $data := index .Site.Data.faqs .Language.Lang }}
```

`data/focus/` is the exception: **one file per focus area, language nested inside**, and the lookup is by page slug first:

```go
{{ $data := index .Site.Data.focus .File.TranslationBaseName }}   {{/* e.g. "environment" */}}
{{ $langData := index $data .Language.Lang }}
```

The data filename must match the content slug **exactly**. When it doesn't match, `layouts/focus/single.html` falls back to rendering the page's markdown `.Content` — so a mismatch is silent, not a blank page. Two areas run on that fallback today, deliberately or not:

- `safety` — no `data/focus/safety.yaml`; the page is authored entirely in markdown.
- `public-amenities` — the page is authored in markdown (including a `gallery` shortcode the data layout can't express), while `data/focus/public_amenities.yaml` is dead: the underscore means it never loads, and its contents are a stale copy of the environment initiatives. **Renaming it to `public-amenities.yaml` would regress the page**, replacing real content with wrong data. Delete or rewrite it rather than renaming.

### Image path convention

Images live in `assets/images/...` and are referenced everywhere (frontmatter, YAML data, shortcode params) with a leading `/assets/`. Templates strip that prefix before handing the path to the asset pipeline, with a raw-`src` fallback if the resource isn't found:

```go
{{ $imgPath := strings.TrimPrefix "/assets/" .Params.featuredImage }}
{{ $img := resources.Get $imgPath }}
{{ if $img }}{{ $r := $img.Fill "400x300 webp q85" }}<img src="{{ $r.RelPermalink }}">
{{ else }}<img src="{{ .Params.featuredImage }}">{{ end }}
```

Copy this pattern (including the fallback) in new templates. Everything converts to WebP at q85. `static/assets/` holds large or externally-linked files (documents, some images) that bypass processing.

### CSV-backed member and donor tables

Membership and donor lists are CSVs under `assets/data/` (`current_members/`, `donors/`), read as Hugo resources and unmarshalled at build time:

```go
{{ with resources.Get "data/current_members/lm_members.csv" }}
  {{ with . | transform.Unmarshal }}{{ range after 1 . }}...{{ end }}{{ end }}
{{ end }}
```

Convention: row 0 is the header (skipped with `after 1`) and any row whose first cell is `"Total"` is excluded from counts. `member-grand-total` hardcodes the four membership-tier CSV paths — adding a tier means editing that shortcode too. Note these counts are computed independently of `params.stats_members` in `hugo.toml`, which drives the homepage counter and is maintained by hand.

### News structure

News lives in year subdirectories (`content/news/2026/...`) with permalinks flattened to `/news/:year/:slug/` by `hugo.toml`. Pages carrying `layout: archive` (e.g. `content/news/2025/archive.*.md`) get `layouts/news/archive.html` and are filtered out of the paginated news list.

### Templates

`layouts/_default/baseof.html` wraps everything: header, language switcher, theme toggle, Pagefind search box, `<main data-pagefind-body>` (which is what bounds the search index), footer, and the fingerprinted CSS/JS pipeline. Section list pages are one-off custom templates under `layouts/<section>/list.html` — `directory`, `donors`, `membership`, `reports`, `contact`, `other-orgs`, `focus`, `events`, `news` each have their own, so changing "how a section page looks" means editing that section's file, not a shared one.

### Shortcodes

| Shortcode | Params |
|---|---|
| `gallery` | `path` — repo-root-relative, starts with `assets/` (not `/assets/`); auto-lists images, adds lightbox |
| `donor-accordion` | `file` (resource path, e.g. `data/donors/nammavana.csv`), `title`, `description` |
| `member-grand-total` | none |
| `callout` | `type` (info/warning/tip/success/danger/note), `title`, `icon` |
| `initiative` | `title`, `image` (`/assets/...`), `align` (left/right); body is markdown |
| `csv-to-table` | renders a CSV as a table |

### Dynamic directory

`layouts/directory/list.html` renders static official contacts from `data/directory.yaml`, then `assets/js/directory.js` fetches resident-submitted contacts at runtime from the Google Apps Script endpoint in `params.directory.json_api_url`, expecting `[{ name, contacts: [{name, phone, email}] }]`. Failures here are runtime-only and invisible at build time — check the browser console.

## Adding content

- **News/event**: `hugo new news/2026/slug.en.md` (archetypes in `archetypes/` supply the frontmatter), then create the `.kn.md`. Frontmatter: `title`, `date`, `featuredImage`, `summary`, `author`, `tags`; events also take `eventDate`.
- **Focus area**: `content/focus/<slug>.{en,kn}.md` **plus** `data/focus/<slug>.yaml` with `en:`/`kn:` each holding `intro`, `initiatives[] {title, image, description}`, `impact`, `cta`; images in `assets/images/focus/`.
- **Nav item**: add to both `[[languages.en.menu.main]]` and `[[languages.kn.menu.main]]` in `hugo.toml`.
