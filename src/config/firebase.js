import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; //no funciona en el plan basico

const firebaseConfig = {
  apiKey: "AIzaSyCT66_Agj-SwiQQg_WzYfJqNw6EGVIzxPE",
  authDomain: "mi-comida-favorita-512fb.firebaseapp.com",
  projectId: "mi-comida-favorita-512fb",
  storageBucket: "mi-comida-favorita-512fb.firebasestorage.app",
  messagingSenderId: "418418755344",
  appId: "1:418418755344:web:89edf596ee5cb5abee0795",
  measurementId: "G-XFZV90HB6R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); //storage no funciona en el plan basico