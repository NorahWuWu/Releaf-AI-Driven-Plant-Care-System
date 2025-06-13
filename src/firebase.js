// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyBv4GPhcUnP2-HEEW0GmLxD5A5H95yNj9s",
  authDomain: "plant-5a988.firebaseapp.com",
  projectId: "plant-5a988",
  storageBucket: "plant-5a988.appspot.com", 
  messagingSenderId: "414716397781",
  appId: "1:414716397781:web:d553f15f2ab03cff953a5c",
  measurementId: "G-0Z9HCMS0X8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

export { auth };

