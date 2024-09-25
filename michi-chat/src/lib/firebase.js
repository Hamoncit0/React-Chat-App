// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "michi-chat-49152.firebaseapp.com",
  databaseURL: "https://michi-chat-49152-default-rtdb.firebaseio.com",
  projectId: "michi-chat-49152",
  storageBucket: "michi-chat-49152.appspot.com",
  messagingSenderId: "593921289399",
  appId: "1:593921289399:web:73c914081c12e75fb1f132"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Pasa 'app' como argumento
export const db = getFirestore(app);
export const storage = getStorage(app);