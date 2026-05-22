import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// Your web app's Firebase configuration. Replace these with your actual keys from Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyDs5tvsZUUu0pZuo_vhbFl-YFkA0CIp3NA",
  authDomain: "myoffshorerotation.firebaseapp.com",
  projectId: "myoffshorerotation",
  storageBucket: "myoffshorerotation.appspot.com",
  messagingSenderId: "544983536880",
  appId: "1:544983536880:web:009e1f8c8b86dea6265e35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with robust local persistent cache for offline-first usage
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
