import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqil_BSlxgCzFqp_w1yK5hrUn9gdEM5hA",
  authDomain: "reactnativecourse-a7383.firebaseapp.com",
  databaseURL: "https://reactnativecourse-a7383-default-rtdb.firebaseio.com",
  projectId: "reactnativecourse-a7383",
  storageBucket: "reactnativecourse-a7383.appspot.com",
  messagingSenderId: "936756118276",
  appId: "1:936756118276:web:1d2e9573cbcb8447774651",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getDatabase(firebaseApp);

export { auth, firebaseApp, db };
