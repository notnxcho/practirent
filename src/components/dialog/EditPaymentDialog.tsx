import { useEffect } from 'react'
import { Currency, Expense, EntryPayment, Income } from 'src/types/property'
import CurrencyInput from '../common/CurrencyInput/CurrencyInput'
import Button from '../common/Button/Button'
import { Xmark } from 'iconoir-react'
import { useForm } from 'react-hook-form'
import './dialogStyles.scss'

const EditPaymentDialog = ({ isOpen, close, loading, payment, currencySymbol, setCurrencySymbol, completed, setCompleted, onSubmit }: EditPaymentDialogProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EntryPayment>()

  useEffect(() => {
    if (payment) {
      reset(payment)
      setCurrencySymbol(payment.amount.currency)
      setCompleted(payment.completed)
    }
  }, [payment])

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
                <div className="flex w-full justify-end gap-2 mt-4">
                  <Button variant='secondary' onClick={close}>Cancel</Button>
                  <Button variant='primary' type='submit' disabled={loading} loading={loading}>Save</Button>
                </div>
              </form>
            </div>
        </div>
    ) : null
  )
}

interface EditPaymentDialogProps {
  isOpen: boolean
  close: () => void
  loading: boolean
  payment: EntryPayment | undefined
  currencySymbol: Currency
  setCurrencySymbol: (currency: Currency) => void
  completed: boolean
  setCompleted: (completed: boolean) => void
  onSubmit: (data: EntryPayment) => void
}

export default EditPaymentDialog