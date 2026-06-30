/**
 * analytics.js
 * ---------------------------------------------------------------------------
 * Thin wrapper around Firebase Analytics event logging. All calls are
 * no-ops if Analytics isn't supported/initialized (e.g. local file://
 * development), so feature code never needs to guard against that itself.
 * ---------------------------------------------------------------------------
 */

import { analytics } from "./firebase-config.js";
import { logEvent } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

function track(eventName, params = {}) {
  if (!analytics) return;
  try {
    logEvent(analytics, eventName, params);
  } catch (err) {
    console.warn("Analytics event failed:", eventName, err);
  }
}

export const Analytics = {
  login: (method) => track("login", { method }),
  signUp: (method) => track("sign_up", { method }),
  logout: () => track("logout"),
  addExpense: (type, category) => track("add_transaction", { type, category }),
  editExpense: (type) => track("edit_transaction", { type }),
  deleteExpense: () => track("delete_transaction"),
  viewChange: (viewId) => track("view_change", { view: viewId }),
  exportData: (format) => track("export_data", { format }),
  themeChange: (theme) => track("theme_change", { theme }),
};
