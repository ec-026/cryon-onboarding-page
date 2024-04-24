// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// If you need other services like storage, import them similarly:
// import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZmaHaY_Od1lfrKT6jGuFj9pxRnuZBKcA",
  authDomain: "cryon-81105.firebaseapp.com",
  projectId: "cryon-81105",
  storageBucket: "cryon-81105.appspot.com",
  messagingSenderId: "863990210655",
  appId: "1:863990210655:web:afc918fe746577dc8b7bea",
  measurementId: "G-78W74ER4R1"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
