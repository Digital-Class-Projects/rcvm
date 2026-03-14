import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

type FirebaseServices = {
  app: FirebaseApp;
  database: Database | null;
  auth: Auth;
  storage: FirebaseStorage;
};

let firebaseApp: FirebaseApp;
let database: Database | null;
let auth: Auth;
let storage: FirebaseStorage;

export function initializeFirebase(): FirebaseServices {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);
  
  if (firebaseConfig.databaseURL) {
    database = getDatabase(firebaseApp);
  } else {
    console.warn("Firebase Realtime Database URL not provided in config. Skipping initialization.");
    database = null;
  }

  return { app: firebaseApp, database, auth, storage };
}
