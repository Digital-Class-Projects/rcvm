import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

type FirebaseServices = {
  app: FirebaseApp;
  database: Database | null;
  auth: Auth;
};

let firebaseApp: FirebaseApp;
let database: Database | null;
let auth: Auth;

export function initializeFirebase(): FirebaseServices {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  auth = getAuth(firebaseApp);
  
  if (firebaseConfig.databaseURL) {
    database = getDatabase(firebaseApp);
  } else {
    console.warn("Firebase Realtime Database URL not provided in config. Skipping initialization.");
    database = null;
  }

  return { app: firebaseApp, database, auth };
}
