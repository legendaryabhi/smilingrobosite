// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
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

export const searchProjects = async (searchTerm) => {
  const q = query(collection(db, "projects"), where("search_title", ">=", searchTerm), where("search_title", "<=", searchTerm + "\uf8ff"));
  const querySnapshot = await getDocs(q);
  const results = [];
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, ...doc.data() });
  });
  return results;
};

export { auth, db, storage };
