## Summary
Improve dark-mode readability and fix navigation/header contrast issues by replacing hard-coded colors and gradients with semantic CSS variables so theme overrides apply properly.

## Changes
- Replace literal `white` and hard-coded hex gradients in header, nav and submenus with `var(--color-surface)` and theme-aware variables.
- Replace `var(--light-gray)` hover/active states with `var(--color-background-secondary)` to adapt in dark mode.
- Make hero slide overlay text use `var(--color-text-primary)` instead of hard-coded values.
- Replace numerous hex color literals and gradients across templates and `assets/css/style.css` with semantic variables.
- Add dark-mode screenshots for review under `assets/screenshots/dark-mode/`.

## Verification / Test checklist
- [ ] Build: `hugo --minify` succeeds and `public/` generated.
- [ ] Search: `npx pagefind --site public` completes without errors.
- [ ] Visual checks (Dark mode, `data-theme="dark"`):
  - [ ] Header and nav background are dark and nav links are visible on Home, News, Events, Membership, Directory.
  - [ ] Mobile menu opens and menu items are readable and scrollable.
  - [ ] Submenus and hover/active states remain legible in both light and dark themes.
- [ ] (Optional) Run Lighthouse accessibility / contrast audit and confirm no new failures in navigation elements.

## Screenshots
- `assets/screenshots/dark-mode/home-dark.png`
- `assets/screenshots/dark-mode/news-dark.png`
- `assets/screenshots/dark-mode/events-dark.png`
- `assets/screenshots/dark-mode/membership-dark.png`
- `assets/screenshots/dark-mode/directory-dark.png`

---
If you'd like, I can update the PR with additional screenshots (mobile open menu hover states) or run an automated Lighthouse/axe audit and apply any follow-up fixes based on that report.