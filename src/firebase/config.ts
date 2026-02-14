import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBLhsdvKyWe4YJKV0eRTIg6DrZiQTlmRIw",
  authDomain: "rcvvsm.firebaseapp.com",
  databaseURL: "https://rcvvsm-default-rtdb.firebaseio.com",
  projectId: "rcvvsm",
  storageBucket: "rcvvsm.firebasestorage.app",
  messagingSenderId: "262481318704",
  appId: "1:262481318704:web:c6336b46c58dd0a342aef5",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const storage = getStorage(app);
