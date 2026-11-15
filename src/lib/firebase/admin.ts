import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Server-only Firebase Admin SDK — privileged access via a service account, used to
// write to Firestore and manage Storage objects from API routes. Never import this
// from a "use client" component; the service account key must stay server-side.
//
// Mirrors the global-singleton pattern in src/db/index.ts so Next.js dev-mode hot
// reloads don't re-initialize the app (and throw "app already exists") on every edit.
const globalForFirebaseAdmin = global as unknown as { firebaseAdminApp: App | undefined };

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  // Strip surrounding quotes if user copied them into dashboard/env
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1).trim();
  }
  // Handle literal newlines, escaped \n, and double-escaped \\n
  return formatted.replace(/\\n/g, "\n");
}

function getAdminApp(): App {
  if (globalForFirebaseAdmin.firebaseAdminApp) return globalForFirebaseAdmin.firebaseAdminApp;
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Service-account private keys are stored in .env with literal "\n" sequences
  // or surrounding quotes, so we clean and format them here.
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.",
    );
  }

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  globalForFirebaseAdmin.firebaseAdminApp = app;
  return app;
}

// Exported as lazy getters, not eagerly-evaluated consts: firebase-admin's cert()
// synchronously parses the private key PEM at call time and throws if it's not valid
// (unlike pg.Pool, which only connects lazily on first query). With placeholder env
// values — the convention this repo's .env already uses everywhere else — an eager
// export would run cert() the moment this module is imported, which happens during
// Next.js's build-time page-data collection for the API route and would break the
// production build even though no request was ever actually served. Deferring the
// call until a route handler actually runs keeps placeholder values build-safe, the
// same way an unset DATABASE_URL doesn't fail the build until something queries it.
export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminBucket() {
  return getStorage(getAdminApp()).bucket();
}
