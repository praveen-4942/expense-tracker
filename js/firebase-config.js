/**
 * firebase-config.js
 * ---------------------------------------------------------------------------
 * Initializes the Firebase app and exports the SDK instances (Auth,
 * Firestore, Analytics, Google provider) used throughout Orb Expense
 * Tracker.
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

const firebaseConfig = {
  apiKey: "AIzaSyBBnSPp08-2hQZKJambvXzKHFvE2YwMQBc",
  authDomain: "expense-tracker-fe4ae.firebaseapp.com",
  projectId: "expense-tracker-fe4ae",
  storageBucket: "expense-tracker-fe4ae.firebasestorage.app",
  messagingSenderId: "589836930435",
  appId: "1:589836930435:web:6e0d86ec2ad424e6d6fab6",
  measurementId: "G-V1YFQX0T03",
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
 * local   -> survives browser restarts (default, persistent login)
 * session -> cleared when the browser tab/window closes
 */
export async function setAuthPersistence(remember) {
  try {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  } catch (err) {
    console.error("Failed to set auth persistence:", err);
  }
}
