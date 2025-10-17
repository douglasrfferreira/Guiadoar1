
'use client';
import type { LucideIcon } from 'lucide-react';
import { Shirt, Apple, ToyBrick, Laptop, Sofa, BookOpen, Tag } from 'lucide-react';
import type { DonationCategory } from '@/lib/types';
import { initializeFirebase } from '@/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export const staticCategoryIcons: Record<string, LucideIcon> = {
  clothes: Shirt,
  food: Apple,
  toys: ToyBrick,
  electronics: Laptop,
  furniture: Sofa,
  books: BookOpen,
};

export let categoryIcons: Record<DonationCategory, LucideIcon> = { ...staticCategoryIcons };
export let categoryNames: Record<DonationCategory, string> = {
    clothes: 'Roupas',
    food: 'Alimentos',
    toys: 'Brinquedos',
    electronics: 'Eletrônicos',
    furniture: 'Móveis',
    books: 'Livros',
  };

function getDb() {
    return initializeFirebase().firestore;
}

try {
    const db = getDb();
    const docRef = doc(db, "app-config", "categories");
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data() as { names: Record<DonationCategory, string> };
            categoryNames = data.names;
            categoryIcons = {};
            for (const key in categoryNames) {
                categoryIcons[key] = staticCategoryIcons[key] || Tag;
            }
        } else {
            // If the document doesn't exist, create it with default values
            setDoc(docRef, { names: categoryNames }).catch(error => {
              errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: docRef.path,
                operation: 'create',
                requestResourceData: { names: categoryNames }
              }));
            });
        }
    }, (error) => {
        const contextualError = new FirestorePermissionError({
            operation: 'get',
            path: docRef.path
        });
        errorEmitter.emit('permission-error', contextualError);
    });

} catch(e) {
    console.error("Could not connect to Firestore to get categories", e);
}

export const getCategories = (callback: (categories: Record<DonationCategory, string>) => void) => {
    try {
        const db = getDb();
        const docRef = doc(db, "app-config", "categories");
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as { names: Record<DonationCategory, string> };
                callback(data.names);
            } else {
                callback(categoryNames);
            }
        }, (error) => {
          const contextualError = new FirestorePermissionError({
              operation: 'get',
              path: docRef.path
          });
          errorEmitter.emit('permission-error', contextualError);
          callback(categoryNames);
        });
        return unsubscribe;
    } catch(e) {
        console.error("Could not connect to Firestore to get categories", e);
        callback(categoryNames);
        return () => {}; // Return an empty unsubscribe function
    }
}

export const addCategory = (key: string, name: string) => {
    const newCategoryNames = { ...categoryNames, [key.toLowerCase()]: name };
    const db = getDb();
    const docRef = doc(db, "app-config", "categories");
    setDoc(docRef, { names: newCategoryNames }).catch(error => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { names: newCategoryNames }
      }));
    });
};
