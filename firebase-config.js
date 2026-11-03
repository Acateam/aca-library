// Copy the Firebase web app configuration from Firebase Console > Project settings.
// Firebase Web API keys are public identifiers, NOT passwords. Security is enforced by firestore.rules.
export const firebaseConfig = {
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_PROJECT_ID.firebaseapp.com",
  projectId: "REPLACE_WITH_PROJECT_ID",
  storageBucket: "REPLACE_WITH_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "REPLACE_WITH_SENDER_ID",
  appId: "REPLACE_WITH_APP_ID"
};
// Exact company domain, without @; must match the domain in firestore.rules.
export const COMPANY_DOMAIN = "example.com";
