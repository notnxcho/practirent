import { collection, addDoc, getDoc, doc, setDoc, updateDoc } from "firebase/firestore"; 
import { firestoreDB } from "../firebase";
import { User } from "../types/user";
import { Property } from "src/types/property";

export const addUserDocument = async (user: User) => {
    try {
        await setDoc(doc(firestoreDB, "users", user.id), {
            name: user.name,
            email: user.email,
            properties: user.properties
        })
        console.log("Document written with ID: ", user.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const getUserDocument = async (userId: string) => {
    const docRef = doc(firestoreDB, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: userId } as User;
    } else {
        return null;
    }
}

export const addUserProperty = async (userId: string, property: Property) => {
  const userRef = doc(firestoreDB, 'users', userId)
  const userDoc = await getDoc(userRef)
  if (userDoc.exists()) {
    const userData = userDoc.data()
    const updatedProperties = [...userData.properties, property]
    await updateDoc(userRef, { properties: updatedProperties })
  } else {
    console.error("User document does not exist")
  }
}

export const getUserProperties = async (userId: string) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        return userDoc.data().properties
    } else {
        return []
    }
}