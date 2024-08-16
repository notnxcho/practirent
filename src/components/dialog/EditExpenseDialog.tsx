import { Currency, Expense, Frequency } from 'src/types/property'
import AddExpenseForm from '../forms/AddExpenseForm'
import './dialogStyles.scss'
import { Xmark } from 'iconoir-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { updatePropertyExpense } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import Button from '../common/Button/Button'

const EditExpenseDialog = ({ isOpen, close, propertyId }: EditExpenseDialogProps) => {
    const { currentUser } = useAuth()
    const { selectedExpense, updateExpenseOptimistically } = useProperties()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Expense>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>({ currency: 'usd', symbol: 'USD' })
    const [frequency, setFrequency] = useState<Frequency>({ frequency: 'Monthly', value: 1, unit: 'm' })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedExpense) {
            reset(selectedExpense)
            setCurrencySymbol(selectedExpense.amount.currency)
            setFrequency(selectedExpense.frequency)
        }
    }, [selectedExpense, reset])

    const onSubmit: SubmitHandler<Expense> = data => {
        setLoading(true)
        const updatedExpense = { ...data, amount: { amount: data.amount?.amount, currency: currencySymbol }, frequency }
        updatePropertyExpense(currentUser.id, propertyId, updatedExpense).then(() => {
            updateExpenseOptimistically(propertyId, updatedExpense)
            toast.success('Expense updated successfully')
            close()
        }).catch((error) => {
            console.error('Error updating expense', error)
            toast.error('Failed to update expense')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="overlay">
            <div className="dialog-container">
                <div className="header">
                    <div className="header-title">Edit Expense</div>
                    <div className="icon-box-close" onClick={close}>
                        <Xmark color="#404040"/>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="form-container min-w-[400px]">
                    <AddExpenseForm errors={errors} register={register} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} frequency={frequency} setFrequency={setFrequency} type="edit"/>
                    <Button type='submit' loading={loading} disabled={loading} fullWidth size='large' className='mt-4'>Update Expense</Button>
                </form>
            </div>
        </div>
    )
}

interface EditExpenseDialogProps {
    isOpen: boolean
    close: () => void
    propertyId: string
}

export default EditExpenseDialog