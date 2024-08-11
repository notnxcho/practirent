import { Expense } from 'src/types/property'
import './propertyExpensesTabStyles.scss'

const PropertyExpenseCard = ({expense}: {expense: Expense}) => {
    console.log(expense)
    return (
        <div className="property-expense-card">
            <div className='desc'>{expense.description}</div>
            <div className='amount'>{expense.amount.currency.symbol} {expense.amount.amount}</div>
            <div className="upcoming-box">
                {expense.history.filter(payment => new Date(payment.date) <= new Date()).map((payment)=>{
                    return (
                        <div>{payment.completed}</div>
                    )
                })}
            </div>
        </div>
    )
}

export default PropertyExpenseCard