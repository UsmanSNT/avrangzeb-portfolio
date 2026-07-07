export type Theme = "dark" | "light";

export const themeStorageKey = "portfolio-theme";

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  window.setTimeout(() => root.classList.remove("theme-transition"), 350);
}

/**
 * Inline script source injected before hydration so the correct theme is
 * painted on the very first frame (no flash of the wrong theme). Keep this
 * string self-contained - it runs outside the React/module graph.
 */
export const themeInitScript = `
(function () {
  try {
    var key = "${themeStorageKey}";
    var stored = localStorage.getItem(key);
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;
