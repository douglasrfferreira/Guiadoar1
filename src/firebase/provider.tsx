"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { FirebaseApp }from "firebase/app";
import { Firestore }from "firebase/firestore";
import { Auth } from "firebase/auth";

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  firestore: null,
  auth: null,
});

export const FirebaseProvider = ({
  children,
  firebaseApp,
  firestore,
  auth,
}: {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}) => {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, firestore, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = () => {
    const context = useFirebase();
    if (context === undefined) {
        throw new Error('useFirebaseApp must be used within a FirebaseProvider');
    }
    return context.firebaseApp;
}

export const useFirestore = () => {
    const context = useFirebase();
    if (context === undefined) {
        throw new Error('useFirestore must be used within a FirebaseProvider');
    }
    return context.firestore;
}

export const useAuth = () => {
    const context = useFirebase();
    if (context === undefined) {
        throw new Error('useAuth must be used within a FirebaseProvider');
    }
    return context.auth;
}
