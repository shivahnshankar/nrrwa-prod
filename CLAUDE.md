# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **NRRWA (Namma Roopanagara Residents Welfare Association) website**, a Hugo-based static site generator project with built-in multilingual support for English and Kannada. The site migrated from Eleventy to Hugo for significantly improved build performance (137ms vs 2400ms - 17x faster).

## Development Commands

### Quick Start
```bash
# Development workflow (build + search indexing + live server)
./dev-server.sh

# Manual development server with live reload
hugo server -D

# Build for production (minified)
hugo --minify

# Add search indexing after build
npx pagefind --site public

# Build including drafts
hugo --buildDrafts
```

### Testing Changes
- Hugo provides live reload during development
- Search requires Pagefind indexing: run `npx pagefind --site public` after builds
- Test multilingual features by navigating to `/en/` and `/kn/` routes

## Architecture

### Core Technology Stack
- **Static Site Generator**: Hugo (Go-based)
- **Template Language**: Go templates (`.html` files in `layouts/`)
- **Content Format**: Markdown with YAML frontmatter
- **Data Storage**: YAML files in `data/` directory
- **Styling**: Vanilla CSS with CSS custom properties (no preprocessor)
- **JavaScript**: Vanilla JS with Swiper library for carousels
- **Search**: Pagefind for client-side full-text search
- **Deployment**: Static HTML output to `public/` directory

### Multilingual Architecture (Critical)

The site uses Hugo's built-in multilingual mode with language-specific file suffixes:

**Content Files**:
- English: `content/news/article.en.md`
- Kannada: `content/news/article.kn.md`
- URLs automatically route: `/en/news/article/` and `/kn/news/article/`

**Data Files** (pattern used throughout):
```yaml
# data/focus.yaml structure
public-amenities:
  en:
    title: "Public Amenities"
    initiatives: [...]
  kn:
    title: "ಸಾರ್ವಜನಿಕ ಸೌಕರ್ಯಗಳು"
    initiatives: [...]
```

**Accessing Data in Templates**:
```go
{{ $data := index .Site.Data.focus .Language.Lang }}
{{ $focusData := index $data .File.TranslationBaseName }}
```

**Language Switching**:
- Use `{{ .Translations }}` to link between language versions
- Use `{{ T "key" }}` for UI string translations from `i18n/en.toml` and `i18n/kn.toml`

### Directory Structure

```
/
├── hugo.toml                    # Main configuration (languages, menus, params)
├── content/                     # All content with .en.md/.kn.md suffixes
│   ├── _index.en.md            # Homepage
│   ├── news/                    # News articles (~32 files)
│   ├── events/                  # Events
│   ├── focus/                   # 6 focus area categories
│   ├── about/                   # About section
│   ├── membership/              # Membership info
│   ├── directory/               # Community directory
│   └── reports/                 # Reports & documents
├── layouts/                     # Go HTML templates
│   ├── _default/
│   │   ├── baseof.html         # Base template (header, nav, footer)
│   │   ├── single.html         # Single page/article template
│   │   ├── list.html           # List/archive pages
│   │   └── taxonomy.html       # Tag/category pages
│   ├── index.html              # Homepage template
│   ├── partials/               # Reusable components
│   │   ├── navigation.html     # Main nav with submenus
│   │   └── footer.html         # Site footer
│   └── shortcodes/             # Custom content blocks
│       ├── gallery.html        # Image gallery with lightbox
│       ├── csv-to-table.html   # Data table rendering
│       └── donor-accordion.html # Expandable sections
├── data/                       # YAML data files (language-keyed)
│   ├── heroSlides.yaml         # Homepage carousel
│   ├── visionMission.yaml      # Organization info
│   ├── executiveCommittee.yaml # Committee members
│   ├── membership.yaml         # Membership tiers
│   ├── directory.yaml          # Official contacts
│   ├── faqs.yaml              # FAQ content
│   └── focus/                  # Focus area descriptions
├── assets/                     # Pipeline-processed assets
│   ├── css/style.css           # Main stylesheet (62KB)
│   ├── js/
│   │   ├── main.js            # Theme toggle, carousel, animations
│   │   └── directory.js       # Google Sheets API integration
│   └── images/                 # Image assets
├── static/                     # Direct-copy static files
│   └── assets/                 # External/large assets
├── i18n/                       # UI translations
│   ├── en.toml                # English strings (120+ translations)
│   └── kn.toml                # Kannada strings
└── public/                     # Generated output (DO NOT EDIT)
```

### Template Hierarchy

1. **baseof.html** - Base wrapper for all pages (header, navigation, footer, theme toggle)
2. **index.html** - Homepage with hero carousel, events, news, member spotlight
3. **single.html** - Individual article/page template
4. **list.html** - Collection/archive pages with pagination
5. **Section-specific templates** - Located in `layouts/<section>/` for custom layouts

### Data-Driven Pages Pattern

Many pages read structured data from `data/*.yaml` files:

```go
// Example from focus area pages (layouts/focus/single.html)
{{ $focusAreas := index .Site.Data.focus .Language.Lang }}
{{ $focusData := index $focusAreas .File.TranslationBaseName }}

// Example from homepage (layouts/index.html)
{{ $heroSlides := index .Site.Data.heroSlides .Language.Lang }}
```

All data files use top-level language keys (`en:` and `kn:`). Access them with:
```go
{{ $data := index .Site.Data.<filename> .Language.Lang }}
```

### Asset Processing Pipeline

Hugo processes assets through its asset pipeline:

```go
// CSS with minification and fingerprinting
{{ $css := resources.Get "css/style.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">

// Image processing with WebP conversion
{{ $img := resources.Get "images/photo.jpg" }}
{{ $resized := $img.Resize "1600x webp q85" }}
```

Images should be placed in `assets/images/` and referenced in frontmatter as `/assets/images/...`

### Shortcodes (Reusable Content Blocks)

Custom shortcodes in `layouts/shortcodes/`:

```markdown
{{< gallery path="assets/images/gallery" >}}
{{< csv-to-table >}}...{{< /csv-to-table >}}
{{< initiative title="..." image="..." >}}...{{< /initiative >}}
{{< donor-accordion >}}
```

Use these for rich, reusable UI components in markdown content.

## Key Configuration

### hugo.toml Critical Settings
- `defaultContentLanguageInSubdir: true` - Routes languages to `/en/` and `/kn/`
- `relativeURLs: true` - Enables deployment to subdirectories
- `params.stats_*` - Homepage statistics counters
- `params.directory.json_api_url` - Google Sheets API endpoint for dynamic directory
- Menu configuration per language: `[[languages.en.menu.main]]` and `[[languages.kn.menu.main]]`

### Common Frontmatter Fields
```yaml
---
title: "Page Title"
date: 2025-01-15
featuredImage: "/assets/images/featured.jpg"
summary: "Brief description"
tags: ["Infrastructure", "Community"]
author: "NRRWA"
draft: false
---
```

## External Integrations

### Search (Pagefind)
- Must run `npx pagefind --site public` after Hugo builds
- Search UI embedded in `layouts/_default/baseof.html`
- Indexes content within `<main data-pagefind-body>` tags
- Creates `/public/pagefind/` directory with search index

### Dynamic Directory (Google Sheets API)
- API URL configured in `hugo.toml`: `params.directory.json_api_url`
- JavaScript in `assets/js/directory.js` fetches community-contributed contacts
- Expected JSON format: `{ name: "Section", contacts: [{name, phone, email}] }`
- Static official contacts stored in `data/directory.yaml`
- Submission form: `params.directory.submission_form_url`

### Theme Toggle (Dark Mode)
- Implemented in `assets/js/main.js`
- Persisted to localStorage
- Falls back to system preference detection
- CSS variables in `assets/css/style.css` control theming
- Attribute: `[data-theme="dark"]` on `<html>` element

## Common Development Patterns

### Adding New Content

**News Article**:
1. Create `content/news/article-slug.en.md` and `article-slug.kn.md`
2. Include frontmatter: `title`, `date`, `featuredImage`, `summary`, `tags`
3. Content will auto-appear in news list and homepage

**Focus Area**:
1. Create `content/focus/area-slug.en.md` and `.kn.md`
2. Add entry to `data/focus.yaml`:
   ```yaml
   area-slug:
     en:
       intro: "..."
       initiatives: [...]
       impact: [...]
     kn:
       intro: "..."
       initiatives: [...]
       impact: [...]
   ```
3. Add images to `assets/images/focus/`

**Events**:
1. Create `content/events/event-slug.en.md` and `.kn.md`
2. Include `date` and `eventDate` in frontmatter
3. Future events auto-filter on homepage

### Modifying Navigation

Edit `hugo.toml` menu sections:
- English menus: `[[languages.en.menu.main]]`
- Kannada menus: `[[languages.kn.menu.main]]`
- Set `name`, `url`, and `weight` (for ordering)

### Updating Homepage Statistics

Edit `hugo.toml` params:
```toml
[params]
  stats_members = 343
  stats_yearsOfService = 4
  stats_eventsOrganized = 62
  stats_saplingsDistributed = 1250
```

### Creating Custom Layouts

1. Create section-specific template: `layouts/<section>/single.html` or `list.html`
2. Extend base template: `{{ define "main" }}...{{ end }}`
3. Access page data: `.Title`, `.Content`, `.Params`, `.Date`
4. Access site data: `.Site.Data`, `.Site.Params`, `.Site.Menus`

## Troubleshooting

### Search Not Working
1. Verify `public/pagefind/` directory exists
2. Run `npx pagefind --site public` after building
3. Check browser console for pagefind errors
4. Ensure `<main data-pagefind-body>` wraps content in `baseof.html`

### Focus Pages Empty
1. Check `data/focus.yaml` has entry matching page's `.File.TranslationBaseName`
2. Verify language keys (`en:` and `kn:`) exist in data
3. Confirm template uses: `{{ index .Site.Data.focus .Language.Lang }}`

### Dynamic Directory Empty
1. Test `params.directory.json_api_url` in browser
2. Check console for CORS errors
3. Verify JSON format matches expected structure
4. Confirm `data-api-url` attribute is set in directory template

### CSS/JS Changes Not Appearing
1. Check asset pipeline: `resources.Get` in `baseof.html`
2. Fingerprinting changes hash in URLs - hard refresh browser
3. Rebuild with `hugo --minify` to regenerate fingerprints

### Language Switching Broken
1. Verify both `.en.md` and `.kn.md` files exist with same base name
2. Check translation links use: `{{ range .Translations }}`
3. Confirm `defaultContentLanguageInSubdir: true` in config

## Important Constraints

- **Never edit `public/` directory** - it's generated output
- **Always create bilingual content** - both `.en.md` and `.kn.md` files
- **Data files must have language keys** - use `en:` and `kn:` structure
- **Run Pagefind after builds** - search won't work without indexing
- **Assets go in `assets/`** - not `static/` - for pipeline processing
- **Use Hugo image processing** - don't commit large unprocessed images

## Site Statistics

- Build time: ~137ms (17x faster than previous Eleventy implementation)
- Content pages: ~100+ bilingual pages
- Members: 343 (as of latest stats)
- Languages: 2 (English, Kannada)
- Deployment: Static HTML to any host (Netlify, Vercel, GitHub Pages, etc.)
