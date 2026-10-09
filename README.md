# MYS Designs website

## Structure
- `index.html`: Projects gallery (home). Click a project to open its case study.
- `studio.html`: Studio page. Accordion list at the bottom left, image panels on the right.
- `process.html`: Process page. D-I-V-E accordion.
- `case-study.html?slug=<slug>`: Case study page. Uses `project.case` for the accordion and `project.images` for the panels.
- `content/site.json`: All text, projects, and panel settings. Edit this file to change content.
- `styles.css`: Layout, colours, and motion. Brand colours are variables at the top.
- `script.js`: Renders all pages from `site.json`. No build step.

## Adding images
Each panel takes `src` (path to an image in `assets/images/`), `ratio`, and `color` (shown while the image loads or if it's missing). Example:
`{ "src": "assets/images/rapid-transit-1.jpg", "ratio": "16 / 10", "color": "#9643ff" }`

## Adding a project
Copy an object in `projects`, give it a unique `slug`, and update `wall`, `images`, and `case`.

## Fonts
Add Clash Grotesk as `assets/fonts/ClashGrotesk-Medium.woff2`. Until then, a system sans is used.

## Deploy
Push this folder to GitHub with `index.html` at the root, then import the repo in Vercel. No build settings needed.
