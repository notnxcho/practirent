import { useState, useEffect } from 'react'
import { ExpensePayment, Currency } from 'src/types/property'
import CurrencyInput from '../common/CurrencyInput/CurrencyInput'
import Button from '../common/Button/Button'
import { updateExpensePayment } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import { Xmark } from 'iconoir-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import './dialogStyles.scss'

const EditPaymentDialog = ({ isOpen, close, payment, propertyId, expenseId }: { isOpen: boolean, close: () => void, payment: ExpensePayment, propertyId: string, expenseId: string }) => {
  const { currentUser } = useAuth()
  const { updateExpenseOptimistically } = useProperties()
  const [currencySymbol, setCurrencySymbol] = useState<Currency>(payment.amount.currency)
  const [completed, setCompleted] = useState(payment.completed)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ExpensePayment>()
  useEffect(() => {
    if (payment) {
      reset(payment)
      setCurrencySymbol(payment.amount.currency)
      setCompleted(payment.completed)
    }
  }, [payment])

  const onSubmit: SubmitHandler<ExpensePayment> = async (data) => {
    setLoading(true)
    const updatedPayment = { ...payment, amount: { amount: data.amount?.amount, currency: currencySymbol }, completed }
    try {
      await updateExpensePayment(currentUser.id, propertyId, expenseId, updatedPayment)
      toast.success('Payment updated successfully')
      close()
    } catch (error) {
      console.error('Error updating payment', error)
      toast.error('Failed to update payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    isOpen ? (
      <div className="overlay">
        <div className="dialog-container">
            <div className="header">
                <div className="header-title">Edit Payment</div>
                <div className="icon-box-close" onClick={close}>
                    <Xmark color="#404040"/>
                </div>
            </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-container">
                        <div className='input-wrap'>
                            <label htmlFor="amount" className="label">Amount</label>
                            <CurrencyInput passId="amount" passRegister={register} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} />
                        </div>
                        <div className='input-wrap'>
                            <label htmlFor="completed" className="label">Completed</label>
                            <select id="completed" value={completed ? 'true' : 'false'} onChange={(e) => setCompleted(e.target.value === 'true')} className="input">
                                <option value="true">Completed</option>
                                <option value="false">Pending</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex w-full justify-end gap-2">
                        <Button variant='secondary' onClick={close}>Cancel</Button>
                        <Button variant='primary' type='submit' loading={loading}>Save</Button>
                    </div>
                </form>
            </div>
        </div>
    ) : null
  )
}

export default EditPaymentDialog