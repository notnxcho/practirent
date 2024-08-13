import { Property } from "src/types/property"
import { useNavigate } from 'react-router-dom'
import './propertyCardStyles.scss'

const PropertyCard = ({property}: {property: Property}) => {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/properties/${property.id}`)
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
        </div>
    )
}

export default PropertyCard