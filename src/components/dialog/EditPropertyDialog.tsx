import { Property } from 'src/types/property'
import AddPropertyForm from '../forms/AddPropertyForm'
import './dialogStyles.scss'
import { Xmark } from 'iconoir-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Currency } from 'src/types/property'
import { updateUserProperty } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import Button from '../common/Button/Button'

const EditPropertyDialog = ({ isOpen, close, property }: EditPropertyDialogProps) => {
    const { currentUser } = useAuth()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Property>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>({ currency: 'usd', symbol: 'USD' })
    const [loading, setLoading] = useState(false)
    const { updatePropertyOptimistically } = useProperties()

    useEffect(() => {
        if (property) {
            reset(property)
            setCurrencySymbol(property.marketValue?.currency || { currency: 'usd', symbol: 'USD' })
        }
    }, [property, reset])

    const onSubmit: SubmitHandler<Property> = data => {
        setLoading(true)
        const updatedProperty = { ...data, marketValue: { amount: data.marketValue?.amount, currency: currencySymbol } }
        updateUserProperty(currentUser.id, updatedProperty).then(() => {
            updatePropertyOptimistically(updatedProperty)
            toast.success('Property updated successfully')
            close()
        }).catch((error) => {
            console.error('Error updating property', error)
            toast.error('Failed to update property')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="overlay">
            <div className="dialog-container">
                <div className="header">
                    <div className="header-title">Edit Property</div>
                    <div className="icon-box-close" onClick={close}>
                        <Xmark color="#404040"/>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="form-container min-w-[400px]">
                    <AddPropertyForm errors={errors} register={register} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} />
                    <Button type='submit' loading={loading} fullWidth size='large' className='mt-4'>Update Property</Button>
                </form>
            </div>
        </div>
    )
}

interface EditPropertyDialogProps {
    isOpen: boolean
    close: () => void
    property: Property
}

export default EditPropertyDialog