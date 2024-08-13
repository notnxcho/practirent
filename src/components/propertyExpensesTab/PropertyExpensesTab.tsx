import { useState } from 'react'
import { Expense, Property } from 'src/types/property'
import './propertyExpensesTabStyles.scss'
import PropertyExpenseCard from './PropertyExpenseCard'
import Button from '../common/Button/Button'
import AddExpenseDialog from '../dialog/AddExpenseDialog'
import ExpenseDetails from './ExpenseDetails'

const PropertyExpensesTab = ({property}: {property: Property}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

    const toggleOpenDialog = () => {
        setOpenDialog(!openDialog)
    }

    return (
        <div className="flex grow">
            <div className="property-expenses-tab">
                <div className="header mb-4">
                    Expenses
                    <Button onClick={toggleOpenDialog}>Add Expense</Button>
                </div>
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
            <ExpenseDetails expense={selectedExpense} onClose={() => setSelectedExpense(null)} />
        </div>
    )
}

export default PropertyExpensesTab