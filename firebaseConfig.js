// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDwEdHjp2WOm9cxb7LxX5QCuVZ0qefIgHI",
  authDomain: "smiling-robo.firebaseapp.com",
  projectId: "smiling-robo",
  storageBucket: "smiling-robo.appspot.com",
  messagingSenderId: "758363252100",
  appId: "1:758363252100:web:5a6cd1c4b12038708ca9d1",
  measurementId: "G-LWXVTBVDKC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
