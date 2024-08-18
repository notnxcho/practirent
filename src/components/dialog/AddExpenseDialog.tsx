import { Expense, Frequency } from 'src/types/property'
import AddExpenseForm from '../forms/AddExpenseForm'
import './dialogStyles.scss'
import { Xmark } from 'iconoir-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { Currency } from 'src/types/property'
import { addPropertyExpense } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import { doc, collection } from 'firebase/firestore'
import { firestoreDB } from '../../firebase'
import Button from '../common/Button/Button'
import { formatDate } from 'src/utils'

const AddExpenseDialog = ({isOpen, close, propertyId}: ExpenseDialogProps) => {
    const { currentUser } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm<Expense>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>({ currency: 'usd', symbol: 'USD' })
    const [frequency, setFrequency] = useState<Frequency>({ frequency: 'Monthly', value: 1, unit: 'm' })
    const [instanceAsCompleted, setInstanceAsCompleted] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const { addExpenseOptimistically } = useProperties()

    const calculateThreePreviousPayments = (data: Expense) => {
        const payments = []
        for (let i = 1; i <= 3; i++) {
            payments.push({
                id: doc(collection(firestoreDB, 'expenses')).id,
                amount: { amount: data.amount?.amount, currency: currencySymbol },
                date: frequency.unit === 'm' 
                    ? (new Date(new Date(data.indexDate).setMonth(new Date(data.indexDate).getMonth() - (frequency.value * i)))).toISOString().split('T')[0]
                    : (new Date(new Date(data.indexDate).setFullYear(new Date(data.indexDate).getFullYear() - (frequency.value * i)))).toISOString().split('T')[0],
                    reference: 'Payment previous creation ' + -i,
                completed: true
            })
        }
        return payments
    }
    const calculateThreeNextPayments = (data: Expense) => {
        const payments = []
        for (let i = 0; i <= 3; i++) {
            payments.push({
                id: doc(collection(firestoreDB, 'expenses')).id,
                amount: { amount: data.amount?.amount, currency: currencySymbol },
                date: frequency.unit === 'm' 
                    ? (new Date(new Date(data.indexDate).setMonth(new Date(data.indexDate).getMonth() + (frequency.value * i)))).toISOString().split('T')[0]
                    : (new Date(new Date(data.indexDate).setFullYear(new Date(data.indexDate).getFullYear() + (frequency.value * i)))).toISOString().split('T')[0],
                reference: 'Payment post creation ' + i,
                completed: false
            })
        }
        return payments.reverse()
    }

    const calculateAllPaymentsToDate = (data: Expense) => {
        const payments = []
        const today = new Date()
        let currentDate = new Date(data.indexDate)

        console.log(data, 'thedadttata', frequency)

        // Calculate past payments
        while (currentDate <= today) {
            payments.push({
                id: doc(collection(firestoreDB, 'expenses')).id,
                amount: { amount: data.amount?.amount, currency: currencySymbol },
                date: currentDate.toISOString().split('T')[0],
                reference: data.title + ' Payment ' + formatDate(currentDate.toISOString().split('T')[0]).split(' ').splice(1,2).join(' '),
                completed: instanceAsCompleted
            })
            currentDate = frequency.unit === 'm'
                ? new Date(currentDate.setMonth(currentDate.getMonth() + frequency.value))
                : new Date(currentDate.setFullYear(currentDate.getFullYear() + frequency.value))
        }
        return payments
    }

    const onSubmit: SubmitHandler<Expense> = data => {
        setLoading(true)
        let updateExpense = {
            ...data,
            id: doc(collection(firestoreDB, 'expenses')).id,
            amount: { amount: data.amount?.amount, currency: currencySymbol },
            frequency: frequency,
            history: calculateAllPaymentsToDate(data)
        }
        console.log('data del form', updateExpense)
        addPropertyExpense(currentUser.id, propertyId, updateExpense).then(() => {
            toast.success('Expense added successfully')
            addExpenseOptimistically(propertyId, updateExpense)
            close()
        }).catch((error) => {
            console.error('Error adding expense', error)
            toast.error('Failed to add expense')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="overlay">
            <div className="dialog-container">
                <div className="header">
                    <div className="header-title">Create a new expense</div>
                    <div className="icon-box-close" onClick={close}>
                        <Xmark color="#404040"/>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="form-container min-w-[uwu] ">
                    <AddExpenseForm 
                        errors={errors}
                        register={register}
                        currencySymbol={currencySymbol}
                        setCurrencySymbol={setCurrencySymbol}
                        frequency={frequency}
                        setFrequency={setFrequency}
                        instanceAsCompleted={instanceAsCompleted}
                        setInstanceAsCompleted={setInstanceAsCompleted}
                        type='add'
                    />
                    <Button type='submit' loading={loading} fullWidth size='large' disabled={loading} className='mt-4'>Add Expense</Button>
                </form>
            </div>
        </div>
    )
}

interface ExpenseDialogProps {
    isOpen: boolean
    close: () => void
    propertyId: string
}

export default AddExpenseDialog