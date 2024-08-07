import { Address } from 'src/types/property'
import './addressWidgetStyles.scss'

const AddressWidget = ({address}: {address: Address}) => {
    return (
        <div className="address-widget-body">
            <div className="flex items-center gap-2 text-[18px] font-medium">Address Info</div>
            <div className="flex items-center gap-8 justify-between w-full">
                <div className="address-item">
                    <div className="label">Address</div>
                    <div className="value">{address?.addressString || 'No address'}</div>
                </div>
            </div>
            <div className="flex items-center gap-8 justify-between w-full">
                <div className="address-item">
                    <div className="label">City</div>
                    <div className="value">{address.city}, {address.department}</div>
                </div>
            </div>
        </div>
    )
}

export default AddressWidget