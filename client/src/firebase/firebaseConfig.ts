import { getAuth } from "@firebase/auth";
import { getDatabase } from "@firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA3Y9ILSVw0unhQQHbaIbqIMTpOp-NpAJo",
  authDomain: "realtime-form-38967.firebaseapp.com",
  projectId: "realtime-form-38967",
  storageBucket: "realtime-form-38967.appspot.com",
  messagingSenderId: "1029040593238",
  appId: "1:1029040593238:web:dfce56dc5bbc4c617edef7",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
