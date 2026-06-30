/**
 * auth.js
 * ---------------------------------------------------------------------------
 * Wraps every Firebase Authentication interaction the app needs: email/
 * password signup & login, Google OAuth login, logout, forgot password,
 * email verification, and the auth state observer that drives persistent
 * login across page refreshes.
 *
 * This module never touches the DOM directly — it only talks to Firebase
 * and returns plain data or throws. UI wiring lives in app.js.
 * ---------------------------------------------------------------------------
 */

import { auth, googleProvider, setAuthPersistence } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/**
 * Registers a listener that fires whenever auth state changes (login,
 * logout, or on initial page load with a persisted session).
 * @param {(user: import("firebase/auth").User|null) => void} callback
 * @returns unsubscribe function
 */
export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signUp({ name, email, password, remember }) {
  await setAuthPersistence(remember);
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }
  try {
    await sendEmailVerification(credential.user);
  } catch (err) {
    console.warn("Could not send verification email:", err);
  }
  return credential.user;
}

export async function logIn({ email, password, remember }) {
  await setAuthPersistence(remember);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logInWithGoogle() {
  await setAuthPersistence(true);
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function logOut() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function resendVerificationEmail() {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
}

export async function removeAccount() {
  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
}

/**
 * Maps Firebase Auth error codes to friendly, user-facing messages.
 * @param {any} error
 */
export function friendlyAuthError(error) {
  const code = error?.code || "";
  const map = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "That email address looks invalid.",
    "auth/weak-password": "Password is too weak — use at least 8 characters.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] || error?.message || "Something went wrong. Please try again.";
}
