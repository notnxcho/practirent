import { Expense, ExpensePayment } from 'src/types/property'
import './propertyExpensesTabStyles.scss'
import { formatDate } from 'src/utils'

const PropertyExpenseCard = ({expense, selected, onSelect}: {expense: Expense, selected: boolean, onSelect: () => void}) => {

    const renderUpcomingPayments = () => {
        const upcomingPayments = expense.history.filter(payment => !payment.completed)
        const currentDate = new Date().toISOString().split('T')[0]

        // Case 1: Multiple not completed payments dated previous to this date
        const previousIncompletePayments = upcomingPayments.filter(payment => new Date(payment.date) < new Date(currentDate))
        if (previousIncompletePayments.length > 1) {
            const currencySums = previousIncompletePayments.reduce((acc: any, payment) => {
                const currency = payment.amount.currency.symbol
                if (!acc[currency]) {
                    acc[currency] = 0
                }
                acc[currency] = +acc[currency] + (payment.amount.amount ? +payment.amount.amount : 0)
                return acc
            }, {})
            return (
                <div className='flex items-center w-full justify-between gap-6'>
                    <div className='flex items-center gap-3'>
                        <div className="pulsating-indicator alert"/>
                        {previousIncompletePayments.length} due payments
                    </div>
                    <div className="flex shrink-0 w-max flex-col">
                        {Object.entries(currencySums).map(([currency, sum]: any) => (
                            <div key={currency} className="flex items-center gap-1">
                                <span>{currency}</span>
                                <span>{sum}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        // Case 2: Last payment not completed dated previous to current date
        if (previousIncompletePayments.length === 1) {
            return (
                <div className='flex items-center w-full justify-between gap-6'>
                    <div className='flex items-center gap-3'>
                        <div className="pulsating-indicator warning"/>
                        <div className="flex flex-col gap-0.5">
                            <div className="text-[12px] text-[#606060]">{formatDate(previousIncompletePayments[0].date.toLocaleString())}</div>
                            {previousIncompletePayments[0].reference}
                        </div>
                    </div>
                    <div className="flex items-center shrink-0">{previousIncompletePayments[0].amount.currency.symbol} {previousIncompletePayments[0].amount.amount}</div>
                </div>
            )
        }

        // Case 3: All payments completed to date, only display the upcoming payment
        const nextPayment = upcomingPayments.find(payment => new Date(payment.date) >= new Date(currentDate))
        if (nextPayment) {
            return (
                <div className='flex items-center w-full justify-between gap-6'>
                    <div className='flex items-center gap-3'>
                        <div className="pulsating-indicator valid"/>
                        <div className="flex flex-col gap-0.5">
                            <div className="text-[12px] color-[#606060]">{nextPayment.date.toLocaleString()}</div>
                            {nextPayment.reference}
                        </div>
                    </div>
                    <div className="flex items-center shrink-0">{nextPayment.amount.currency.symbol} {nextPayment.amount.amount}</div>
                </div>
            )
        }

        return null
    }

    return (
        <div className={`property-expense-card ${selected && 'selected'}`} onClick={onSelect}>
            <div className='desc'>{expense.title}</div>
            <div className='amount'>{expense.amount.currency.symbol} {expense.amount.amount} · {expense.frequency.frequency}</div>
            <div className="upcoming-box">
                {renderUpcomingPayments()}
            </div>
        </div>
    )
}

export default PropertyExpenseCard