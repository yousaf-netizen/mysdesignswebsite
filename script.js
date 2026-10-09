// Reads content/site.json and renders the gallery, studio, process and case study pages.
const page = document.body.dataset.page;

fetch("content/site.json").then((r) => r.json()).then((site) => {
  if (page === "projects") renderGallery(site);
  if (page === "studio") renderSplit(site.studio, "studio");
  if (page === "process") renderSplit(site.process, "process");
  if (page === "case") renderCase(site);
});

function renderGallery(site) {
  const main = document.getElementById("gallery");
  site.projects.forEach((p, i) => {
    const block = document.createElement("article");
    block.className = "project-block" + (i % 2 ? " reverse" : "");
    block.innerHTML = `
      <div class="wall">
        ${p.wall.map((src) => `<figure class="frame"><img src="${esc(src)}" alt="${esc(p.title)}" loading="lazy"></figure>`).join("")}
      </div>
      <div class="caption-bar">${esc(p.caption)}</div>
      <div class="project-text">
        <h2>${esc(p.title)}</h2>
        <p>${esc(p.summary)}</p>
        <a href="case-study.html?slug=${encodeURIComponent(p.slug)}">View case study</a>
      </div>`;
    main.appendChild(block);
  });
  reveal();
}

function renderSplit(items, key) {
  const menu = document.getElementById("side-menu");
  const content = document.getElementById("split-content");
  const show = (i) => {
    menu.querySelectorAll("button").forEach((b, j) => b.classList.toggle("active", i === j));
    content.innerHTML = `<div class="fade"><h2>${esc(items[i].heading)}</h2><p>${esc(items[i].text)}</p></div>`;
  };
  items.forEach((item, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = item.label;
    b.addEventListener("click", () => show(i));
    menu.appendChild(b);
  });
  show(0);
}

function renderCase(site) {
  const slug = new URLSearchParams(location.search).get("slug");
  const p = site.projects.find((x) => x.slug === slug) || site.projects[0];
  document.title = `${p.title} | MYS Designs`;
  document.getElementById("case").innerHTML = `
    <h1>${esc(p.title)}</h1>
    <dl class="meta">
      <div><dt>Client</dt><dd>${esc(p.client)}</dd></div>
      <div><dt>Services</dt><dd>${esc(p.services)}</dd></div>
      <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
    </dl>
    ${p.case.map((s) => `
      <section>
        <h2>${esc(s.heading)}</h2>
        <p>${esc(s.text)}</p>
        ${s.images && s.images.length ? `<div class="images">${s.images.map((src) => `<img src="${esc(src)}" alt="">`).join("")}</div>` : ""}
      </section>`).join("")}`;
}

function reveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".frame").forEach((el) => io.observe(el));
}

function esc(s = "") {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
