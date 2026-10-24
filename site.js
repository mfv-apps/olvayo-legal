// Olvayo legal and support site.
// Loaded in <head> without `defer`, so the language is set before the page draws.

(function () {
  const root = document.documentElement;
  const storageKey = "olvayo-lang";

  function savedLanguage() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function setLanguage(lang, remember) {
    root.dataset.lang = lang;
    root.lang = lang;
    const title = lang === "tr" ? root.dataset.titleTr : root.dataset.titleEn;
    if (title) document.title = title;
    // Text that cannot hold both languages side by side: menu options and placeholders.
    document.querySelectorAll("option[data-en]").forEach((option) => {
      option.textContent = option.dataset[lang];
    });
    document.querySelectorAll("[data-placeholder-en]").forEach((field) => {
      field.placeholder = lang === "tr" ? field.dataset.placeholderTr : field.dataset.placeholderEn;
    });
    document.querySelectorAll(".lang-switch button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.setLang === lang));
    });
    if (remember) {
      try {
        localStorage.setItem(storageKey, lang);
      } catch {
        // Private mode: the choice lasts for this page only.
      }
    }
  }

  // Turkish for Turkish browsers, English otherwise, unless the visitor picked one.
  const browserLanguage = (navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "en";
  setLanguage(savedLanguage() || browserLanguage, false);

  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(root.dataset.lang, false);

    document.querySelectorAll(".lang-switch button").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.setLang, true));
    });

    setUpSupportForm();
  });

  // The support form sends nothing itself: it opens the visitor's mail app with the message filled in.
  function setUpSupportForm() {
    const form = document.getElementById("support-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const lang = root.dataset.lang;
      const topic = form.elements.topic.selectedOptions[0];
      const topicName = topic.dataset[lang] || topic.textContent.trim();
      const message = form.elements.message.value.trim();
      const details = lang === "tr"
        ? "\n\n---\niPhone modeli:\niOS sürümü:\nOlvayo sürümü:"
        : "\n\n---\niPhone model:\niOS version:\nOlvayo version:";

      const subject = encodeURIComponent(`Olvayo · ${topicName}`);
      const body = encodeURIComponent(message + details);
      window.location.href = `mailto:${form.dataset.email}?subject=${subject}&body=${body}`;
    });
  }
})();
