import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqil_BSlxgCzFqp_w1yK5hrUn9gdEM5hA",
  authDomain: "reactnativecourse-a7383.firebaseapp.com",
  projectId: "reactnativecourse-a7383",
  storageBucket: "reactnativecourse-a7383.appspot.com",
  messagingSenderId: "936756118276",
  appId: "1:936756118276:web:1d2e9573cbcb8447774651",
};

const firebaseApp = initializeApp(firebaseConfig, "taskApp2");

const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
