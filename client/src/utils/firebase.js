// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interview-with-ai-106c4.firebaseapp.com",
  projectId: "interview-with-ai-106c4",
  storageBucket: "interview-with-ai-106c4.firebasestorage.app",
  messagingSenderId: "257082157574",
  appId: "1:257082157574:web:1ad3c73a10243c79ce7187"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {
  auth,
  provider
}