/**
 * main.js
 * ---------------------------------------------------------------------------
 * Entry point loaded by index.html (<script type="module" src="js/main.js">).
 * Dynamically loads the Chart.js UMD bundle from CDN (so charts.js can use
 * the global window.Chart), then boots the application controller.
 * ---------------------------------------------------------------------------
 */

import { initApp } from "./app.js";

function loadChartJs() {
  return new Promise((resolve, reject) => {
    if (window.Chart) return resolve();
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

loadChartJs()
  .catch((err) => console.error("Failed to load Chart.js:", err))
  .finally(() => {
    initApp();
  });
