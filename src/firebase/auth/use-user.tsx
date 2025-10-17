"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

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
