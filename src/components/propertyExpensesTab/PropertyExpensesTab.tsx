import { useEffect, useState } from 'react'
import { Expense, Property } from 'src/types/property'
import './propertyExpensesTabStyles.scss'
import PropertyExpenseCard from './PropertyExpenseCard'
import Button from '../common/Button/Button'
import AddExpenseDialog from '../dialog/AddExpenseDialog'
import ExpenseDetails from './ExpenseDetails'
import { useProperties } from 'src/contexts/PropertiesContext'
import EmptyState from '../../assets/empty-state.png'

const PropertyExpensesTab = ({property}: {property: Property}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const { selectedExpense, setSelectedExpense } = useProperties()

    useEffect(() => {
        setSelectedExpense(selectedExpense)
    }, [property])

    const toggleOpenDialog = () => {
        setOpenDialog(!openDialog)
    }

    return (
        <div className="flex grow">
            <div className={`property-expenses-tab ${selectedExpense && 'collapsed'}`}>
                <div className="header">
                    Expenses
                    <Button onClick={toggleOpenDialog}>Add Expense</Button>
                </div>
                {!property?.expenses?.length && (
                    <div className="empty-state">
                        <img src={EmptyState} alt="empty-state" />
                        <div className="empty-state-text">No expenses available</div>
                    </div>
                )}
                <div className="expenses-grid">
                    {property?.expenses?.map((expense) => (
                        <PropertyExpenseCard 
                            expense={expense} 
                            key={expense.id} 
                            selected={selectedExpense?.id === expense.id} 
                            onSelect={() => setSelectedExpense(expense)}
                        />
                    ))}
                </div>
                {openDialog && <AddExpenseDialog isOpen={openDialog} close={toggleOpenDialog} propertyId={property.id} />}
            </div>
            <ExpenseDetails updateExpense={()=>{setSelectedExpense(selectedExpense)}} property={property} onClose={() => setSelectedExpense(null)} />
        </div>
    )
}

export default PropertyExpensesTab