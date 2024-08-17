import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AuthForm from './AuthForm'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (currentUser) {
      navigate('/properties')
    }
  }, [currentUser, navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {currentUser ? (
        <p onClick={logout}>Already logged in</p>
      ) : (
        <AuthForm type="signup" />
      )}
    </div>
  )
}

export default Signup