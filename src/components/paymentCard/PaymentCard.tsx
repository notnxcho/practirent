import './paymentCardStyles.scss'

import { useState } from 'react'
import EditPaymentDialog from '../dialog/EditPaymentDialog'
import { ExpensePayment } from 'src/types/property'

const PaymentCard: React.FC<PaymentCardProps> = ({ date, reference, symbol, amount, completed, isFuture, propertyId, expenseId, payment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className={`payment-card ${isFuture ? 'grayed-out' : ''}`}>
      <div className="payment-info">
        <div className="payment-date">{date}</div>
        <div className="payment-reference">{reference}</div>
        <div className="payment-amount">{symbol} {amount}</div>
      </div>
      <div className={`payment-status ${completed ? 'completed' : isFuture ? 'upcoming' : 'pending'}`} onClick={() => setIsModalOpen(true)}>
        {completed ? 'Completed' : isFuture ? 'Upcoming' : 'Pending'}
      </div>
      <EditPaymentDialog isOpen={isModalOpen} close={() => setIsModalOpen(false)} payment={payment} propertyId={propertyId} expenseId={expenseId} />
    </div>
  )
}

interface PaymentCardProps {
  date: string
  reference: string
  symbol: string
  amount: number
  completed: boolean
  isFuture: boolean
  propertyId: string
  expenseId: string
  payment: ExpensePayment
}

export default PaymentCard