import { Firestore } from '@google-cloud/firestore';
const firestoreDB = new Firestore();

import { Expense, ExpensePayment, Income, IncomePayment, Property } from "../types/property";
import { formatDate } from "../utils";

export const calculateMissingPaymentsToDate = async (userId: string, propertyId: string, itemId: string, type: 'expense' | 'income') => {
    const userRef = firestoreDB.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        const properties = userData?.properties || [];
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId);
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex];
            const itemIndex = type === 'expense' 
                ? property.expenses.findIndex((exp: Expense) => exp.id === itemId)
                : property.incomes.findIndex((inc: Income) => inc.id === itemId);
            
            if (itemIndex !== -1) {
                const item = type === 'expense' ? property.expenses[itemIndex] : property.incomes[itemIndex];
                let payments = item.history;
                let lastPaymentDate = new Date(payments[payments.length - 1]?.date || item.indexDate);
                lastPaymentDate = item.frequency.unit === 'm' && !!payments.length
                    ? new Date(lastPaymentDate.setMonth(lastPaymentDate.getMonth() + item.frequency.value))
                    : new Date(lastPaymentDate.setFullYear(lastPaymentDate.getFullYear() + item.frequency.value));
                const today = new Date();
                while (lastPaymentDate <= today) {
                    payments.push({
                        id: firestoreDB.collection(type === 'expense' ? 'expenses' : 'incomes').doc().id,
                        amount: item.amount,
                        date: lastPaymentDate.toISOString().split('T')[0],
                        reference: item.title + ' Payment ' + formatDate(lastPaymentDate.toISOString().split('T')[0]).split(' ').splice(1,2).join(' '),
                        completed: false
                    });
                    lastPaymentDate = item.frequency.unit === 'm'
                    ? new Date(lastPaymentDate.setMonth(lastPaymentDate.getMonth() + item.frequency.value))
                    : new Date(lastPaymentDate.setFullYear(lastPaymentDate.getFullYear() + item.frequency.value));
                }
                await userRef.update({ properties });
            } else {
                throw new Error(`${type === 'expense' ? 'Expense' : 'Income'} not found`);
            }
        } else {
            throw new Error("Property not found");
        }
    } else {
        throw new Error("User document does not exist");
    }
}

export const deletePendingPayments = async (userId: string, propertyId: string, itemId: string, type: 'expense' | 'income') => {
    const userRef = firestoreDB.collection('users').doc(userId)
    const userDoc = await userRef.get()
    if (userDoc.exists) {
        const userData = userDoc.data()
        const properties = userData?.properties || []
        const propertyIndex = properties.findIndex((prop: Property) => prop.id === propertyId)
        if (propertyIndex !== -1) {
            const property = properties[propertyIndex]
            const itemIndex = type === 'expense' 
                ? property.expenses.findIndex((exp: Expense) => exp.id === itemId)
                : property.incomes.findIndex((inc: Income) => inc.id === itemId)
            
            if (itemIndex !== -1) {
                const item = type === 'expense' ? property.expenses[itemIndex] : property.incomes[itemIndex]
                item.history = item.history.filter((payment: IncomePayment | ExpensePayment) => payment.completed)
                await userRef.update({ properties })
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