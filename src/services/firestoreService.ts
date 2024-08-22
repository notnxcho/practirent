import { getDoc, doc, setDoc, updateDoc, collection } from "firebase/firestore"; 
import { firestoreDB } from "../firebase";
import { User } from "../types/user";
import { Expense, ExpensePayment, Income, IncomePayment, Property } from "../types/property";
import { formatDate } from "../utils";

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


export const addPropertyIncome = async (userId: string, propertyId: string, income: Income) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const updatedIncomes = [...(property.incomes || []), income]
            properties[propertyIndex] = { ...property, incomes: updatedIncomes }
            await updateDoc(userRef, { properties })
        } else {
            throw new Error("Property not found")
        }
    } else {
        throw new Error("User document does not exist")
    }
}

export const deletePropertyIncome = async (userId: string, propertyId: string, incomeId: string) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const updatedIncomes = property.incomes.filter((inc: Income) => inc.id !== incomeId)
            properties[propertyIndex] = { ...property, incomes: updatedIncomes }
            await updateDoc(userRef, { properties })
        } else {
            throw new Error("Property not found")
        }
    } else {
        throw new Error("User document does not exist")
    }
}

export const updatePropertyIncome = async (userId: string, propertyId: string, updatedIncome: Income) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const incomeIndex = property.incomes.findIndex((inc: Income) => inc.id === updatedIncome.id)
            if (incomeIndex !== -1) {
                property.incomes[incomeIndex] = updatedIncome
                properties[propertyIndex] = property
                await updateDoc(userRef, { properties })
            } else {
                throw new Error("Income not found")
            }
        } else {
            throw new Error("Property not found")
        }
    } else {
        throw new Error("User document does not exist")
    }
}

export const updateIncomePayment = async (userId: string, propertyId: string, incomeId: string, updatedPayment: IncomePayment) => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const incomeIndex = property.incomes.findIndex((inc: Income) => inc.id === incomeId)
            if (incomeIndex !== -1) {
                const income = property.incomes[incomeIndex]
                const paymentIndex = income.history.findIndex((pay: IncomePayment) => pay.id === updatedPayment.id)
                if (paymentIndex !== -1) {
                    income.history[paymentIndex] = updatedPayment
                    property.incomes[incomeIndex] = income
                    properties[propertyIndex] = property
                    await updateDoc(userRef, { properties })
                } else {
                    throw new Error("Payment not found")
                }
            } else { 
                throw new Error("Income not found") 
            }
        } else { 
            throw new Error("Property not found") 
        }
    } else { 
        throw new Error("User document does not exist") 
    }
}

export const calculateMissingPaymentsToDate = async (userId: string, propertyId: string, itemId: string, type: 'expense' | 'income') => {
    const userRef = doc(firestoreDB, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        const userData = userDoc.data()
        const properties = userData.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const itemIndex = type === 'expense' 
                ? property.expenses.findIndex((exp: Expense) => exp.id === itemId)
                : property.incomes.findIndex((inc: Income) => inc.id === itemId)
            
            if (itemIndex !== -1) {
                const item = type === 'expense' ? property.expenses[itemIndex] : property.incomes[itemIndex]
                let payments = item.history
                let lastPaymentDate = new Date(payments[payments.length - 1]?.date || item.indexDate)
                const today = new Date()
                console.log('llegamos aca', lastPaymentDate)
                while (lastPaymentDate <= today) {
                    payments.push({
                        id: doc(collection(firestoreDB, type === 'expense' ? 'expenses' : 'incomes')).id,
                        amount: item.amount,
                        date: lastPaymentDate.toISOString().split('T')[0],
                        reference: item.title + ' Payment ' + formatDate(lastPaymentDate.toISOString().split('T')[0]).split(' ').splice(1,2).join(' '),
                        completed: false
                    })
                    lastPaymentDate = item.frequency.unit === 'm'
                    ? new Date(lastPaymentDate.setMonth(lastPaymentDate.getMonth() + item.frequency.value))
                    : new Date(lastPaymentDate.setFullYear(lastPaymentDate.getFullYear() + item.frequency.value))
                }
                await updateDoc(userRef, { properties })
            } else {
                throw new Error(`${type === 'expense' ? 'Expense' : 'Income'} not found`)
            }
        } else {
            throw new Error("Property not found")
        }
    } else {
        throw new Error("User document does not exist")
    }
}

