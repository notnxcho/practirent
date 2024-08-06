import { useAuth } from '../../contexts/AuthContext'
import AuthForm from './AuthForm'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const { currentUser, logout } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentUser, navigate])
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {currentUser ? (
        <p onClick={logout}>Login successful</p>
      ) : (
        <AuthForm type="login" />
      )}
    </div>
  )
}

export default Login