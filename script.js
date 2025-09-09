document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  setupThemeToggle();
  setupMobileNav();
  setupSmoothScroll();
  // setupContactForm();
  setYear();
});

function initializeTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initial);
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        const nav = document.getElementById("site-nav");
        const toggle = document.getElementById("nav-toggle");
        if (nav && toggle) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  if (!form) return;

  const FORM_ENDPOINT = "https://formspree.io/f/xnnbwprv";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!statusEl) return;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const email = String(payload.email || "").trim();
    const name = String(payload.name || "").trim();
    const message = String(payload.message || "").trim();
    if (!name || !email || !message) {
      statusEl.textContent = "Please fill in all fields.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      statusEl.textContent = "Please enter a valid email.";
      return;
    }

    statusEl.textContent = "Sending…";

    try {
      if (FORM_ENDPOINT.includes("xnnbwprv")) {
        statusEl.textContent = "Form endpoint not configured. Replace 'yourid' with your Formspree ID.";
        return;
      }
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        form.reset();
        statusEl.textContent = "Thanks! Your message has been sent.";
      } else {
        statusEl.textContent = "Something went wrong. Please try again later.";
      }
    } catch (err) {
      statusEl.textContent = "Network error. Please try again.";
    }
  });
}

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}


