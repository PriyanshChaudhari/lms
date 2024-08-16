// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBhD5CZjcG1Fbtr7BraekTKiyyx_oEBtto",
    authDomain: "lmsystem-2afd2.firebaseapp.com",
    projectId: "lmsystem-2afd2",
    storageBucket: "lmsystem-2afd2.appspot.com",
    messagingSenderId: "528406607075",
    appId: "1:528406607075:web:e5f14a7b76b419db2541d6",
    measurementId: "G-NLK61D1FE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);