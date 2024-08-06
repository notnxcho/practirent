import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getUserDocument } from '../services/firestoreService'
import { User } from '../types/user'

const AuthContext = createContext<AuthContextType | undefined | any>(undefined)
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      console.log(user)
      const loggedUser = user ? await getUserDocument(user.uid) : null
      
      console.log("loggedUser", loggedUser)
      setCurrentUser(loggedUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth)
  }

  const value = {
    currentUser,
    signup,
    logout,
    login
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

interface AuthContextType {
  currentUser: any
  signup: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
  login: (email: string, password: string) => Promise<any>
}