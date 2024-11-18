import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDQBkKVMu_Io61Az-oTlqGjhNzOiyAMBzk",
  authDomain: "sorteio-5218d.firebaseapp.com",
  projectId: "sorteio-5218d",
  storageBucket: "sorteio-5218d.firebasestorage.app",
  messagingSenderId: "239085122410",
  appId: "1:239085122410:web:cd767d534f4b8cc848ab13",
  measurementId: "G-V1F7RPVR39"
};

const firebaseApp = initializeApp(firebaseConfig);

export {firebaseApp};

// const analytics = getAnalytics(app);