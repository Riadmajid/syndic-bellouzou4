import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ للمطور: استبدل appId بالقيمة الحقيقية من Firebase Console
// الرابط: Firebase Console > Project Settings > Your apps > Web app > App ID
// الشكل الصحيح: "1:221199418649:web:xxxxxxxxxxxxxxxx"
const firebaseConfig = {
  apiKey: "AIzaSyArFiSUvAMx5fCi0ks6szW3wj6bPcwd6SU",
  authDomain: "syndic-54327.firebaseapp.com",
  projectId: "syndic-54327",
  storageBucket: "syndic-54327.firebasestorage.app",
  messagingSenderId: "221199418649",
  appId: "1:221199418649:web:temp_web_app_id_if_needed"
};

if (firebaseConfig.appId.includes('temp')) {
  console.warn(
    '⚠️ Firebase appId is a placeholder! ' +
    'Go to Firebase Console > Project Settings > Your apps > Web App ' +
    'and copy the real appId to fix real-time sync issues on GitHub Pages.'
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
