
'use client';
import type { DonationPoint } from './types';
import { collection, addDoc, onSnapshot, query, Firestore, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

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
        callback([]);
    });

    return unsubscribe;
};

export const addDonationPoint = async (point: Omit<DonationPoint, 'id' | 'distance'>) => {
  const db = getDb();
  try {
    const docRef = await addDoc(collection(db, "donation-points"), point);
    return { ...point, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const updateDonationPoint = async (pointId: string, data: Partial<Omit<DonationPoint, 'id' | 'distance'>>) => {
    const db = getDb();
    try {
        const docRef = doc(db, 'donation-points', pointId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
}

export const deleteDonationPoint = async (pointId: string) => {
    const db = getDb();
    try {
        await deleteDoc(doc(db, 'donation-points', pointId));
    } catch (error) {
        console.error("Error deleting document: ", error);
        throw error;
    }
}
