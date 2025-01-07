// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuP4mqZiiOoKjoLkPKS-KagTA_JkZAcEw",
  authDomain: "mobile-authentication-54c5a.firebaseapp.com",
  projectId: "mobile-authentication-54c5a",
  storageBucket: "mobile-authentication-54c5a.firebasestorage.app",
  messagingSenderId: "692132699401",
  appId: "1:692132699401:web:877ee3e54317043bcd87d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
