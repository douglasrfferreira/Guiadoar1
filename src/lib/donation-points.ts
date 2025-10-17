
'use client';
import type { DonationPoint } from './types';
import { collection, addDoc, getDocs, onSnapshot, query, Firestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

let donationPoints: DonationPoint[] = [];
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

// Initial fetch of donation points
const fetchInitialPoints = async () => {
    try {
        const db = getDb();
        const q = query(collection(db, "donation-points"));
        const querySnapshot = await getDocs(q);
        const points: DonationPoint[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            points.push({ id: doc.id, ...data } as DonationPoint);
        });
        donationPoints = points;
    } catch (error) {
        console.error("Error fetching initial donation points: ", error);
        // Set some default static points in case of error
        donationPoints = [
            {
                id: '1',
                name: "Exército de Salvação",
                address: "R. Jaguaribe, 321 - Vila Nova, Londrina - PR, 86025-450",
                lat: -23.3033,
                lng: -51.1561,
                hours: "Seg-Sex: 9h-17h",
                acceptedItems: ["clothes", "furniture", "electronics", "books", "toys"],
            },
            {
                id: '2',
                name: "Cáritas Arquidiocesana de Londrina",
                address: "R. Dom Bosco, 145 - Jardim Dom Bosco, Londrina - PR, 86060-340",
                lat: -23.3134,
                lng: -51.1793,
                hours: "Seg-Sex: 8h-18h",
                acceptedItems: ["clothes", "food", "toys"],
            },
        ];
    }
};

// Set up the real-time listener
try {
    const db = getDb();
    const q = query(collection(db, "donation-points"));
    onSnapshot(q, (querySnapshot) => {
        const points: DonationPoint[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            points.push({ id: doc.id, ...data } as DonationPoint);
        });
        donationPoints = points;
    }, (error) => {
        console.error("Error with real-time listener: ", error);
        // Fallback to fetching initial points on error
        fetchInitialPoints();
    });
} catch (e) {
    // If firestore is not ready, fetch initial points
    fetchInitialPoints();
}


export const getDonationPoints = () => {
  return [...donationPoints];
};

export const addDonationPoint = async (point: Omit<DonationPoint, 'id' | 'distance'>) => {
  const db = getDb();
  try {
    const docRef = await addDoc(collection(db, "donation-points"), point);
    return { ...point, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    //
  }
};
