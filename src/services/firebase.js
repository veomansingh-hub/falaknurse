import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let db = null;
let isFirebaseConnected = false;

// Check if variables are configured
const hasConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

if (hasConfig) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    isFirebaseConnected = true;
    console.log("Google Cloud Server: Connected to Firestore database.");
  } catch (error) {
    console.warn("Google Cloud Server: Initialization error. Falling back to local offline mode.", error);
  }
} else {
  console.log("Google Cloud Server: No credentials found. Running in Local Cached Sync Mode.");
}

export { db, isFirebaseConnected };
export default app;
