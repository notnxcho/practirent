import { Expense } from 'src/types/property'
import './propertyExpensesTabStyles.scss'

const PropertyExpenseCard = ({expense}: {expense: Expense}) => {
    return (
        <div className="property-expense-card">
            <div className='desc'>{expense.description}</div>
            <div className='amount'>{expense.amount.currency.symbol} {expense.amount.amount}</div>
        </div>
    )
}

export default PropertyExpenseCard