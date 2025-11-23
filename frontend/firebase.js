// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "zwiggy-food-delivery.firebaseapp.com",
  projectId: "zwiggy-food-delivery",
  storageBucket: "zwiggy-food-delivery.firebasestorage.app",
  messagingSenderId: "389115939564",
  appId: "1:389115939564:web:2d943a07fff60dc6be73c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app,auth};
