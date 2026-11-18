"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirestore, type Firestore } from "firebase/firestore";

// Public config — safe to expose in the browser bundle (standard Firebase practice).
// Real values come from NEXT_PUBLIC_* env vars with live production defaults.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDlpyLk46DS33L4Mj3jfNeSinuqRF_p6rA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vmktracker.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vmktracker",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vmktracker.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "744106232838",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:744106232838:web:0c99d2ad3e33d798b48787",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-792YNL8TYB",
};

// Guard against re-initializing on every hot reload / re-import in the browser.
function getClientApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

export const app = getClientApp();
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);
export const firestore: Firestore = getFirestore(app);
