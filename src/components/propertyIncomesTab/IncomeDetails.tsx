import { Edit, Trash, Xmark } from 'iconoir-react'
import { Currency, EntryPayment, Expense, ExpensePayment, Income, IncomePayment, Property } from '../../types/property'
import './propertyIncomeTabStyles.scss'
import { formatDate } from 'src/utils'
import { useMemo, useState } from 'react'
import DeleteConfirmationDialog from '../dialog/DeleteConfirmationDialog'
import { deletePropertyIncome, updateIncomePayment } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import PaymentCard from '../paymentCard/PaymentCard'
import EditIncomeDialog from '../dialog/EditIncomeDialog'
import EditPaymentDialog from '../dialog/EditPaymentDialog'
import { SubmitHandler } from 'react-hook-form'

const calculateUpcomingPayment = (income: Income) => {
    const today = new Date()
    let currentDate = new Date(income.indexDate)

    // Calculate past payments
    while (currentDate <= today) {
        currentDate = income.frequency.unit === 'm'
            ? new Date(currentDate.setMonth(currentDate.getMonth() + income.frequency.value))
            : new Date(currentDate.setFullYear(currentDate.getFullYear() + income.frequency.value))
    }
    return {
        id: 'upcoming',
        amount: income.amount,
        date: currentDate.toISOString().split('T')[0],
        reference: 'Upcoming Payment',
        completed: false
    }
}

const IncomeDetails = ({ updateIncome, onClose, property }: { updateIncome: () => void, onClose: () => void, property: Property }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openEditPaymentDialog, setOpenEditPaymentDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [payment, setPayment] = useState<EntryPayment>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>(payment?.amount.currency ?? { symbol: "USD", currency: "usd" })
    const [completed, setCompleted] = useState(payment?.completed ?? false)

    const { currentUser } = useAuth()
    const { selectedIncome: selectedIncomeRef, updatePropertyOptimistically, updateIncomeOptimistically } = useProperties()
    const selectedIncome = useMemo(() => property.incomes?.find(inc => inc.id === selectedIncomeRef?.id), [property.incomes, selectedIncomeRef])

    const handleDelete = async () => {
        if (!selectedIncome) return
        setLoading(true)
        try {
            await deletePropertyIncome(currentUser.id, property.id, selectedIncome.id)
            toast.success('Income deleted successfully')
            updatePropertyOptimistically({...property, incomes: property.incomes?.filter(exp => exp.id !== selectedIncome.id)})
            setOpenDeleteDialog(false)
            onClose()
        } catch (error) {
            console.error('Error deleting income', error)
            toast.error('Failed to delete income')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit: SubmitHandler<EntryPayment> = async (data) => {
        setLoading(true)
        const updatedPayment = { ...payment, amount: { amount: data.amount?.amount, currency: currencySymbol }, id: payment?.id ?? '', completed, date: payment?.date ?? new Date().toISOString(), reference: data.reference }
        if (openEditPaymentDialog) {
            try {
                await updateIncomePayment(currentUser.id, property.id, selectedIncome!.id, updatedPayment)
                const updatedIncome = {
                    ...selectedIncome,
                    id: selectedIncome?.id ?? '',
                    indexDate: selectedIncome?.indexDate ?? new Date(),
                    description: selectedIncome?.description ?? '',
                    title: selectedIncome?.title ?? '',
                    amount: selectedIncome?.amount ?? { amount: 0, currency: currencySymbol },
                    frequency: selectedIncome?.frequency ?? { frequency: 'monthly', value: 1, unit: 'm' },
                    history: selectedIncome!.history.map((payment) =>
                    payment.id === updatedPayment.id ? updatedPayment : payment
                    )
                }
                updateIncomeOptimistically(property.id, updatedIncome)
                updateIncome()
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
        <div className={`expense-details-container-wrap ${!selectedIncome && 'collapsed'}`}>
            <div className="expense-details-container">
                <div className="flex items-center justify-between font-medium text-[16px]">
                    Income details
                    <div className="icon-box-close"><Xmark color='#404040' onClick={onClose}/></div>
                </div>
                {selectedIncome && (
                    <div className="mt-4 px-4 py-3 border rounded-lg flex flex-col relative">
                        <div className="text-[18px] font-medium">{selectedIncome.title}</div>
                        <div className="text-[14px] text-[#606060] font-semibold">{selectedIncome.amount.currency.symbol} {selectedIncome.amount.amount} · {selectedIncome.frequency.frequency}</div>
                        <div className="text-[12px] mt-4 text-[#606060]">Date of Index</div>
                        <div className="font-medium">{formatDate(selectedIncome.indexDate.toString())}</div>
                        <div className="text-[12px] mt-3 text-[#606060]">Description</div>
                        <div className="text-[14px] mt-1 text-[#404040]">{selectedIncome.description}</div>
                        <div className="flex flex-col gap-2 absolute top-2 right-2">
                            <div className="square-button" onClick={() => setOpenEditDialog(true)}>
                                <Edit color='#404040' width={16} height={16}/>
                                <div className="tooltip">Edit Income</div>
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
                    {selectedIncome && (() => {
                        const sortedHistory = [...selectedIncome.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        return [calculateUpcomingPayment(selectedIncome), ...sortedHistory].map((payment: IncomePayment) => {
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
            {openEditDialog && selectedIncome && <EditIncomeDialog isOpen={openEditDialog} close={() => setOpenEditDialog(false)} propertyId={property.id} />}
            {openDeleteDialog && <DeleteConfirmationDialog isOpen={openDeleteDialog} loading={loading} close={() => setOpenDeleteDialog(false)} onDelete={handleDelete} />}
            {openEditPaymentDialog && selectedIncome && 
                <EditPaymentDialog 
                    isOpen={openEditPaymentDialog} 
                    close={() => setOpenEditPaymentDialog(false)} 
                    loading={loading} 
                    propertyId={property.id} 
                    entry={selectedIncome} 
                    payment={payment} 
                    currencySymbol={currencySymbol}
                    setCurrencySymbol={setCurrencySymbol}
                    completed={completed}
                    setCompleted={setCompleted}
                    updateEntry={updateIncome}
                    onSubmit={onSubmit} 
                />
            }
        </div>
    )
}

export default IncomeDetails