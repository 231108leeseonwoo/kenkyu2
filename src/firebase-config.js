// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // Firebase Auth をインポート
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArpxyCURthpMwF5SFLA3UhnWwX2zghnxM",
  authDomain: "kenkyu1-996b6.firebaseapp.com",
  projectId: "kenkyu1-996b6",
  storageBucket: "kenkyu1-996b6.firebasestorage.app",
  messagingSenderId: "953894102278",
  appId: "1:953894102278:web:4348e1e5abc3d6c9b66a87",
  measurementId: "G-2CZHCWHYNM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
const auth = getAuth(app); // Firebase Auth のインスタンスを作成


export { auth };  // auth をエ