import { Address } from 'src/types/property'
import './propertyOverviewTabStyles.scss'

const AddressWidget = ({address, padron}: {address: Address, padron: string}) => {
    return (
        <div className="address-widget-body">
            <div className="flex items-center gap-2 text-[18px] font-medium">Address Info</div>
            <div className="flex items-center gap-8 justify-between w-full flex-wrap flex-shrink">
                <div className="address-item">
                    <div className="label">Address</div>
                    <div className="value">{address?.addressString || 'No address'}</div>
                </div>
                <div className="address-item">
                    <div className="label">Street</div>
                    <div className="value">{address?.street} {address?.streetNumber}</div>
                </div>
                <div className="address-item">
                    <div className="label">City</div>
                    <div className="value">{address.city}, {address.department}</div>
                </div>
                <div className="address-item">
                    <div className="label">Padron</div>
                    <div className="value">{padron}</div>
                </div>
            </div>
        </div>
    )
}

export default AddressWidget