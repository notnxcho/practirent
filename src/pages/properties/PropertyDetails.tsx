import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '../layout'
import { Property } from '../../types/property'
import { getUserProperties } from '../../services/firestoreService'
import { useAuth } from 'src/contexts/AuthContext'
import PropertyLayout from '../layout/PropertyLayout'
import PropertyExpensesTab from 'src/components/propertyExpensesTab/PropertyExpensesTab'
import { useProperties } from 'src/contexts/PropertiesContext'
import PropertyIncomesTab from 'src/components/propertyIncomesTab/PropertyIncomesTab'
import PropertyOverviewTab from 'src/components/propertyOverviewTab/PropertyOverviewTab'

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const { currentUser } = useAuth()
  const { properties, updatePropertyOptimistically } = useProperties()
  const [tabs, setTabs] = useState([{name: 'Overview', active: true}, {name: 'Income', active: false}, {name: 'Expenses', active: false}])

  useEffect(() => {
    const fetchProperty = async () => {
      const properties = await getUserProperties(currentUser.id)
      const foundProperty = properties.find((prop: Property) => prop.id === id)
      setProperty(foundProperty || null)
    }

    const foundProperty = properties.find((prop: Property) => prop.id === id)
    if (foundProperty) {
      setProperty(foundProperty)
    } else {
      fetchProperty()
    }
  }, [id, properties, currentUser.id])

  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperty(updatedProperty)
    updatePropertyOptimistically(updatedProperty)
  }

  return (
    <PropertyLayout property={property} tabs={tabs} setTabs={setTabs} onUpdateProperty={handleUpdateProperty}>
      {!property ? <div>Loading...</div> : (  
      <div className="layout-content-container" style={{marginTop: 0}}>
        { tabs[0].active && <PropertyOverviewTab property={property}/>}
        { tabs[1].active && <PropertyIncomesTab property={property}/>}
        { tabs[2].active && <PropertyExpensesTab property={property}/>}

        </div>
      )}
    </PropertyLayout>
  )
}

export default PropertyDetails