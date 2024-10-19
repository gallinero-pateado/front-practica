// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase (puedes obtenerla desde la consola de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyBsiknDlBEaat592Kq66WeKvX1cUrfifCs",
    authDomain: "ulink-sprint-1.firebaseapp.com",
    projectId: "ulink-sprint-1",
    storageBucket: "ulink-sprint-1.appspot.com",
    messagingSenderId: "983444255354",
    appId: "1:983444255354:web:54fc7ab0e28848957d01c3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
