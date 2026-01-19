
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

/**
 * InfoSewa Verified Firebase Configuration
 * Project: infosewa-44646
 * 
 * IMPORTANT: To fix "Missing or insufficient permissions", 
 * paste these rules in your Firebase Console:
 * 
 * --- FIRESTORE RULES ---
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /notices/{noticeId} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 * 
 * --- STORAGE RULES ---
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     match /{allPaths=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 */
const firebaseConfig = {
  apiKey: "AIzaSyA6npT0kvBSxWeXNXvQNGmCWVZ5zJaWKWk",
  authDomain: "infosewa-44646.firebaseapp.com",
  databaseURL: "https://infosewa-44646-default-rtdb.firebaseio.com",
  projectId: "infosewa-44646",
  storageBucket: "infosewa-44646.firebasestorage.app",
  messagingSenderId: "38568143097",
  appId: "1:38568143097:web:b8b9507ded05f04f0b1a28"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const isConfigReady = firebaseConfig.projectId !== 'your-project';
