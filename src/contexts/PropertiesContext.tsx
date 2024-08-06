import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getUserProperties } from 'src/services/firestoreService'
import { Property } from 'src/types/property'
import { useAuth } from 'src/contexts/AuthContext'

interface PropertiesContextType {
  properties: Property[]
  loading: boolean
  fetchProperties: () => void
  addPropertyOptimistically: (property: Property) => void
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined)

export const useProperties = () => {
  const context = useContext(PropertiesContext)
  if (!context) {
    throw new Error('useProperties must be used within a PropertiesProvider')
  }
  return context
}

export const PropertiesProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const properties = await getUserProperties(currentUser.id)
      setProperties(properties)
    } catch (error) {
      console.error('Error fetching properties', error)
    } finally {
      setLoading(false)
    }
  }

  const addPropertyOptimistically = (property: Property) => {
    setProperties(prevProperties => [...prevProperties, property])
  }

  useEffect(() => {
    fetchProperties()
  }, [currentUser])

  return (
    <PropertiesContext.Provider value={{ properties, loading, fetchProperties, addPropertyOptimistically }}>
      {children}
    </PropertiesContext.Provider>
  )
}