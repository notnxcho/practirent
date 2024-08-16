import { Edit, Trash, Xmark } from 'iconoir-react'
import { Currency, Expense, ExpensePayment, Property } from '../../types/property'
import './propertyExpensesTabStyles.scss'
import { formatDate } from 'src/utils'
import { useMemo, useState } from 'react'
import EditExpenseDialog from '../dialog/EditExpenseDialog'
import DeleteConfirmationDialog from '../dialog/DeleteConfirmationDialog'
import { deletePropertyExpense, updateExpensePayment } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import PaymentCard from '../paymentCard/PaymentCard'
import { SubmitHandler } from 'react-hook-form'
import EditPaymentDialog from '../dialog/EditPaymentDialog'


const ExpenseDetails = ({ updateExpense, onClose, property }: { updateExpense: () => void, onClose: () => void, property: Property }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openEditPaymentDialog, setOpenEditPaymentDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [payment, setPayment] = useState<ExpensePayment>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>(payment?.amount.currency ?? { symbol: "USD", currency: "usd" })
    const [completed, setCompleted] = useState(payment?.completed ?? false)

    const { currentUser } = useAuth()
    const { selectedExpense: selectedExpenseRef, updatePropertyOptimistically, updateExpenseOptimistically } = useProperties()

    const selectedExpense = useMemo(() => property.expenses?.find(exp => exp.id === selectedExpenseRef?.id), [property.expenses, selectedExpenseRef])

    const handleDelete = async () => {
        if (!selectedExpense) return
        setLoading(true)
        try {
            await deletePropertyExpense(currentUser.id, property.id, selectedExpense.id)
            toast.success('Expense deleted successfully')
            updatePropertyOptimistically({...property, expenses: property.expenses?.filter(exp => exp.id !== selectedExpense.id)})
            setOpenDeleteDialog(false)
            onClose()
        } catch (error) {
            console.error('Error deleting expense', error)
            toast.error('Failed to delete expense')
        } finally {
            setLoading(false)
        }
    }

    const calculateUpcomingPayment = (expense: Expense) => {
        const today = new Date()
        let currentDate = new Date(expense.indexDate)


        // Calculate past payments
        while (currentDate <= today) {
            currentDate = expense.frequency.unit === 'm'
                ? new Date(currentDate.setMonth(currentDate.getMonth() + expense.frequency.value))
                : new Date(currentDate.setFullYear(currentDate.getFullYear() + expense.frequency.value))
        }
        return {
            id: 'upcoming',
            amount: expense.amount,
            date: currentDate.toISOString().split('T')[0],
            reference: 'Upcoming Payment',
            completed: false
        }
    }

    const onSubmit: SubmitHandler<ExpensePayment> = async (data) => {
        setLoading(true)
        const updatedPayment = { ...payment, amount: { amount: data.amount?.amount, currency: payment?.amount.currency ?? { symbol: "USD", currency: "usd" } }, id: payment?.id ?? '', completed, date: payment?.date ?? new Date().toISOString(), reference: data.reference }
        if (openEditPaymentDialog) {
            try {
                await updateExpensePayment(currentUser.id, property.id, selectedExpense!.id, updatedPayment)
                const updatedExpense = {
                    ...selectedExpense,
                    id: selectedExpense?.id ?? '',
                    indexDate: selectedExpense?.indexDate ?? new Date(),
                    description: selectedExpense?.description ?? '',
                    title: selectedExpense?.title ?? '',
                    amount: selectedExpense?.amount ?? { amount: 0, currency: payment?.amount.currency ?? { symbol: "USD", currency: "usd" } },
                    frequency: selectedExpense?.frequency ?? { frequency: 'monthly', value: 1, unit: 'm' },
                    history: selectedExpense!.history.map((payment) =>
                    payment.id === updatedPayment.id ? updatedPayment : payment
                    )
                }
                updateExpenseOptimistically(property.id, updatedExpense)
                updateExpense()
                toast.success('Payment updated successfully')
                setOpenEditPaymentDialog(false)
            } catch (error) {
            console.error('Error updating payment', error)
            toast.error('Failed to update payment')
            } finally {
            setLoading(false)
            }
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
                        <div className="text-[14px] mt-1 text-[#404040]">{selectedExpense.description}</div>
                        <div className="flex flex-col gap-2 absolute top-2 right-2">
                            <div className="square-button" onClick={() => setOpenEditDialog(true)}>
                                <Edit color='#404040' width={16} height={16}/>
                                <div className="tooltip">Edit Expense</div>
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
                        // const futurePayments = sortedHistory.filter(payment => new Date(payment.date) > new Date()).reverse()
                        // const pastPayments = sortedHistory.filter(payment => new Date(payment.date) <= new Date())
                        // const paymentsToShow = [...futurePayments.slice(0, 1), ...pastPayments]

                        return [calculateUpcomingPayment(selectedExpense), ...sortedHistory].map((payment: ExpensePayment) => {
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
                                    onClick={() => {setPayment(payment); setOpenEditPaymentDialog(true)}}
                                />
                            )
                        })
                    })()}
                </div>
            </div>
            {openEditDialog && selectedExpense && <EditExpenseDialog isOpen={openEditDialog} close={() => setOpenEditDialog(false)} propertyId={property.id} />}
            {openDeleteDialog && <DeleteConfirmationDialog isOpen={openDeleteDialog} loading={loading} close={() => setOpenDeleteDialog(false)} onDelete={handleDelete} />}
            {openEditPaymentDialog && selectedExpense && 
                <EditPaymentDialog 
                    isOpen={openEditPaymentDialog} 
                    close={() => setOpenEditPaymentDialog(false)} 
                    loading={loading} 
                    propertyId={property.id} 
                    entry={selectedExpense} 
                    payment={payment}
                    currencySymbol={currencySymbol}
                    setCurrencySymbol={setCurrencySymbol}
                    completed={completed}
                    setCompleted={setCompleted}
                    updateEntry={updateExpense}
                    onSubmit={onSubmit} 
                />
            }
        </div>
    )
}

export default ExpenseDetails