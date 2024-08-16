import { Income, IncomePayment } from 'src/types/property'
import './propertyIncomeTabStyles.scss'
import { formatDate } from 'src/utils'

const PropertyIncomesCard = ({income, selected, onSelect}: {income: Income, selected: boolean, onSelect: () => void}) => {

    const renderPaymentHistoryOverview = () => {
        const incompletePayments = income.history.filter(payment => !payment.completed)
        if (incompletePayments.length > 1) {
            const currencySums = incompletePayments.reduce((acc: any, payment: IncomePayment) => {
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
                        {incompletePayments.length} due payments
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
        } else if (incompletePayments.length === 1) {
            return (
                <div className='flex items-center w-full justify-between gap-6'>
                    <div className='flex items-center gap-3'>
                        <div className="pulsating-indicator warning"/>
                        {incompletePayments[0].reference}
                    </div>
                    <div className="flex items-center shrink-0">{incompletePayments[0].amount.currency.symbol} {incompletePayments[0].amount.amount}</div>
                </div>
            )
        } else {
            return (
                <div className='flex items-center w-full justify-between gap-6'>
                    <div className='flex items-center gap-3'>
                        <div className="pulsating-indicator valid"/>
                        All payments completed
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={`property-expense-card ${selected && 'selected'}`} onClick={onSelect}>
            <div className='desc'>{income.title}</div>
            <div className='amount'>{income.amount.currency.symbol} {income.amount.amount} · {income.frequency.frequency}</div>
            <div className="upcoming-box">
                {renderPaymentHistoryOverview()}
            </div>
        </div>
    )
}

export default PropertyIncomesCard