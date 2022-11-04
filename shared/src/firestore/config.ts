import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: "nebula-ecommerce.firebaseapp.com",
  projectId: "nebula-ecommerce",
  storageBucket: "nebula-ecommerce.appspot.com",
  messagingSenderId: "1070658532796",
  appId: "1:1070658532796:web:ef3c36ad0cc9a431bc27b9",
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
