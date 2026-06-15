# PWA Shortcuts (planned)

Proposed `shortcuts` entries for `manifest.json`:

- **Projects** -> `/#projects`
- **Resume** -> `/resume`
- **Contact** -> `/#contact`

Each shortcut should include a 96x96 icon under `/logos/` and a short label.
Adding these improves quick access from the home-screen long-press menu.

## Example JSON

```json
"shortcuts": [
  { "name": "Projects", "url": "/#projects" },
  { "name": "Contact",  "url": "/#contact" }
]
```
