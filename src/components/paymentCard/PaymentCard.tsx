import './paymentCardStyles.scss'

const PaymentCard: React.FC<PaymentCardProps> = ({ date, reference, symbol, amount, completed, isFuture, onClick }) => {

  return (
    <div className={`payment-card ${isFuture ? 'grayed-out' : ''}`}>
      <div className="payment-info">
        <div className="payment-date">{date}</div>
        <div className="payment-reference">{reference}</div>
        <div className="payment-amount">{symbol} {amount}</div>
      </div>
      <div className={`payment-status ${completed ? 'completed' : isFuture ? 'upcoming' : 'pending'}`} onClick={onClick}>
        {completed ? 'Completed' : isFuture ? 'Upcoming' : 'Pending'}
      </div>
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
  onClick: () => void
}

export default PaymentCard