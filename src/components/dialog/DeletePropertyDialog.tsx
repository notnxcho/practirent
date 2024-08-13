import { useState } from 'react'
import { Property } from 'src/types/property'
import Button from '../common/Button/Button'
import { Xmark } from 'iconoir-react'
import './dialogStyles.scss'

const DeletePropertyDialog = ({ isOpen, close, property, onDelete }: { isOpen: boolean, close: () => void, property: Property, onDelete: () => void }) => {
    const [inputValue, setInputValue] = useState('')
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
        setIsConfirmEnabled(value === property.name)
    }

    return (
        isOpen ? (
            <div className="overlay">
                <div className="dialog-container">
                    <div className="header">
                        <div className="header-title">Delete Property</div>
                        <div className="icon-box-close" onClick={close}>
                            <Xmark color="#404040"/>
                        </div>
                    </div>
                    <div className="form-container mt-2">
                        <div className='input-wrap'>
                            <div className='label mb-1'>To confirm deletion, please type the name of the property: <strong>{property.name}</strong></div>
                            <input type="text" value={inputValue} onChange={handleInputChange} className="input" />
                        </div>
                    </div>
                    <div className="flex w-full justify-end">
                        <Button variant='danger' onClick={onDelete} disabled={!isConfirmEnabled}>Delete</Button>
                    </div>
                </div>
            </div>
        ) : null
    )
}

export default DeletePropertyDialog