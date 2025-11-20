"use client"; // optional, since it's imported in client components

import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: " ",
  authDomain: " ",
  projectId: " ",
  storageBucket: " ",
  messagingSenderId: " ",
  appId: " "
  // fill with firebase project config with webapp settings
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Multiple tabs open; persistence only works in one tab");
  } else if (err.code === "unimplemented") {
    console.warn("Offline persistence not supported in this browser");
  }
});

export { db };
