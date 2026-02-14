'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import Preloader from '@/components/preloader';
import { Auth } from 'firebase/auth';
import { Database } from 'firebase/database';
import { FirebaseApp } from 'firebase/app';
import { FirebaseStorage } from 'firebase/storage';

type FirebaseContextType = {
  app: FirebaseApp | null;
  database: Database | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseContextType>({
    app: null,
    database: null,
    auth: null,
    storage: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const services = initializeFirebase();
      setFirebaseServices(services);
    } catch (error) {
      console.error("Firebase initialization failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  if (loading) {
    return <Preloader loading={true} />;
  }

  return (
    <FirebaseContext.Provider value={firebaseServices}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
