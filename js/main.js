/**
 * main.js
 * ---------------------------------------------------------------------------
 * Entry point loaded by index.html (<script type="module" src="js/main.js">).
 * Loads Chart.js from a CDN then boots the application controller.
 * Uses jsdelivr as primary CDN with unpkg as fallback in case either is
 * blocked by the browser, network, or ad-blocker.
 * ---------------------------------------------------------------------------
 */

import { initApp } from "./app.js";

const CDN_URLS = [
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js",
  "https://unpkg.com/chart.js@4.4.4/dist/chart.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js",
];

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadChartJs() {
  for (const url of CDN_URLS) {
    try {
      await loadScript(url);
      if (typeof window.Chart !== "undefined") {
        console.log("Chart.js loaded from:", url);
        return;
      }
    } catch {
      console.warn("Chart.js failed from:", url, "— trying next...");
    }
  }
  console.error("All Chart.js CDN sources failed. Analytics charts will not render.");
}

loadChartJs().finally(() => {
  initApp();
});
