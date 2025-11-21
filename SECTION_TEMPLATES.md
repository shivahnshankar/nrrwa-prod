# Section List Templates - Documentation

## Overview

Custom section list templates have been created for better presentation of content in each major section. These templates provide a more polished and user-friendly experience compared to the default Hugo list template.

## Created Templates

### 1. Events List Template
**Location**: `/layouts/events/list.html`

**Features**:
- **Upcoming Events Section**: Shows future events sorted by date
- **Past Events Section**: Shows up to 6 recent past events
- Uses `eventDate` parameter to determine future/past
- Card-based layout with featured images
- Empty state messages when no events available
- Bilingual support (EN/KN)

**Special Logic**:
```go
{{ $now := now }}
{{ $upcomingEvents := where .Pages "Params.eventDate" "ge" $now }}
{{ $pastEvents := where .Pages "Params.eventDate" "lt" $now }}
```

### 2. Focus Areas List Template
**Location**: `/layouts/focus/list.html`

**Features**:
- Introduction text explaining NRRWA's focus areas
- Card grid displaying all focus area pages
- Icons/featured images for each area
- Call-to-action section to join NRRWA
- Auto-excludes index pages from listing
- Responsive grid layout

**Key Elements**:
- Summary text for each focus area
- "Learn More" links to detailed pages
- CTA button linking to membership page

### 3. Partners List Template
**Location**: `/layouts/partners/list.html`

**Features**:
- Introduction explaining partner relationships
- Card-based partner display
- Support for partner logos (optional)
- **Disclaimer box** highlighting independence from NRRWA
- "Partner With Us" call-to-action
- Centered, clean layout

**Special Features**:
- Yellow disclaimer box with warning color scheme
- Contact CTA for potential partners
- Logo display capability (if provided)

### 4. About List Template
**Location**: `/layouts/about/list.html`

**Features**:
- Introduction about NRRWA
- Card grid for all about pages (Vision & Mission, Executive Committee, Guidelines, FAQs)
- **Contextual icons** for each page type
- **Impact stats section** showing:
  - Active Members
  - Years of Service
  - Events Organized
  - Trees Planted
- Green CTA to join NRRWA
- Pulls stats from `hugo.toml` config

**Icon Mapping**:
- Vision & Mission: 🎯
- Executive Committee: 👥
- Guidelines: 📋
- FAQs: ❓
- Default: 📄

## Common Features Across All Templates

### 1. Bilingual Support
All templates check the language and display appropriate text:
```go
{{ if eq .Language.Lang "en" }}
  English text
{{ else }}
  ಕನ್ನಡ ಪಠ್ಯ
{{ end }}
```

### 2. Responsive Design
All use card grids that adapt to screen size:
- Desktop: 3 columns
- Tablet: 2 columns  
- Mobile: 1 column

### 3. Consistent Styling
- Uses existing CSS classes from `style.css`
- `.cards-grid`, `.card`, `.card-content`, `.card-link`
- `.cta-button` for call-to-action buttons
- CSS variables: `var(--primary-green)`, `var(--primary-blue)`

### 4. Index Page Exclusion
All templates exclude `_index.en.md` and `_index.kn.md` from listings:
```go
{{ if ne .File.LogicalName "_index.en.md" }}
{{ if ne .File.LogicalName "_index.kn.md" }}
  // Display page
{{ end }}
{{ end }}
```

## Build Results

After implementing these templates:
- **Total Pages**: 108 (58 EN + 50 KN)
- **Build Time**: 198ms
- **New Section Pages**: 4 custom list pages per language

## Benefits

1. **Better UX**: More intuitive navigation and content discovery
2. **Contextual Information**: Each section provides relevant intro and CTAs
3. **Visual Appeal**: Card-based layouts with icons/images
4. **Mobile Friendly**: All templates are responsive
5. **Bilingual**: Full English and Kannada support
6. **Maintainable**: Uses Hugo's built-in features, no external dependencies

## Customization

To customize these templates:

1. **Change Icons**: Edit the emoji or add custom SVG icons
2. **Modify Layout**: Adjust card grid columns or spacing
3. **Add Filtering**: Use Hugo's `where` function to filter by tags
4. **Change Ordering**: Use `.ByDate`, `.ByWeight`, or `.ByTitle`

## Example Customizations

### Add Featured Focus Area:
```go
{{ range first 1 .Pages }}
  <div class="featured-card">
    <!-- Special styling for featured item -->
  </div>
{{ end }}
```

### Filter by Tag:
```go
{{ range where .Pages ".Params.tags" "intersect" (slice "Priority") }}
  <!-- Only show pages tagged "Priority" -->
{{ end }}
```

### Custom Sorting:
```go
{{ range .Pages.ByWeight.ByTitle }}
  <!-- Sort by weight, then title -->
{{ end }}
```

## Testing

To test the new templates:

```bash
cd /home/shiva/Documents/Share/hugo-new/nrrwa-website

# Start development server
hugo server -D

# Visit these URLs:
# http://localhost:1313/events/
# http://localhost:1313/focus/
# http://localhost:1313/partners/
# http://localhost:1313/about/
```

## Future Enhancements

Potential improvements:
1. Add search/filter functionality within sections
2. Implement pagination for large sections
3. Add sorting controls (by date, title, etc.)
4. Include breadcrumb navigation
5. Add section-specific RSS feeds

## Conclusion

All major sections now have professional, purpose-built list templates that enhance the user experience while maintaining Hugo's performance benefits!
