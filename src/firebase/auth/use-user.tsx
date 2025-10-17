"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from '@/firebase';
import type { SignUpForm, SignInForm } from '@/lib/types';


export const useUser = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
};

export const signUpWithEmailAndPassword = async ({ name, email, password }: SignUpForm) => {
    const auth = useAuth();
    if (!auth) throw new Error("Auth service is not available.");
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName: name,
        });
    }

    return userCredential;
};

export const signInWithEmail = async ({ email, password }: SignInForm) => {
    const auth = useAuth();
    if (!auth) throw new Error("Auth service is not available.");
    
    return await signInWithEmailAndPassword(auth, email, password);
};


export const googleSignIn = async () => {
    const auth = useAuth();
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error signing in with Google: ", error);
    }
};

export const signOutUser = async () => {
    const auth = useAuth();
    if (!auth) return;
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
};
