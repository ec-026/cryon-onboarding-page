// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// If you need other services like storage, import them similarly:
// import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "XXXXXXXX",
  authDomain: "XXXXXXXX",
  projectId: "XXXXXXXX",
  storageBucket: "XXXXXXXX",
  messagingSenderId: "XXXXXXXX",
  appId: "XXXXXXXX",
  measurementId: "XXXXXXXX"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
