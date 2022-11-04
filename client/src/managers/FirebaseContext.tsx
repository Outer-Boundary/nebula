import { createContext, ReactNode, useContext } from "react";
import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { app, database, storage } from "shared/firestore";

interface IFirebaseContext {
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
}

export const FirebaseContext = createContext<IFirebaseContext | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
}

const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  return (
    <FirebaseContext.Provider
      value={{
        app: app,
        db: database,
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
