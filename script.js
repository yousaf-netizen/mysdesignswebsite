// Renders every page from content/site.json.
const page = document.body.dataset.page;
const $ = (sel) => document.querySelector(sel);
const FRAMER_CDN = "https://framerusercontent.com/images/";

document.querySelectorAll("[data-nav]").forEach((a) => {
  const target = page === "case" ? "projects" : page;
  if (a.dataset.nav === target) a.classList.add("active");
});

fetch("content/site.json")
  .then((r) => r.json())
  .then((site) => {
    if (page === "projects") renderProjects(site);
    if (page === "studio") renderSection(site.studio, site.panels.studio);
    if (page === "process") renderSection(site.process, site.panels.process);
    if (page === "case") renderCase(site);
    observeTiles();
  })
  .catch((err) => console.error("Could not load site content:", err));

// "cdn:<id>" points at the Framer image CDN. Other values are local paths.
function resolve(src = "") {
  return src.startsWith("cdn:") ? FRAMER_CDN + src.slice(4) : src;
}

// One tile (image panel). Falls back to a flat brand-colour block if the image is missing.
function tile(t, extraClass = "") {
  const ratio = t.ratio || "16 / 10";
  const img = t.src
    ? `<img src="${esc(resolve(t.src))}" alt="${esc(t.alt || "")}" loading="lazy" onerror="this.remove()">`
    : "";
  const label = t.label ? `<span class="tile-label">${esc(t.label)}</span>` : "";
  return `<div class="tile ${extraClass}" style="--tile:${esc(t.color || "#9643ff")};aspect-ratio:${esc(ratio)}">${img}${label}</div>`;
}

// First tile full width, then the rest in pairs.
function wallHTML(items, labelFirst) {
  const [first, ...rest] = items;
  let html = first ? tile({ ...first, label: labelFirst || first.label }) : "";
  for (let i = 0; i < rest.length; i += 2) {
    const pair = rest.slice(i, i + 2);
    html += pair.length === 1 ? tile(pair[0]) : `<div class="row">${pair.map((t) => tile(t)).join("")}</div>`;
  }
  return html;
}

// Home page: intro on the left, a card that follows whichever project is in view.
function renderProjects(site) {
  $("#left-meta").innerHTML = `<h1>${esc(site.intro.title)}</h1><p class="intro-text">${esc(site.intro.text)}</p>`;

  $("#stack").innerHTML = site.projects.map((p, i) => `
    <a class="project" data-index="${i}" href="case-study.html?slug=${encodeURIComponent(p.slug)}" aria-label="${esc(p.title)} case study">
      ${tile({ ...p.wall[0], label: p.title })}
      <div class="caption">${esc(p.caption)}</div>
    </a>`).join("");

  const card = document.createElement("div");
  card.className = "scroll-card";
  card.innerHTML = cardHTML(site.projects[0]);
  $("#left-bottom").appendChild(card);

  let current = 0;
  let timer = null;
  const show = (i) => {
    if (i === current && timer === null) return;
    current = i;
    clearTimeout(timer);
    card.classList.add("swap");
    timer = setTimeout(() => {
      card.innerHTML = cardHTML(site.projects[current]);
      card.classList.remove("swap");
      timer = null;
    }, 250);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) show(Number(e.target.dataset.index)); });
  }, { rootMargin: "-40% 0px -40% 0px" });
  document.querySelectorAll(".project").forEach((el) => io.observe(el));
}

function cardHTML(p) {
  return `
    <div class="card-head">
      <img class="card-thumb" src="${esc(resolve(p.wall[0].src))}" alt="" onerror="this.remove()" style="background:${esc(p.color)}">
      <div>
        <h3 class="card-title">${esc(p.title)}</h3>
        <p class="card-caption">${esc(p.caption)}</p>
      </div>
    </div>
    <p class="card-text">${esc(p.summary)}</p>
    <a class="card-link" href="case-study.html?slug=${encodeURIComponent(p.slug)}">View case study &rarr;</a>`;
}

// Studio and process pages: accordion on the left, panels on the right.
function renderSection(items, panels) {
  renderAccordion(items.map((i) => ({ label: i.label, text: i.text })));
  $("#stack").innerHTML = (panels || []).map((t) => tile(t)).join("");
}

function renderAccordion(items) {
  const box = $("#left-bottom");
  box.innerHTML = "";
  items.forEach((item, i) => {
    const wrap = document.createElement("div");
    wrap.className = "acc" + (i === 0 ? " open" : "");
    wrap.innerHTML = `
      <button class="acc-head" aria-expanded="${i === 0}">${esc(item.label)}</button>
      <div class="acc-body"><div><p>${esc(item.text)}</p></div></div>`;
    wrap.querySelector("button").addEventListener("click", () => {
      box.querySelectorAll(".acc").forEach((el) => {
        el.classList.remove("open");
        el.querySelector("button").setAttribute("aria-expanded", "false");
      });
      wrap.classList.add("open");
      wrap.querySelector("button").setAttribute("aria-expanded", "true");
    });
    box.appendChild(wrap);
  });
}

// Case study: project facts on the left, C.L.E.A.R stages as accordions, images on the right.
function renderCase(site) {
  const slug = new URLSearchParams(location.search).get("slug");
  const p = site.projects.find((x) => x.slug === slug) || site.projects[0];
  document.title = `${p.title} | MYS Designs`;

  $("#left-meta").innerHTML = `
    <h1>${esc(p.title)}</h1>
    <p class="intro-text">${esc(p.summary)}</p>
    <dl>
      <div><dt>Client</dt><dd>${esc(p.client)}</dd></div>
      <div><dt>Services</dt><dd>${esc(p.services)}</dd></div>
      <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
      <div><dt>Timeline</dt><dd>${esc(p.timeline)}</dd></div>
    </dl>`;

  renderAccordion(p.case.map((s) => ({ label: s.label, text: s.text })));

  const images = p.images || [];
  let html = tile({ ...(p.wall[0] || {}), label: p.title, ratio: "16 / 9" });
  p.case.forEach((s, i) => {
    html += `
      <section class="case-block">
        <p class="case-label">${String(i + 1).padStart(2, "0")} / ${esc(s.label)}</p>
        <p class="case-text">${esc(s.text)}</p>
      </section>`;
    if (images[i]) html += tile(images[i]);
  });
  images.slice(p.case.length).forEach((t) => { html += tile(t); });
  $("#stack").innerHTML = html;
}

// Fade and slide tiles in as they enter the viewport. Kept subtle.
function observeTiles() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".tile").forEach((el) => io.observe(el));
}

function esc(s = "") {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
