import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
// Firestore database to use. Empty/unset → '(default)', which is the
// client deployment. The product demo sets NEXT_PUBLIC_FIRESTORE_DATABASE_ID
// to a named database (e.g. 'demo-database') in the same project.
const databaseId = process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app)
export default app
