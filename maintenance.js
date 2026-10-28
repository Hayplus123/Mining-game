(() => {
  "use strict";

  let redirecting = false;

  // Never redirect away from the maintenance page itself.
  if (/\/maintenance\.html$/i.test(location.pathname)) {
    return;
  }

  function showMaintenance(reason) {
    if (redirecting) return;

    redirecting = true;

    console.error(
      "[Crystal Kingdom] Game error detected. Opening maintenance page.",
      reason
    );

    // Use a relative URL so this also works under a GitHub Pages
    // project URL, such as username.github.io/repository/.
    const maintenanceURL = new URL(
      "./maintenance.html",
      window.location.href
    );

    window.location.replace(maintenanceURL.href);
  }

  // Catch uncaught runtime errors and JavaScript syntax errors
  // reported by the browser.
  window.addEventListener("error", (event) => {
    const source = String(event.filename || "").toLowerCase();

    if (source.includes("maintenance.js")) {
      return;
    }

    // Ordinary runtime errors, including errors in game.js.
    if (event.target === window) {
      showMaintenance({
        type: "javascript-error",
        message: event.message || "Unknown JavaScript error",
        file: event.filename || "unknown",
        line: event.lineno || 0
      });

      return;
    }

    // A script resource failed to load (for example, game.js is missing).
    const target = event.target;

    if (
      target instanceof HTMLScriptElement &&
      target.src &&
      !target.src.toLowerCase().includes("maintenance.js")
    ) {
      showMaintenance({
        type: "script-load-error",
        file: target.src
      });
    }
  }, true);

  // Catch rejected promises that the game has not handled.
  window.addEventListener("unhandledrejection", (event) => {
    showMaintenance({
      type: "unhandled-promise-rejection",
      message: String(event.reason || "Unknown promise error")
    });
  });
}));