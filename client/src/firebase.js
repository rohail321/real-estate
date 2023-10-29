// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "real-estate-542e3.firebaseapp.com",
  projectId: "real-estate-542e3",
  storageBucket: "real-estate-542e3.appspot.com",
  messagingSenderId: "788336427046",
  appId: "1:788336427046:web:4fb542a9c5331c537be6e7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
