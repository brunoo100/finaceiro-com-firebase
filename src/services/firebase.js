import {initializeApp} from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBO3LWieNfW5SW0kcBacHj3SFsXppur8tk",
    authDomain: "projeto-pai-18a04.firebaseapp.com",
    projectId: "projeto-pai-18a04",
    storageBucket: "projeto-pai-18a04.firebasestorage.app",
    messagingSenderId: "422000777770",
    appId: "1:422000777770:web:8c7463f66c1ad0879fc153",
    measurementId: "G-9GXDDB28TH"
  };

  const firebaseApp =  initializeApp(firebaseConfig);
  export const db = getFirestore(firebaseApp);
  export  const auth = getAuth(firebaseApp);
 

