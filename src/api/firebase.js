import { initializeApp } from 'firebase/app';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const app = initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

let db = getDatabase(app);
let auth = getAuth(app);

if (window.location.hostname === 'localhost') {
	connectAuthEmulator(auth, 'http://localhost:9099');
	connectDatabaseEmulator(db, 'localhost', 9000);
}

export { auth, db };
export default app;
