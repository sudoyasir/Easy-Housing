// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-7b624.firebaseapp.com",
  projectId: "mern-estate-7b624",
  storageBucket: "mern-estate-7b624.appspot.com",
  messagingSenderId: "404617157679",
  appId: "1:404617157679:web:bba0e56b2348febed63ada",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
