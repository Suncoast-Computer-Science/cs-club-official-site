import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/database"
import { connectDatabaseEmulator } from "firebase/database"
import { GoogleAuthProvider } from "firebase/auth"


const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
})

if (window.location.hostname === "localhost") {
  app.auth().useEmulator("http://localhost:9099");
  connectDatabaseEmulator(app.database(), "localhost", 9000); // Couldn't find a more consistent way of connecting to local emulator but whatever
}

export const auth = app.auth()
export const provider = new GoogleAuthProvider()
export const db = app.database()
export default app
