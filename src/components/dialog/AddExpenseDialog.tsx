import { Expense } from 'src/types/property'
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

const AddExpenseDialog = ({isOpen, close, propertyId}: ExpenseDialogProps) => {
    const { currentUser } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm<Expense>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>({ currency: 'usd', symbol: 'USD' })
    const [loading, setLoading] = useState(false)
    const { addPropertyOptimistically } = useProperties()

    const onSubmit: SubmitHandler<Expense> = data => {
        setLoading(true)
        const expenseWithId = { ...data, id: doc(collection(firestoreDB, 'expenses')).id, amount: { amount: data.amount?.amount, currency: currencySymbol } }
        console.log('data del form', expenseWithId)

        // addPropertyExpense(currentUser.id, propertyId, expenseWithId).then(() => {
        //     addPropertyOptimistically(expenseWithId)
        //     toast.success('Expense added successfully')
        //     close()
        // }).catch((error) => {
        //     console.error('Error adding expense', error)
        //     toast.error('Failed to add expense')
        // }).finally(() => {
        //     setLoading(false)
        // })
    }

    return (
        <div className="overlay">
            <div className="dialog-container">
                <div className="header">
                    <div className="header-title">Create a new expense</div>
                    <div className="close" onClick={close}>
                        <Xmark color="#404040"/>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="form-container min-w-[400px]">
                    <AddExpenseForm errors={errors} register={register} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} />
                    <Button type='submit' loading={loading} fullWidth >Add Expense</Button>
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