
'use client';
import type { DonationPoint } from './types';
import { collection, addDoc, onSnapshot, query, Firestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

let db: Firestore | null = null;

// Function to get the firestore instance
function getDb(): Firestore {
    if (!db) {
      db = initializeFirebase().firestore;
    }
    if (!db) {
        throw new Error("Firestore is not initialized");
    }
    return db;
}


export const getDonationPoints = (callback: (points: DonationPoint[]) => void) => {
    const db = getDb();
    const q = query(collection(db, "donation-points"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const points: DonationPoint[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            points.push({ id: doc.id, ...data } as DonationPoint);
        });
        callback(points);
    }, (error) => {
        console.error("Error with real-time listener for donation points: ", error);
        const contextualError = new FirestorePermissionError({
            operation: 'list',
            path: 'donation-points',
        });
        errorEmitter.emit('permission-error', contextualError);
        callback([]);
    });

    return unsubscribe;
};

export const addDonationPoint = (point: Omit<DonationPoint, 'id' | 'distance'>) => {
  const db = getDb();
  addDoc(collection(db, "donation-points"), point).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: 'donation-points',
        operation: 'create',
        requestResourceData: point,
      })
    )
  });
};

export const updateDonationPoint = (pointId: string, data: Partial<Omit<DonationPoint, 'id' | 'distance'>>) => {
    const db = getDb();
    const docRef = doc(db, 'donation-points', pointId);
    updateDoc(docRef, data).catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}

export const deleteDonationPoint = (pointId: string) => {
    const db = getDb();
    const docRef = doc(db, 'donation-points', pointId);
    deleteDoc(docRef).catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}

