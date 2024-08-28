import { useState } from 'react'
import { Property } from 'src/types/property'
import Button from '../common/Button/Button'
import { Xmark } from 'iconoir-react'
import './dialogStyles.scss'
import { toast } from 'react-toastify'
import { useAuth } from 'src/contexts/AuthContext'
import { deleteProperty } from 'src/services/firestoreService'
import { useNavigate } from 'react-router-dom'

const DeletePropertyDialog = ({ isOpen, close, property }: { isOpen: boolean, close: () => void, property: Property }) => {
    const [inputValue, setInputValue] = useState('')
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
        setIsConfirmEnabled(value === property.name)
    }

    const handleDeleteProperty = async () => {
        try {
            await deleteProperty(currentUser.id, property.id)
            close()
            navigate('/properties')
            toast.success('Property deleted successfully')
        } catch (error) {
            toast.error('Error deleting property')
        }
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
                        <Button variant='danger' onClick={handleDeleteProperty} loading={loading} disabled={!isConfirmEnabled || loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
                    </div>
                </div>
            </div>
        ) : null
    )
}

export default DeletePropertyDialog