const sections = ["experience", "travel", "about", "guestbook", "contact"];
const navigation = document.querySelector("#navigation");
const chapters = document.querySelector("#chapters");
const templates = document.querySelector("#templates");
const languageButtons = document.querySelectorAll("[data-lang]");

function renderStop(stop) {
  const date = stop.date ? `<p class="date">${stop.date}</p>` : "";
  const bullets = stop.bullets
    ? `<ul>${stop.bullets.map(([label, detail]) => `<li><strong>${label}</strong> ${detail}</li>`).join("")}</ul>`
    : "";
  return `<article class="stop">
    <div class="stop-meta"><p>${stop.route}</p>${date}</div>
    <div class="stop-content"><h4>${stop.title}</h4><p>${stop.description}</p>${bullets}</div>
  </article>`;
}

function renderLanguage(language) {
  const page = copy[language];
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = page.title;
  document.querySelector('meta[name="description"]').content = page.description;
  document.querySelectorAll("[data-copy]").forEach((element) => {
    element.textContent = page[element.dataset.copy];
  });
  document.querySelector(".cover img").alt = page.photoAlt;
  navigation.setAttribute("aria-label", page.navLabel);
  navigation.innerHTML = sections.map((id, index) => `<a href="#${id}">${page.nav[index]}</a>`).join("");
  chapters.innerHTML = page.chapters.map((chapter, index) => `<section class="chapter" aria-labelledby="chapter-${index}">
    <h3 id="chapter-${index}">${chapter}</h3>
    <div class="route">${page.stops.slice(index * 3, index * 3 + 3).map(renderStop).join("")}</div>
  </section>`).join("");
  templates.innerHTML = page.templates.map(([title, description], index) => {
    const id = sections[index + 1];
    return `<section class="template" id="${id}" aria-labelledby="${id}-title">
      <h2 id="${id}-title">${title}</h2><p>${description}</p>
    </section>`;
  }).join("");
  languageButtons.forEach((button) => button.setAttribute("aria-pressed", button.dataset.lang === language));
}

const initialLanguage = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
renderLanguage(initialLanguage);

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.lang;
    if (button.getAttribute("aria-pressed") === "true") return;
    renderLanguage(language);
    if (location.protocol !== "file:") {
      const url = new URL(location.href);
      url.searchParams.set("lang", language);
      history.replaceState(null, "", url);
    }
  });
});

if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant" }));
}
