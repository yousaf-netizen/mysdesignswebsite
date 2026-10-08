// MYS Designs site builder.
// Edit content/site.json, then run: node build.js  (writes the site to dist/)
const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "content", "site.json"), "utf8"));
const S = data.site;
const P = data.projects;
const OUT = path.join(__dirname, "dist");
const today = new Date().toISOString().slice(0, 10);
const CDN = "https://framerusercontent.com/images/";

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const img = (file, cls = "", alt = "", eager = false) =>
  `<img src="${CDN}${file}?width=1600" alt="${esc(alt)}" class="${cls}" ${eager ? "" : 'loading="lazy"'} decoding="async">`;

const CSS = `
@font-face{font-family:"Clash Grotesk";src:url(/assets/fonts/ClashGrotesk-Regular.otf) format("opentype");font-weight:400;font-display:swap}
@font-face{font-family:"Clash Grotesk";src:url(/assets/fonts/ClashGrotesk-Medium.otf) format("opentype");font-weight:500;font-display:swap}
@font-face{font-family:"Clash Grotesk";src:url(/assets/fonts/ClashGrotesk-Semibold.otf) format("opentype");font-weight:600;font-display:swap}
:root{--purple:#9643ff;--royal:#450a8f;--deep:#2e0365;--black:#1e1e1e;--white:#fefefe;--champagne:#c0a27e;--muted:#a3a3a3;--line:#2e2e2e}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Clash Grotesk",Arial,sans-serif;font-weight:400;background:var(--black);color:var(--white);display:flex;min-height:100vh;line-height:1.6}
a{color:inherit}
aside{width:380px;flex-shrink:0;border-right:1px solid var(--line);height:100vh;position:sticky;top:0;overflow-y:auto;display:flex;flex-direction:column}
.brand{padding:30px 28px 24px;border-bottom:1px solid var(--line)}
.brand img{height:26px;width:auto;display:block}
.brand p{color:var(--muted);font-size:13px;margin-top:10px}
nav.top{display:flex;gap:18px;padding:18px 28px;border-bottom:1px solid var(--line);font-size:12px;font-weight:500;letter-spacing:.12em;text-transform:uppercase}
nav.top a{color:var(--muted);text-decoration:none}
nav.top a.active{color:var(--purple)}
.section-label{padding:20px 28px 10px;font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
details{border-bottom:1px solid var(--line)}
summary{list-style:none;cursor:pointer;padding:18px 28px;display:flex;justify-content:space-between;align-items:center;gap:12px}
summary::-webkit-details-marker{display:none}
summary .name{font-family:"Clash Grotesk",sans-serif;font-weight:600;font-size:18px}
summary .meta{display:block;font-size:12px;color:var(--muted);margin-top:4px}
summary .chev{color:var(--purple);transition:transform .2s;font-size:18px}
details[open] summary .chev{transform:rotate(45deg)}
.info{padding:0 28px 22px;color:#d4d4d4;font-size:14px}
.info a{color:var(--purple);font-weight:500;text-decoration:none;display:inline-block;margin-top:10px}
.contact{margin-top:auto;padding:24px 28px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
.contact a{color:var(--white);text-decoration:none}
.contact .btn{display:inline-block;margin-bottom:12px;background:var(--purple);color:var(--white);padding:10px 16px;text-decoration:none;font-weight:500;font-size:13px}
main{flex:1;min-width:0;background:var(--deep);padding:44px 48px;display:flex;flex-direction:column;gap:22px}
main h1{font-family:"Clash Grotesk",sans-serif;font-weight:600;font-size:40px;letter-spacing:-0.02em;line-height:1.1}
.sub{color:var(--champagne);font-size:14px;margin-top:8px}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.gallery img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:var(--royal);border-radius:4px}
.gallery img.wide{grid-column:span 2;aspect-ratio:16/9}
.case{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:26px 36px;margin-top:10px}
.case h3{font-family:"Clash Grotesk",sans-serif;font-weight:500;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--champagne);margin-bottom:8px}
.case p{color:#e6e6e6;font-size:15px}
.cta{background:var(--purple);padding:26px 28px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
.cta a{color:var(--white);font-weight:600;text-decoration:none;font-size:16px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px}
.card{text-decoration:none;display:block}
.card img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:var(--royal);border-radius:4px}
.card h2{font-family:"Clash Grotesk",sans-serif;font-weight:600;font-size:20px;margin-top:12px}
.card span{color:var(--champagne);font-size:13px}
form{display:grid;gap:16px;max-width:620px}
label{display:grid;gap:6px;font-size:13px;color:var(--champagne);font-weight:500;letter-spacing:.04em}
input,select,textarea{font:inherit;font-size:15px;color:var(--white);background:var(--black);border:1px solid var(--line);padding:12px 14px;border-radius:0;width:100%}
input:focus,select:focus,textarea:focus{outline:1px solid var(--purple);border-color:var(--purple)}
textarea{min-height:150px;resize:vertical}
button{font:inherit;font-weight:600;background:var(--purple);color:var(--white);border:0;padding:14px 22px;cursor:pointer;justify-self:start;font-size:15px}
footer{padding:18px 48px;background:var(--purple);color:var(--white);font-size:13px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
footer a{color:var(--white)}
@media(max-width:900px){body{flex-direction:column}aside{width:100%;height:auto;position:relative}main{padding:26px}.gallery img.wide{grid-column:span 1}}
`;

function sidebar(activeSlug, activeNav) {
  const items = P.map((p) => {
    const open = p.slug === activeSlug ? " open" : "";
    return `<details data-slug="${p.slug}"${open}>
  <summary><div><span class="name">${esc(p.name)}</span><span class="meta">${esc(p.category)} · ${esc(p.year)}</span></div><span class="chev">+</span></summary>
  <div class="info"><p>${esc(p.summary)}</p><a href="/projects/${p.slug}/">View case study →</a></div>
</details>`;
  }).join("\n");
  return `<aside>
  <div class="brand"><a href="/"><img src="/assets/wordmark-white.svg" alt="MYS Designs"></a><p>Premium brand identity for ambitious businesses. Manchester, UK.</p></div>
  <nav class="top"><a href="/" class="${activeNav === "work" ? "active" : ""}">Projects</a><a href="/contact/" class="${activeNav === "contact" ? "active" : ""}">Contact</a></nav>
  <div class="section-label">Projects</div>
  ${items}
  <div class="contact"><a class="btn" href="/contact/">Start a project</a><p><a href="mailto:${S.email}">${S.email}</a></p></div>
</aside>`;
}

function projectFragment(p) {
  const gallery = p.images.map((f, i) => img(f, i === 0 ? "wide" : "", `${p.name} work ${i + 1}`, i === 0)).join("");
  const sections = p.sections.map((s) => `<div><h3>${esc(s.heading)}</h3><p>${esc(s.body)}</p></div>`).join("");
  return `<div><h1>${esc(p.name)}</h1><p class="sub">${esc(p.client)} · ${esc(p.category)} · ${esc(p.year)} · ${esc(p.timeline)}</p></div>
<div class="gallery">${gallery}</div>
<div class="case">${sections}</div>
<div class="cta"><span>Have a project in mind?</span><a href="/contact/">Start a project →</a></div>`;
}

function homeFragment() {
  const cards = P.map((p) => `<a class="card" href="/projects/${p.slug}/">${img(p.images[0], "", p.name, true)}<h2>${esc(p.name)}</h2><span>${esc(p.category)} · ${esc(p.year)}</span></a>`).join("");
  return `<div><h1>${esc(S.heading)}</h1><p class="sub">${esc(S.subheading)}</p></div><div class="cards">${cards}</div>`;
}

function contactFragment() {
  return `<div><h1>Start a project</h1><p class="sub">Tell us about your business and what you need. We reply within two working days.</p></div>
<form action="https://formsubmit.co/${S.email}" method="POST">
  <input type="hidden" name="_subject" value="New enquiry from mysdesigns.co.uk">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_captcha" value="true">
  <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
  <label>Name<input type="text" name="name" required></label>
  <label>Email<input type="email" name="email" required></label>
  <label>Company<input type="text" name="company"></label>
  <label>What do you need?<select name="service" required><option value="">Choose one</option><option>Logo design</option><option>Brand identity</option><option>Brand strategy</option><option>Something else</option></select></label>
  <label>Tell us about your project<textarea name="message" required></textarea></label>
  <button type="submit">Send enquiry</button>
</form>`;
}

function footer() {
  return `<footer><span>© MYS Designs</span><a href="mailto:${S.email}">${S.email}</a><span>Manchester, UK</span></footer>`;
}

function page({ title, description, canonical, ogImage, body, jsonld = null, activeSlug = "", activeNav = "work", mainHtml, fragments = null }) {
  const ld = jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : "";
  const frag = fragments
    ? `<script>window.MYS_FRAGMENTS=${JSON.stringify(fragments).replace(/</g, "\\u003c")};</script>
<script>
document.querySelectorAll("details[data-slug]").forEach(function(d){
  d.addEventListener("toggle",function(){
    if(!d.open) return;
    document.querySelectorAll("details[data-slug]").forEach(function(o){ if(o!==d) o.open=false; });
    var html = window.MYS_FRAGMENTS[d.dataset.slug];
    if(html){ document.getElementById("main").innerHTML = html; history.replaceState(null,"","/projects/"+d.dataset.slug+"/"); document.title = d.querySelector(".name").textContent + " - MYS Designs Branding Agency"; window.scrollTo(0,0); }
  });
});
</script>` : "";
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MYS Designs">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
${ld}
<style>${CSS}</style>
</head>
<body>
${sidebar(activeSlug, activeNav)}
<main id="main">${mainHtml}</main>
${footer()}
${frag}
</body>
</html>`;
}

function write(rel, content) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
}

// ---- build ----
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(__dirname, "public"), OUT, { recursive: true });

const fragments = Object.fromEntries(P.map((p) => [p.slug, projectFragment(p)]));

write("index.html", page({
  title: S.title,
  description: S.description,
  canonical: `${S.url}/`,
  ogImage: S.ogImage,
  jsonld: { "@context": "https://schema.org", "@type": "ProfessionalService", name: S.name, url: `${S.url}/`, email: S.email, description: S.description, address: { "@type": "PostalAddress", addressLocality: "Manchester", addressCountry: "GB" } },
  activeNav: "work",
  mainHtml: homeFragment(),
  fragments,
}));

for (const p of P) {
  const url = `${S.url}/projects/${p.slug}/`;
  const title = `${p.name} - MYS Designs Branding Agency`;
  write(`projects/${p.slug}/index.html`, page({
    title,
    description: p.summary,
    canonical: url,
    ogImage: p.ogImage,
    jsonld: { "@context": "https://schema.org", "@type": "CreativeWork", name: p.name, url, creator: { "@type": "Organization", name: S.name, url: `${S.url}/` }, dateCreated: p.year, description: p.summary },
    activeSlug: p.slug,
    activeNav: "work",
    mainHtml: fragments[p.slug],
    fragments,
  }));
}

write("contact/index.html", page({
  title: `Contact - ${S.name}`,
  description: `Start a project with MYS Designs, a brand identity studio in Manchester. Email ${S.email}.`,
  canonical: `${S.url}/contact/`,
  ogImage: S.ogImage,
  activeNav: "contact",
  mainHtml: contactFragment(),
}));

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${S.url}/</loc><lastmod>${today}</lastmod></url>
${P.map((p) => `<url><loc>${S.url}/projects/${p.slug}/</loc><lastmod>${today}</lastmod></url>`).join("\n")}
<url><loc>${S.url}/contact/</loc><lastmod>${today}</lastmod></url>
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${S.url}/sitemap.xml\n`);

console.log("Built", OUT, "pages:", 2 + P.length);
