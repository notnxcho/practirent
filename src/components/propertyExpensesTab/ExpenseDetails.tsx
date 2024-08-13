import { Edit, Trash, Xmark } from 'iconoir-react'
import { Expense, ExpensePayment } from '../../types/property'
import './propertyExpensesTabStyles.scss'
import { formatDate } from 'src/utils'

const ExpenseDetails = ({ expense, onClose }: { expense: Expense | null, onClose: () => void }) => {
    console.log('kla exp', expense)
    return (
        <div className={`expense-details-container-wrap ${!expense && 'collapsed'}`}>
            <div className="expense-details-container">
                <div className="flex items-center justify-between font-medium text-[16px]">
                    Expense details
                    <div className="icon-box-close"><Xmark color='#404040' onClick={onClose}/></div>
                </div>
                {expense && (
                    <div className="mt-4 px-4 py-3 border rounded-lg flex flex-col relative">
                        <div className="text-[18px] font-medium">{expense.description}</div>
                        <div className="text-[14px] text-[#606060] font-semibold">{expense.amount.currency.symbol} {expense.amount.amount} · {expense.frequency.frequency}</div>
                        <div className="text-[12px] mt-2 text-[#606060]">Date of Index</div>
                        <div className="font-medium">{formatDate(expense.indexDate.toString())}</div>

                        <div className="flex flex-col gap-2 absolute top-2 right-2">
                            <div className="square-button">
                                <Edit color='#404040' width={16} height={16}/>
                                <div className="tooltip">Edit expense</div>
                            </div>
                            <div className="square-button">
                                <Trash color='#ff4400' width={16} height={16}/>
                                <div className="tooltip">Delete</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* <p>Description: {expense?.description}</p>
            <p>Amount: {expense?.amount?.currency?.symbol} {expense?.amount?.amount}</p>
            <p>Frequency: {expense?.frequency?.frequency}</p>
            <p>Index Date: {expense?.indexDate?.toLocaleDateString()}</p> */}
            <h3>Payment History</h3>
            <ul>
                {expense?.history.map((payment: ExpensePayment) => (
                    <li key={payment.id}>
                        {payment?.date.toLocaleString()} - {payment.amount.currency.symbol} {payment.amount.amount} - {payment.reference} - {payment.completed ? 'Completed' : 'Pending'}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ExpenseDetails