import { collection, addDoc, getDoc, doc, setDoc, updateDoc } from "firebase/firestore"; 
import { firestoreDB } from "../firebase";
import { User } from "../types/user";
import { Expense, ExpensePayment, Property } from "src/types/property";

export const addUserDocument = async (user: User) => {
    try {
        await setDoc(doc(firestoreDB, "users", user.id), {
            name: user.name,
            email: user.email,
            properties: user.properties
        })
        console.log("Document written with ID: ", user.id);
    } catch (e) {
        throw new Error("Error adding document")
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
    throw new Error("User document does not exist")
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

export const getUserProperty = async (userId: string, propertyId: string) => {
    const propertyRef = doc(firestoreDB, 'users', userId, 'properties', propertyId)
    const propertyDoc = await getDoc(propertyRef)
    if (propertyDoc.exists()) {
        return propertyDoc.data()
    } else {
        return null
    }
}

export const addPropertyExpense = async (userId: string, propertyId: string, expense: Expense) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const updatedExpenses = [...(property.expenses || []), expense]
            properties[propertyIndex] = { ...property, expenses: updatedExpenses }
            await updateDoc(userRef, { properties })
        } else {
            throw new Error("Property not found")
        }
    } else {
        throw new Error("User document does not exist")
    }
}

export const updateUserProperty = async (userId: string, updatedProperty: Property) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === updatedProperty.id)
        
        if (propertyIndex !== -1) {
            properties[propertyIndex] = updatedProperty
            await updateDoc(userRef, { properties })
        } else {
            throw new Error("Property not found")
        }
    } else {
        throw new Error("User document does not exist")
    }
}

export const deleteProperty = async (userId: string, propertyId: string) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const updatedProperties = properties.filter((prop: Property) => prop.id !== propertyId)
        await updateDoc(userRef, { properties: updatedProperties })
    } else {
        throw new Error("User document does not exist")
    }
}

export const updatePropertyExpense = async (userId: string, propertyId: string, updatedExpense: Expense) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const expenseIndex = property.expenses.findIndex((exp: Expense) => exp.id === updatedExpense.id)
            if (expenseIndex !== -1) {
                property.expenses[expenseIndex] = updatedExpense
                properties[propertyIndex] = { ...property, expenses: property.expenses }
                await updateDoc(userRef, { properties })
            } else {
                throw new Error("Expense not found")
            }
        } else {
            throw new Error("Property not found")
        }
    } else {
        throw new Error("User document does not exist")
    }
}

export const deletePropertyExpense = async (userId: string, propertyId: string, expenseId: string) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const updatedExpenses = property.expenses.filter((exp: Expense) => exp.id !== expenseId)
            properties[propertyIndex] = { ...property, expenses: updatedExpenses }
            await updateDoc(userRef, { properties })
        } else {
            throw new Error("Property not found")
        }
    } else {
        throw new Error("User document does not exist")
    }
}

export const updateExpensePayment = async (userId: string, propertyId: string, expenseId: string, updatedPayment: ExpensePayment) => {
  const userRef = doc(firestoreDB, 'users', userId)
  const userDoc = await getDoc(userRef)
  if (userDoc.exists()) {
    const userData = userDoc.data()
    const properties = userData.properties || []
    const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
    
    if (propertyIndex !== -1) {
      const property = properties[propertyIndex]
      const expenseIndex = property.expenses.findIndex((exp: Expense) => exp.id === expenseId)
      if (expenseIndex !== -1) {
        const expense = property.expenses[expenseIndex]
        const paymentIndex = expense.history.findIndex((pay: ExpensePayment) => pay.id === updatedPayment.id)
        if (paymentIndex !== -1) {
          expense.history[paymentIndex] = updatedPayment
          property.expenses[expenseIndex] = expense
          properties[propertyIndex] = property
          await updateDoc(userRef, { properties })
        } else {
          throw new Error("Payment not found")
        }
      } else {
        throw new Error("Expense not found")
      }
    } else {
      throw new Error("Property not found")
    }
  } else {
    throw new Error("User document does not exist")
  }
}