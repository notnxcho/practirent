import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '../layout'
import { Property } from '../../types/property'
import { getUserProperties } from '../../services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import PropertyLayout from '../layout/PropertyLayout'
import AddressWidget from 'src/components/addressWidget/AddressWidget'
import PropertyExpensesTab from 'src/components/propertyExpensesTab/PropertyExpensesTab'

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const { currentUser } = useAuth()
  const [tabs, setTabs] = useState([{name: 'Overview', active: true}, {name: 'Income', active: false}, {name: 'Expenses', active: false}])

  useEffect(() => {
    const fetchProperty = async () => {
      const properties = await getUserProperties(currentUser.id) // Replace 'userId' with actual user ID
      const foundProperty = properties.find((prop: Property) => prop.id === id)
      setProperty(foundProperty || null)
    }

    fetchProperty()
  }, [id])


  return (
    <PropertyLayout property={property} tabs={tabs} setTabs={setTabs}>
      {!property ? <div>Loading...</div> : (  
      <div className="layout-content-container" style={{marginTop: 0}}>
        { tabs[0].active && <div className='flex p-6'>
          <AddressWidget address={property.address} /></div>
          }
        { tabs[1].active && <div>Income</div>}
        { tabs[2].active && <PropertyExpensesTab property={property}/>}

        </div>
      )}
    </PropertyLayout>
  )
}

export default PropertyDetails