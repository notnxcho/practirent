import { useState } from 'react'
import { Property } from 'src/types/property'
import './propertyExpensesTabStyles.scss'
import PropertyExpenseCard from './PropertyExpenseCard'
import Button from '../common/Button/Button'
import AddExpenseDialog from '../dialog/AddExpenseDialog'

const PropertyExpensesTab = ({property}: {property: Property}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const toggleOpenDialog = () => {
        setOpenDialog(!openDialog)
    }

    return (
        <div className="property-expenses-tab">
            <div className="header">
                Expenses
                <Button onClick={toggleOpenDialog} className='mt-4'>Add Expense</Button>
            </div>
            <div className="expenses-grid">
                {property?.expenses?.map((expense) => (
                    <PropertyExpenseCard expense={expense} key={expense.id} />
                ))}
            </div>
            {openDialog && <AddExpenseDialog isOpen={openDialog} close={toggleOpenDialog} propertyId={property.id} />}
        </div>
    )
}

export default PropertyExpensesTab