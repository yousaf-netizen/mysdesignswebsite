# MYS Designs website

## How to edit the site (no coding)

Everything you can change lives in one file: `content/site.json`.

1. Open `content/site.json` on GitHub (click the file, then the pencil icon).
2. Change the text, images or links you want. Keep the quote marks and commas as they are.
3. Click "Commit changes". Vercel rebuilds and publishes the site in about a minute.

- **Add a project:** copy one whole block between `{` and `}` inside `"projects"`, change `slug` (lowercase, dashes, no spaces), and fill in the rest. The slug becomes the web address `/projects/your-slug/`.
- **Change a case study:** edit the text inside `"sections"`.
- **Images:** each entry in `"images"` is a file name from the Framer image links. To use your own image, add it to `public/images/` and write `"/images/yourfile.jpg"` instead.
- **Contact email:** `"email"` in `"site"` controls the contact form and the email links.

Do not edit `build.js` unless you are changing the layout.

## One-time setup (GitHub + Vercel)

1. Create a new GitHub repository (private is fine) and upload this whole folder with "Add file > Upload files".
2. In Vercel, open the `studio-site` project > Settings > Git, and connect the repository.
3. In Vercel Settings > Build & Development Settings set:
   - Build Command: `node build.js`
   - Output Directory: `dist`
   - Install Command: leave empty
4. Redeploy. Once it is working, the alias `studio-site-eta-henna.vercel.app` (and later mysdesigns.co.uk) can be moved to the new production deployment.

## Contact form

Enquiries are sent to worktogether@mysdesigns.co.uk by FormSubmit (formsubmit.co). The first time, FormSubmit emails that address a confirmation link. Click it once and the form works for every enquiry after that.

## SEO

Page addresses, titles, descriptions, canonical links, Open Graph tags, sitemap.xml and robots.txt match the current live site, so moving the site over will not break existing links or rankings.
