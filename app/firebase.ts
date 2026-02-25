import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhPn-UzRBlA7DguClAKFSa9bsnBX37CMI",
  authDomain: "streamy-auth-38238.firebaseapp.com",
  projectId: "streamy-auth-38238",
  storageBucket: "streamy-auth-38238.firebasestorage.app",
  messagingSenderId: "228218128393",
  appId: "1:228218128393:web:a04170d881115d0898d0d8",
  measurementId: "G-DMRZYF4FKG",
};

// 🔥 Empêche la double initialisation en production
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
