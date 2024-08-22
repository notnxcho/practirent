const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
import { calculateMissingPaymentsToDate } from '../../src/services/firestoreService'

const firestore = admin.firestore();

export const updatePayments = functions.pubsub.schedule('every 24 hours').onRun(async (context: any) => {
    const usersSnapshot = await firestore.collection('users').get()

    usersSnapshot.forEach(async (userDoc: any) => {
        const userData = userDoc.data()
        const properties = userData.properties || []

        for (const property of properties) {
            // Check expenses
            for (const expense of property.expenses || []) {
                await calculateMissingPaymentsToDate(userDoc.id, property.id, expense.id, 'expense')
            }

            // Check incomes
            for (const income of property.incomes || []) {
                await calculateMissingPaymentsToDate(userDoc.id, property.id, income.id, 'income')
            }
        }
    })
})

