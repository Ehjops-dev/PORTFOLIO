const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll("[data-nav-link]");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");
const typedName = document.querySelector("#typed-name");
const themeToggle = document.querySelector(".theme-toggle");

const storageKey = "portfolio-theme";
const savedTheme = localStorage.getItem(storageKey);

if (savedTheme === "dark") {
  document.documentElement.dataset.theme = "dark";
}

document.body.classList.add("js-enabled");

if (year) {
  year.textContent = new Date().getFullYear();
}

function syncThemeToggle() {
  if (!themeToggle) {
    return;
  }

  const isDark = document.documentElement.dataset.theme === "dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

syncThemeToggle();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";

    if (isDark) {
      delete document.documentElement.dataset.theme;
      localStorage.setItem(storageKey, "light");
    } else {
      document.documentElement.dataset.theme = "dark";
      localStorage.setItem(storageKey, "dark");
    }

    syncThemeToggle();
  });
}

if (typedName) {
  const text = typedName.dataset.text || "";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    typedName.textContent = text;
  } else {
    typedName.classList.add("is-typing");

    [...text].forEach((character, index) => {
      window.setTimeout(() => {
        typedName.textContent += character;

        if (index === text.length - 1) {
          window.setTimeout(() => {
            typedName.classList.remove("is-typing");
          }, 1100);
        }
      }, 90 * index);
    });
  }
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navItems.forEach((item) => {
          item.classList.toggle(
            "is-active",
            item.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
