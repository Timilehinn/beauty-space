import { initializeApp  } from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBR4Ne6Nmzr8Ry-Fcc9dsFsOWpgD1Nog3k",
  authDomain: "beautyspaceng-1caad.firebaseapp.com",
  projectId: "beautyspaceng-1caad",
  storageBucket: "beautyspaceng-1caad.firebasestorage.app",
  messagingSenderId: "161314858399",
  appId: "1:161314858399:web:92df17db1d3f820f2bc9aa",
  measurementId: "G-0XNRN3WX1X"
};

export const app = initializeApp(firebaseConfig);