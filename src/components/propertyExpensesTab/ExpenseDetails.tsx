import { Edit, Trash, Xmark } from 'iconoir-react'
import { Expense, ExpensePayment, Property } from '../../types/property'
import './propertyExpensesTabStyles.scss'
import { formatDate } from 'src/utils'
import { useState } from 'react'
import EditExpenseDialog from '../dialog/EditExpenseDialog'
import DeleteExpenseDialog from '../dialog/DeleteExpenseDialog'
import { deletePropertyExpense } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import PaymentCard from '../paymentCard/PaymentCard'

const ExpenseDetails = ({ updateExpense, onClose, property }: { updateExpense: () => void, onClose: () => void, property: Property }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const { currentUser } = useAuth()
    const { selectedExpense, setSelectedExpense, updatePropertyOptimistically } = useProperties()

    const handleDelete = async () => {
        if (!selectedExpense) return
        try {
            await deletePropertyExpense(currentUser.id, property.id, selectedExpense.id)
            toast.success('Expense deleted successfully')
            updatePropertyOptimistically({...property, expenses: property.expenses?.filter(exp => exp.id !== selectedExpense.id)})
            setOpenDeleteDialog(false)
            onClose()
        } catch (error) {
            console.error('Error deleting expense', error)
            toast.error('Failed to delete expense')
        }
    }

    return (
        <div className={`expense-details-container-wrap ${!selectedExpense && 'collapsed'}`}>
            <div className="expense-details-container">
                <div className="flex items-center justify-between font-medium text-[16px]">
                    Expense details
                    <div className="icon-box-close"><Xmark color='#404040' onClick={onClose}/></div>
                </div>
                {selectedExpense && (
                    <div className="mt-4 px-4 py-3 border rounded-lg flex flex-col relative">
                        <div className="text-[18px] font-medium">{selectedExpense.title}</div>
                        <div className="text-[14px] text-[#606060] font-semibold">{selectedExpense.amount.currency.symbol} {selectedExpense.amount.amount} · {selectedExpense.frequency.frequency}</div>
                        <div className="text-[12px] mt-4 text-[#606060]">Date of Index</div>
                        <div className="font-medium">{formatDate(selectedExpense.indexDate.toString())}</div>
                        <div className="text-[12px] mt-3 text-[#606060]">Description</div>
                        <div className="font-medium text-[14px] text-[#404040]">{selectedExpense.description}</div>
                        <div className="flex flex-col gap-2 absolute top-2 right-2">
                            <div className="square-button" onClick={() => setOpenEditDialog(true)}>
                                <Edit color='#404040' width={16} height={16}/>
                                <div className="tooltip">Edit expense</div>
                            </div>
                            <div className="square-button" onClick={() => setOpenDeleteDialog(true)}>
                                <Trash color='#ff4400' width={16} height={16}/>
                                <div className="tooltip">Delete</div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col mt-4 rounded-lg bg-[#fafafa] p-3 gap-3">
                    <div className="text-[#404040] font-semibold">Payment History</div>
                    {selectedExpense && (() => {
                        const sortedHistory = [...selectedExpense.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        const futurePayments = sortedHistory.filter(payment => new Date(payment.date) > new Date()).reverse()
                        const pastPayments = sortedHistory.filter(payment => new Date(payment.date) <= new Date())
                        const paymentsToShow = [...futurePayments.slice(0, 1), ...pastPayments]

                        return paymentsToShow.map((payment: ExpensePayment) => {
                            const isFuture = new Date(payment.date) > new Date()
                            return (
                                <PaymentCard
                                    key={payment.id}
                                    date={formatDate(payment.date.toLocaleString())}
                                    reference={payment.reference}
                                    symbol={payment.amount.currency.symbol}
                                    amount={payment.amount.amount ?? 0}
                                    completed={payment.completed}
                                    isFuture={isFuture}
                                    propertyId={property.id}
                                    expense={selectedExpense}
                                    payment={payment}
                                    updateExpense={updateExpense}
                                />
                            )
                        })
                    })()}
                </div>
            </div>
            {openEditDialog && selectedExpense && <EditExpenseDialog isOpen={openEditDialog} close={() => setOpenEditDialog(false)} propertyId={property.id} />}
            {openDeleteDialog && <DeleteExpenseDialog isOpen={openDeleteDialog} close={() => setOpenDeleteDialog(false)} onDelete={handleDelete} />}
        </div>
    )
}

export default ExpenseDetails