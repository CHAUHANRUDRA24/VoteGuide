import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBIhQVrJIPq_blHq7tqDaHmL2oUrq7N0x4",
  authDomain: "voteguid.firebaseapp.com",
  projectId: "voteguid",
  storageBucket: "voteguid.firebasestorage.app",
  messagingSenderId: "375702287733",
  appId: "1:375702287733:web:acaa1c5168275faa8b8f3c",
  measurementId: "G-ZH77L2476E"
};

const app = initializeApp(firebaseConfig);

export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Remove test connection for now, as it causes errors if firestore isn't completely set up or rules deny access

