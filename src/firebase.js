
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDpy4_rTzayLs8l1KdOHSXxS16hFBknk7M",
    authDomain: "todo-list-40af0.firebaseapp.com",
    projectId: "todo-list-40af0",
    storageBucket: "todo-list-40af0.firebasestorage.app",
    messagingSenderId: "816425427968",
    appId: "1:816425427968:web:33577375adf0f3588ee4e5"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
