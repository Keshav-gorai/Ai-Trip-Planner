// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBRuv2xghQhwxVGuwdI3KQBbMfYORUi358",
  authDomain: "ai-trip-planner-3de13.firebaseapp.com",
  databaseURL: "https://ai-trip-planner-3de13-default-rtdb.firebaseio.com",
  projectId: "ai-trip-planner-3de13",
  storageBucket: "ai-trip-planner-3de13.firebasestorage.app",
  messagingSenderId: "12475970254",
  appId: "1:12475970254:web:318c98032bed81e835169f",
};

// Initialize Firebase


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default firebaseConfig;



