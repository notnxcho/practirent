import { useEffect, useState } from 'react'
import { Property } from 'src/types/property'
import './propertyIncomeTabStyles.scss'
import PropertyIncomesCard from './PropertyIncomesCard'
import Button from '../common/Button/Button'
import IncomeDetails from './IncomeDetails'
import { useProperties } from 'src/contexts/PropertiesContext'
import AddIncomeDialog from '../dialog/AddIncomeDialog'
import EmptyState from '../../assets/empty-state.png'

const PropertyIncomesTab = ({property}: {property: Property}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const { selectedIncome, setSelectedIncome } = useProperties()

    useEffect(() => {
        setSelectedIncome(selectedIncome)
    }, [property])

    useEffect(() => {
        setSelectedIncome(null)
    }, [])

    const toggleOpenDialog = () => {
        setOpenDialog(!openDialog)
    }

    return (
        <div className="flex grow">
            <div className={`property-expenses-tab ${selectedIncome&& 'collapsed'}`}>
                <div className="header">
                    Incomes
                    <Button onClick={toggleOpenDialog}>Add Income</Button>
                </div>
                {!property?.incomes?.length && (
                    <div className="empty-state">
                        <img src={EmptyState} alt="empty-state" />
                        <div className="empty-state-text">No incomes available</div>
                    </div>
                )}
                <div className="expenses-grid">
                    {property?.incomes?.map((income) => (
                        <PropertyIncomesCard 
                            income={income} 
                            key={income.id} 
                            selected={selectedIncome?.id === income.id} 
                            onSelect={() => setSelectedIncome(income)}
                        />
                    ))}
                </div>
                {openDialog && <AddIncomeDialog isOpen={openDialog} close={toggleOpenDialog} propertyId={property.id} />}
            </div>
            <IncomeDetails updateIncome={()=>{setSelectedIncome(selectedIncome)}} property={property} onClose={() => setSelectedIncome(null)} />
        </div>
    )
}

export default PropertyIncomesTab