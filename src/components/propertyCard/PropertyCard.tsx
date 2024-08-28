import { Property } from "src/types/property"
import { useNavigate } from 'react-router-dom'
import './propertyCardStyles.scss'
import { sumAmountsPerCurrency } from "src/utils"

const PropertyCard = ({property}: {property: Property}) => {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/properties/${property.id}`)
    }

    const calculateUnpaidExpenses = () => {
        return property.expenses?.flatMap(expense => 
            expense.history.filter(payment => !payment.completed)
        ) || []
    }

    const calculateUnpaidIncomes = () => {
        return property.incomes?.flatMap(income => 
            income.history.filter(payment => !payment.completed)
        ) || []
    }

    const renderBadges = () => {
        const unpaidExpenses = calculateUnpaidExpenses()
        const unpaidIncomes = calculateUnpaidIncomes()

        if (unpaidExpenses.length > 0 || unpaidIncomes.length > 0) {
            return (
                <div className="badges">
                    {unpaidExpenses.length > 0 && (
                        <div className="badge">
                            <span className="light-indicator"></span>
                            <div className="label">Due expenses</div>
                            <div className="value">{sumAmountsPerCurrency(unpaidExpenses)}</div>
                        </div>
                    )}
                    {unpaidIncomes.length > 0 && (
                        <div className="badge">
                            <span className="light-indicator"></span>
                            <div className="label">Due incomes</div>
                            <div className="value">{sumAmountsPerCurrency(unpaidIncomes)}</div>
                        </div>
                    )}
                </div>
            )
        } else {
            return (
                <div className="badges">
                    <div className="badge">
                        <span className="light-indicator green"></span>
                        <div className="label">Everything up to date</div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="property-card-container" onClick={handleCardClick}>
            <div className="property-card-header">
                <div className="property-card-title">
                    <div className="title">{property.name}</div>
                    <div className="padron">{property.padron}</div>
                    <div className="address">{property.address.addressString}</div>
                </div>
            </div>
            {renderBadges()}
        </div>
    )
}

export default PropertyCard