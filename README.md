# NRRWA Website - Hugo Version

This is a Hugo implementation of the NRRWA website, showcasing Hugo's built-in features for multilingual sites.

## Key Differences from Eleventy Version

### 1. **Multilingual Support (Built-in)**
- **Eleventy**: Manual `/en/` and `/kn/` folder structure
- **Hugo**: Uses `.en.md` and `.kn.md` suffixes with built-in i18n
  - `content/news/article.en.md` → English version
  - `content/news/article.kn.md` → Kannada version
- Language switching is automatic via `{{ .Translations }}`

### 2. **Configuration**
- **Eleventy**: `.eleventy.js` with JavaScript
- **Hugo**: `hugo.toml` with declarative TOML config
- Hugo config includes language parameters, menu items per language, taxonomy setup

### 3. **Content Organization**
- **Eleventy**: Flat structure with collections
- **Hugo**: Section-based (content sections become URL sections automatically)
  - `/content/news/` → `/news/` URL
  - `/content/events/` → `/events/` URL

### 4. **Templates**
- **Eleventy**: Nunjucks (`.njk`)
- **Hugo**: Go templates (`.html`)
  - `{{ if eq .Language.Lang "en" }}` for language conditionals
  - `{{ .Site.Params }}` for site-wide variables
  - `{{ .Permalink }}`, `{{ .Title }}` for page data

### 5. **Taxonomies (Tags/Categories)**
- **Eleventy**: Manual filtering with custom filters
- **Hugo**: Built-in taxonomy system
  - Add `tags: [Infrastructure]` to frontmatter
  - Auto-generates `/tags/infrastructure/` pages
  - `.Site.Taxonomies.tags` gives all tags with counts

### 6. **Pagination**
- **Eleventy**: Manual pagination configuration in frontmatter
- **Hugo**: Built-in with `.Paginate`
  - `{{ $paginator := .Paginate .Pages }}`
  - `{{ template "_internal/pagination.html" . }}` for nav

### 7. **Build Speed**
- **Eleventy**: ~2.4 seconds
- **Hugo**: 137ms (17x faster!)

### 8. **Menus**
- **Eleventy**: Hardcoded in base template
- **Hugo**: Configured in `hugo.toml`
  - Separate menu per language
  - `{{ range .Site.Menus.main }}` in template

### 9. **Image Processing**
- **Eleventy**: External tools (ImageMagick)
- **Hugo**: Built-in image processing
  - `.Resize "800x"`
  - `.Fill "400x300"`
  - `.Fit "600x400"`

### 10. **Static Assets**
- **Eleventy**: `src/assets/` → `_site/assets/` (via passthrough)
- **Hugo**: `static/` → `/` (automatic)

## Running the Site

```bash
# Development server with live reload
hugo server -D

# Build for production
hugo

# Build with drafts
hugo --buildDrafts
```

## Project Structure

```
nrrwa-website/
├── hugo.toml              # Configuration (i18n, menus, params)
├── content/               # All content (multilingual with .en/.kn suffixes)
│   ├── _index.en.md       # Home page (English)
│   ├── _index.kn.md       # Home page (Kannada)
│   ├── news/
│   │   ├── article.en.md  # English article
│   │   └── article.kn.md  # Kannada translation
│   ├── events/
│   ├── focus/
│   └── partners/
├── layouts/               # Templates
│   ├── _default/
│   │   ├── baseof.html    # Base template (like base.njk)
│   │   ├── single.html    # Single page/post
│   │   └── list.html      # List pages
│   ├── partials/
│   │   └── footer.html    # Reusable components
│   ├── news/              # Section-specific templates
│   └── index.html         # Home page template
├── static/                # Static files (CSS, JS, images)
│   ├── css/
│   ├── js/
│   └── assets/
└── public/                # Generated site (like _site/)
```

## Hugo Features Used

1. **Multilingual Mode**: Automatic language routing
2. **Taxonomies**: Auto-generated tag/category pages
3. **Pagination**: Built-in with templates
4. **Menus**: Configured in config file
5. **Permalinks**: Customizable URL patterns
6. **Content Types**: Automatic based on section
7. **Translations**: `{{ .Translations }}` for language switcher

## Benefits of Hugo Approach

✅ Faster builds (137ms vs 2400ms)
✅ Less configuration code
✅ Built-in i18n features
✅ Automatic taxonomy pages
✅ No npm dependencies
✅ Single binary executable

## Considerations

- Go template syntax has steeper learning curve than Nunjucks
- Less flexible than Eleventy for complex custom logic
- More opinionated structure (can be pro or con)

## Next Steps to Complete Migration

1. Migrate remaining content files from Eleventy
2. Create section list templates for events, focus areas, partners
3. Set up taxonomy templates for tags/categories
4. Add RSS feeds (Hugo does this automatically)
5. Configure deployment
6. Run Pagefind after Hugo build for search

## Deployment

Hugo generates static files in `/public/`. Deploy this folder to any static host:
- Netlify
- Vercel
- GitHub Pages
- Any web server

```bash
# Build for production
hugo --minify

# Deploy public/ folder
```
