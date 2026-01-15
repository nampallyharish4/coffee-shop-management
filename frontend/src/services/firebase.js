import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAPdBD3P4EElIKMSdPSQ0NI1W8RIwTQotM',
  authDomain: 'semiotic-garden-424212-t2.firebaseapp.com',
  projectId: 'semiotic-garden-424212-t2',
  storageBucket: 'semiotic-garden-424212-t2.firebasestorage.app',
  messagingSenderId: '794737344635',
  appId: '1:794737344635:web:82db076665ddf8dfa822de',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
