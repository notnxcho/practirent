import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { auth, createUserWithEmailAndPassword } from '../firebase'

interface AuthContextType {
  currentUser: any
  signup: (email: string, password: string) => Promise<any>
  
}

const AuthContext = createContext<AuthContextType | undefined | any>(undefined)
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const value = {
    currentUser,
    signup
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}