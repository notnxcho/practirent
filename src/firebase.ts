import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAxmoOX4t9q1jjxMX8EUfyyiyIPoP7Fcwk",
  authDomain: "practirent-8b65f.firebaseapp.com",
  projectId: "practirent-8b65f",
  storageBucket: "practirent-8b65f.appspot.com",
  messagingSenderId: "139580734579",
  appId: "1:139580734579:web:6920d700e0dc0b8cf8fe06",
  measurementId: "G-2F4RN5B9Y9"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export { createUserWithEmailAndPassword }
export default app