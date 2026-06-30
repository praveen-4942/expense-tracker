/**
 * db.js
 * ---------------------------------------------------------------------------
 * All Cloud Firestore reads/writes live here. Every function takes a `uid`
 * explicitly to keep this module independently testable and to make the
 * security boundary obvious. Structure (matches firestore.rules):
 *
 *   users/{uid}                       -> profile + settings document
 *   users/{uid}/expenses/{expenseId}  -> one document per income/expense entry
 *   users/{uid}/budgets/{budgetId}    -> one document per category budget
 * ---------------------------------------------------------------------------
 */

import { db } from "./firebase-config.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const DEFAULT_SETTINGS = {
  theme: "dark",
  currency: "USD",
  monthlyBudget: 0,
};

/** Creates the initial user profile/settings document on signup. */
export async function createUserProfile(uid, { name, email }) {
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    {
      profile: { name: name || "", email: email || "" },
      settings: DEFAULT_SETTINGS,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, profile) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { profile });
}

export async function updateUserSettings(uid, settings) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { settings }, { merge: true });
}

/**
 * Subscribes to real-time updates of a user's expenses, ordered by date
 * descending. Returns an unsubscribe function.
 * @param {string} uid
 * @param {(expenses: Array) => void} callback
 */
export function subscribeToExpenses(uid, callback) {
  const ref = collection(db, "users", uid, "expenses");
  const q = query(ref, orderBy("date", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const expenses = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(expenses);
    },
    (error) => {
      console.error("Expenses subscription error:", error);
    }
  );
}

export async function addExpense(uid, expense) {
  const ref = collection(db, "users", uid, "expenses");
  const docRef = await addDoc(ref, {
    ...expense,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateExpense(uid, expenseId, expense) {
  const ref = doc(db, "users", uid, "expenses", expenseId);
  await updateDoc(ref, { ...expense, updatedAt: serverTimestamp() });
}

export async function deleteExpense(uid, expenseId) {
  const ref = doc(db, "users", uid, "expenses", expenseId);
  await deleteDoc(ref);
}

export async function deleteAllUserData(uid) {
  // Deletes the root profile document. Expense/budget subcollections should
  // be cleaned up via a Cloud Function trigger in production; for a client-
  // only app we best-effort clear the profile doc here.
  const ref = doc(db, "users", uid);
  await deleteDoc(ref).catch(() => {});
}

