const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

export const updatePayments = functions.pubsub.schedule('every 24 hours').onRun(async (context: any) => {
    const today = new Date();
    const propertiesSnapshot = await firestore.collection('users').get();

    propertiesSnapshot.forEach(async (userDoc: any) => {
        const userData = userDoc.data();
        const properties = userData.properties || [];

        for (const property of properties) {
            // Check expenses
            for (const expense of property.expenses || []) {
                const nextPaymentDate = getNextPaymentDate(expense);
                if (isSameDay(nextPaymentDate, today)) {
                    await addPaymentToHistory(userDoc.id, property.id, expense, 'expenses');
                }
            }

            // Check incomes
            for (const income of property.incomes || []) {
                const nextPaymentDate = getNextPaymentDate(income);
                if (isSameDay(nextPaymentDate, today)) {
                    await addPaymentToHistory(userDoc.id, property.id, income, 'incomes');
                }
            }
        }
    });
});

function getNextPaymentDate(entry: any) {
    const lastPaymentDate = new Date(entry.history[entry.history.length - 1].date);
    const frequency = entry.frequency;

    if (frequency.unit === 'm') {
        return new Date(lastPaymentDate.setMonth(lastPaymentDate.getMonth() + frequency.value));
    } else {
        return new Date(lastPaymentDate.setFullYear(lastPaymentDate.getFullYear() + frequency.value));
    }
}

function isSameDay(date1: any, date2: any) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

async function addPaymentToHistory(userId: string, propertyId: string, entry: any, type: string) {
    const userRef = firestore.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const properties = userData.properties || [];
    const propertyIndex = properties.findIndex((prop: any) => prop.id === propertyId);

    if (propertyIndex !== -1) {
        const property = properties[propertyIndex];
        const entryIndex = property[type].findIndex((e: any) => e.id === entry.id);

        if (entryIndex !== -1) {
            const newPayment = {
                id: firestore.collection(type).doc().id,
                amount: entry.amount,
                date: getNextPaymentDate(entry)?.toISOString().split('T')[0],
                reference: `Payment ${entry.history.length + 1}`,
                completed: false
            };

            property[type][entryIndex].history.push(newPayment);
            properties[propertyIndex] = property;

            await userRef.update({ properties });
        }
    }
}
