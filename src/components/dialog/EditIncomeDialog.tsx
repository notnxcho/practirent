import { Currency, Expense, Frequency, Income } from 'src/types/property'
import AddExpenseForm from '../forms/AddExpenseForm'
import './dialogStyles.scss'
import { Xmark } from 'iconoir-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { updatePropertyIncome } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import Button from '../common/Button/Button'

const EditIncomeDialog = ({ isOpen, close, propertyId }: EditIncomeDialogProps) => {
    const { currentUser } = useAuth()
    const { selectedIncome, updateIncomeOptimistically } = useProperties()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Income>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>({ currency: 'usd', symbol: 'USD' })
    const [frequency, setFrequency] = useState<Frequency>({ frequency: 'Monthly', value: 1, unit: 'm' })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedIncome) {
            reset(selectedIncome)
            setCurrencySymbol(selectedIncome.amount.currency)
            setFrequency(selectedIncome.frequency)
        }
    }, [selectedIncome, reset])

    const onSubmit: SubmitHandler<Income> = data => {
        setLoading(true)
        const updatedIncome = { ...data, amount: { amount: data.amount?.amount, currency: currencySymbol }, frequency }
        updatePropertyIncome(currentUser.id, propertyId, updatedIncome).then(() => {
            updateIncomeOptimistically(propertyId, updatedIncome)
            toast.success('Income updated successfully')
            close()
        }).catch((error) => {
            console.error('Error updating income', error)
            toast.error('Failed to update income')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="overlay">
            <div className="dialog-container">
                <div className="header">
                    <div className="header-title">Edit Income</div>
                    <div className="icon-box-close" onClick={close}>
                        <Xmark color="#404040"/>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="form-container min-w-[uwu]">
                    <AddExpenseForm errors={errors} register={register} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} frequency={frequency} setFrequency={setFrequency} type="edit"/>
                    <Button type='submit' loading={loading} disabled={loading} fullWidth size='large' className='mt-4'>Update Income</Button>
                </form>
            </div>
        </div>
    )
}

interface EditIncomeDialogProps {
    isOpen: boolean
    close: () => void
    propertyId: string
}

export default EditIncomeDialog