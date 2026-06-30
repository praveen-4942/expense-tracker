/**
 * firebase-config.js
 * ---------------------------------------------------------------------------
 * Initializes the Firebase app and exports the SDK instances (Auth,
 * Firestore, Analytics, Google provider) used throughout Orb Expense
 * Tracker.
 *
 * SETUP: Replace the values below with your own Firebase project's config.
 * Firebase Console > Project Settings > General > Your apps > SDK setup.
 * ---------------------------------------------------------------------------
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// TODO: Replace with your own Firebase project credentials.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics only initializes in supported, HTTPS browser environments.
export let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) analytics = getAnalytics(app);
  })
  .catch(() => {
    analytics = null;
  });

/**
 * Switches Firebase Auth persistence based on the "Remember me" checkbox.
 * local  -> survives browser restarts (default, persistent login)
 * session -> cleared when the browser tab/window closes
 */
export async function setAuthPersistence(remember) {
  try {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  } catch (err) {
    console.error("Failed to set auth persistence:", err);
  }
}
