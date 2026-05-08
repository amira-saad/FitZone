import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyD8jI9HxfVuuDjd6VpFNLymNe_gqXnffhM",
  authDomain: "fitzone-cd029.firebaseapp.com",
  projectId: "fitzone-cd029",
  storageBucket: "fitzone-cd029.firebasestorage.app",
  messagingSenderId: "83840291106",
  appId: "1:83840291106:web:9a4736692146211318157b",
  measurementId: "G-3X5V44YPJ2"
};

const app = initializeApp(firebaseConfig);

// Auth system
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google login provider
export const googleProvider = new GoogleAuthProvider();