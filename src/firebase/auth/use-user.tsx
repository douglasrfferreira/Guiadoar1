
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import type { SignUpForm, SignInForm, UserProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export const useUser = () => {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribeAuth = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      if (!userState) {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!firestore || !user?.uid) {
        if (!user?.uid) setLoading(false);
        return;
    };

    const docRef = doc(firestore, `users/${user.uid}`);
    const unsubProfile = onSnapshot(docRef, (snap) => {
        setProfile(snap.data() as UserProfile | null);
        setLoading(false);
    }, (error) => {
        const contextualError = new FirestorePermissionError({
            operation: 'get',
            path: docRef.path
        });
        errorEmitter.emit('permission-error', contextualError);
        setLoading(false);
    });

    return () => unsubProfile();
  }, [user?.uid, firestore]);

  return { user, profile, loading };
};

export const signUpWithEmailAndPassword = async ({ name, email, password }: SignUpForm) => {
    const { auth, firestore } = initializeFirebase();
    if (!auth || !firestore) throw new Error("Firebase services are not available.");
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });
    
    const userProfileData: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: name,
        role: 'user', 
    };

    const docRef = doc(firestore, 'users', user.uid);
    setDoc(docRef, userProfileData).catch(error => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: userProfileData
      }));
    });

    return userCredential;
};

const _signInWithEmail = (auth: ReturnType<useAuth>) => async ({ email, password }: SignInForm) => {
    if (!auth) throw new Error("Auth service is not available.");
    return await signInWithEmailAndPassword(auth, email, password);
};

export function useSignInWithEmail() {
    const auth = useAuth();
    return _signInWithEmail(auth);
}

const _signOut = (auth: ReturnType<useAuth>) => async () => {
    if (!auth) return;
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
};

export function useSignOut() {
    const auth = useAuth();
    return _signOut(auth);
}

import { initializeFirebase } from '..';
