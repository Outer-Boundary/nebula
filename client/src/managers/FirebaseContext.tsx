import { createContext, ReactNode, useContext } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsSthXYkNpRKvYJJzGZQP1TlVmmpQuKYg",
  authDomain: "nebula-ecommerce.firebaseapp.com",
  projectId: "nebula-ecommerce",
  storageBucket: "nebula-ecommerce.appspot.com",
  messagingSenderId: "1070658532796",
  appId: "1:1070658532796:web:ef3c36ad0cc9a431bc27b9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

interface IFirebaseContext {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

export const FirebaseContext = createContext<IFirebaseContext | undefined>(undefined);

const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FirebaseContext.Provider
      value={{
        app: app,
        auth: auth,
        db: db,
        storage: storage,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;

export const useFirebaseContext = () => {
  const firebaseContext = useContext(FirebaseContext);
  if (!firebaseContext) {
    throw new Error("No FirebaseContext.Provider found when calling useFirebaseContext.");
  }
  return firebaseContext;
};
