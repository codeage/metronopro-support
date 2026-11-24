const languageLinks = [...document.querySelectorAll(".languages a")];
const sections = new Map(languageLinks.map((link) => {
  const id = link.hash.slice(1);
  return [id, document.getElementById(id)];
}));
const localizedLinks = [...document.querySelectorAll("[data-localized-link]")];

function preferredLanguage() {
  for (const preference of navigator.languages || [navigator.language]) {
    const locale = preference.toLowerCase();
    if (/^zh-(hant|tw|hk|mo)(-|$)/.test(locale)) return "traditional";
    if (/^zh(-|$)/.test(locale)) return "simplified";
    if (/^en(-|$)/.test(locale)) return "english";
  }
  return "english";
}

function showLanguage() {
  const requested = location.hash.slice(1);
  const current = sections.has(requested) ? requested : preferredLanguage();
  for (const [id, section] of sections) section.hidden = id !== current;
  for (const link of languageLinks) {
    if (link.hash === "#" + current) {
      link.setAttribute("aria-current", "true");
      document.documentElement.lang = link.lang;
    } else {
      link.removeAttribute("aria-current");
    }
  }
  for (const link of localizedLinks) link.hash = current;
  document.title = sections.get(current).querySelector("h1, h2").textContent;
}

for (const link of languageLinks) {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    showLanguage();
  });
}
window.addEventListener("hashchange", showLanguage);
window.addEventListener("popstate", showLanguage);
showLanguage();
