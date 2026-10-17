import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdIUHvUTRze0Pj8TqF36sKnlRUQcSCtUM",
  authDomain: "syndic-54327.firebaseapp.com",
  databaseURL: "https://syndic-54327-default-rtdb.firebaseio.com",
  projectId: "syndic-54327",
  storageBucket: "syndic-54327.firebasestorage.app",
  messagingSenderId: "221199418649",
  appId: "1:221199418649:web:0569352de9de01390af188",
  measurementId: "G-37C59NTMP0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

