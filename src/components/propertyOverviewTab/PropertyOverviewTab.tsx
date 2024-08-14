import { Property } from 'src/types/property'
import AddressWidget from './AddressWidget'
import './propertyOverviewTabStyles.scss'

const PropertyOverviewTab = ({property}: {property: Property}) => {
    return (
        <div className="flex p-4 flex-wrap">
            <AddressWidget address={property.address} padron={property.padron || ''} />
        </div>
    )
}

export default PropertyOverviewTab