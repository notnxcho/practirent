import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getUserProperties } from 'src/services/firestoreService'
import { Expense, Income, Property } from 'src/types/property'
import { useAuth } from 'src/contexts/AuthContext'

interface PropertiesContextType {
  properties: Property[]
  selectedExpense: Expense | null
  setSelectedExpense: (expense: Expense | null) => void
  selectedIncome: Income | null
  setSelectedIncome: (income: Income | null) => void
  loading: boolean
  fetchProperties: () => void
  addPropertyOptimistically: (property: Property) => void
  updatePropertyOptimistically: (updatedProperty: Property) => void
  addExpenseOptimistically: (propertyId: string, expense: Expense) => void
  updateExpenseOptimistically: (propertyId: string, updatedExpense: Expense) => void
  addIncomeOptimistically: (propertyId: string, income: Income) => void
  updateIncomeOptimistically: (propertyId: string, updatedIncome: Income) => void
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
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null)
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

  const updatePropertyOptimistically = (updatedProperty: Property) => {
    setProperties(prevProperties => prevProperties.map(prop => prop.id === updatedProperty.id ? updatedProperty : prop))
  }

  const addExpenseOptimistically = (propertyId: string, expense: Expense) => {
    setProperties(prevProperties =>
      prevProperties.map(prop =>
        prop.id === propertyId
          ? { ...prop, expenses: [...(prop.expenses || []), expense] }
          : prop
      )
    )
  }
  const addIncomeOptimistically = (propertyId: string, income: Income) => {
    setProperties(prevProperties =>
      prevProperties.map(prop =>
        prop.id === propertyId
          ? { ...prop, incomes: [...(prop.incomes || []), income] }
          : prop
      )
    )
  }

  const updateExpenseOptimistically = (propertyId: string, updatedExpense: Expense) => {
    setProperties(prevProperties =>
      prevProperties.map(prop =>
        prop.id === propertyId
          ? {
              ...prop,
              expenses: prop.expenses?.map(exp =>
                exp.id === updatedExpense.id ? updatedExpense : exp
              )
            }
          : prop
      )
    )
  }
  const updateIncomeOptimistically = (propertyId: string, updatedIncome: Income) => {
    setProperties(prevProperties =>
      prevProperties.map(prop =>
        prop.id === propertyId
          ? {
              ...prop,
              incomes: prop.incomes?.map(inc =>
                inc.id === updatedIncome.id ? updatedIncome : inc
              )
            }
          : prop
      )
    )
  }

  useEffect(() => {
    fetchProperties()
  }, [currentUser])

  return (
    <PropertiesContext.Provider 
      value={{ 
        properties, 
        selectedExpense, 
        setSelectedExpense, 
        selectedIncome, 
        setSelectedIncome, 
        loading, 
        fetchProperties, 
        addPropertyOptimistically, 
        updatePropertyOptimistically, 
        addExpenseOptimistically, 
        updateExpenseOptimistically,
        addIncomeOptimistically,
        updateIncomeOptimistically
      }}>
      {children}
    </PropertiesContext.Provider>
  )
}