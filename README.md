# MYS Designs website

- Text, projects, studio and process copy all live in `content/site.json`. Vercel rebuilds on each push to `main`.
- Add project images to `assets/images/` and list their paths in `wall` (gallery frames) and `case` (case study images).
- Add a new project by copying an object in `projects` with a unique `slug`.
- Add Clash Grotesk as `assets/fonts/ClashGrotesk-Medium.woff2`. Until then, a system font is used.
- Contact links use worktogether@mysdesigns.co.uk. The site doesn't store form submissions.
