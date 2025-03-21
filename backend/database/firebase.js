// Import the functions you need from the SDKs you need
const {initializeApp} = require("firebase/app");
const {getAuth,signInWithEmailAndPassword,signOut,createUserWithEmailAndPassword} = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDiZPZpR6SBiJSAWpXJkTcbmCXXcmU0oWo",
  authDomain: "paralela-750df.firebaseapp.com",
  projectId: "paralela-750df",
  storageBucket: "paralela-750df.firebasestorage.app",
  messagingSenderId: "409413534713",
  appId: "1:409413534713:web:879946bd22b8600a117328",
  measurementId: "G-QZSB8XX4S9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const signIn = signInWithEmailAndPassword;
const logout = signOut;
const signup = createUserWithEmailAndPassword


module.exports = { 
    auth,
    signIn,
    logout,
    signup
};

