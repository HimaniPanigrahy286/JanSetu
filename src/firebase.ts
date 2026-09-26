import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Read Firebase config from environment variables or provide fallback to prevent runtime crashes
const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

export const isFirebaseConfigured: boolean = Boolean(
  envApiKey &&
  envProjectId &&
  !envApiKey.includes("YOUR_") &&
  !envApiKey.includes("Mock")
);

const firebaseConfig = {
  apiKey: envApiKey || "AIzaSyJanSetuPortalDevMockKey2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jansetu-portal.firebaseapp.com",
  projectId: envProjectId || "jansetu-portal",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jansetu-portal.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning (running in local fallback mode):", error);
  // Provide non-throwing fallbacks so the application never renders a blank screen
  app = (getApps()[0] || {}) as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { app, auth, db };
export default app;
