import { Property } from 'src/types/property'
import AddPropertyForm from '../forms/AddPropertyForm'
import './dialogStyles.scss'
import { Xmark } from 'iconoir-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { Currency } from 'src/types/property'
import { addUserProperty } from 'src/services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import { useProperties } from 'src/contexts/PropertiesContext'
import { toast } from 'react-toastify'
import { doc, collection } from 'firebase/firestore'
import { firestoreDB } from '../../firebase'
import Button from '../common/Button/Button'

const AddPropertyDialog = ({isOpen, close}: PropertyDialogProps) => {
    const { currentUser } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm<Property>()
    const [currencySymbol, setCurrencySymbol] = useState<Currency>({ currency: 'usd', symbol: 'USD' })
    const [loading, setLoading] = useState(false)
    const { addPropertyOptimistically } = useProperties()

    const onSubmit: SubmitHandler<Property> = data => {
        setLoading(true)
        const propertyWithId = { ...data, id: doc(collection(firestoreDB, 'properties')).id, marketValue: { amount: data.marketValue?.amount, currency: currencySymbol }, expenses: [], incomes: []}
        console.log('data del form', propertyWithId)

        addUserProperty(currentUser.id, propertyWithId).then(() => {
            addPropertyOptimistically(propertyWithId)
            toast.success('Property added successfully')
            close()
        }).catch((error) => {
            console.error('Error adding property', error)
            toast.error('Failed to add property')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="overlay">
            <div className="dialog-container">
                <div className="header">
                    <div className="header-title">Create a new property</div>
                    <div className="close" onClick={close}>
                        <Xmark color="#404040"/>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="form-container min-w-[400px]">
                    <AddPropertyForm errors={errors} register={register} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} />
                    <Button type='submit' loading={loading} fullWidth size='large' className='mt-4'>Add Property</Button>
                </form>
            </div>
        </div>
    )
}

interface PropertyDialogProps {
    isOpen: boolean
    close: () => void
}

export default AddPropertyDialog