// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBcZBZ5a8A7wzoNzbeYtc595Aq-UIfE7XU",
  authDomain: "wardrobe-6ee64.firebaseapp.com",
  projectId: "wardrobe-6ee64",
  storageBucket: "wardrobe-6ee64.appspot.com",
  messagingSenderId: "714007014554",
  appId: "1:714007014554:web:d4eccf87ab04fc7b754323",
  measurementId: "G-DHW20B0JRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;