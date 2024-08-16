import { Frequency, Income } from 'src/types/property'
import AddExpenseForm from '../forms/AddExpenseForm'
import './dialogStyles.scss'
import { Xmark } from 'iconoir-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { Currency } from 'src/types/property'
import { addPropertyIncome } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import { doc, collection } from 'firebase/firestore'
import { firestoreDB } from '../../firebase'
import Button from '../common/Button/Button'

const AddIncomeDialog = ({isOpen, close, propertyId}: IncomeDialogProps) => {
    const { currentUser } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm<Income>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>({ currency: 'usd', symbol: 'USD' })
    const [frequency, setFrequency] = useState<Frequency>({ frequency: 'Monthly', value: 1, unit: 'm' })
    const [loading, setLoading] = useState(false)
    const { addIncomeOptimistically } = useProperties()

    const calculateThreePreviousPayments = (data: Income) => {
        const payments = []
        for (let i = 1; i <= 3; i++) {
            payments.push({
                id: doc(collection(firestoreDB, 'incomes')).id,
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
    const calculateThreeNextPayments = (data: Income) => {
        const payments = []
        for (let i = 0; i <= 3; i++) {
            payments.push({
                id: doc(collection(firestoreDB, 'incomes')).id,
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

    const onSubmit: SubmitHandler<Income> = data => {
        setLoading(true)
        let updateIncome = {
            ...data,
            id: doc(collection(firestoreDB, 'incomes')).id,
            amount: { amount: data.amount?.amount, currency: currencySymbol },
            frequency: frequency,
            history: [...calculateThreePreviousPayments(data), ...calculateThreeNextPayments(data)]
        }
        console.log('data del form', updateIncome)
        addPropertyIncome(currentUser.id, propertyId, updateIncome).then(() => {
            toast.success('Income added successfully')
            addIncomeOptimistically(propertyId, updateIncome)
            close()
        }).catch((error) => {
            console.error('Error adding income', error)
            toast.error('Failed to add income')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="overlay">
            <div className="dialog-container">
                <div className="header">
                    <div className="header-title">Create a new income</div>
                    <div className="icon-box-close" onClick={close}>
                        <Xmark color="#404040"/>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="form-container min-w-[400px]">
                    <AddExpenseForm 
                        errors={errors}
                        register={register}
                        currencySymbol={currencySymbol}
                        setCurrencySymbol={setCurrencySymbol}
                        frequency={frequency}
                        setFrequency={setFrequency} 
                    />
                    <Button type='submit' loading={loading} disabled={loading} fullWidth size='large' className='mt-4'>Add Income</Button>
                </form>
            </div>
        </div>
    )
}

interface IncomeDialogProps {
    isOpen: boolean
    close: () => void
    propertyId: string
}

export default AddIncomeDialog