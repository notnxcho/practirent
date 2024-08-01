import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { auth, googleProvider } from '../../firebase'

function Login() {
  const { currentUser, signup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    // try {
    //   await auth.signInWithPopup(googleProvider)
    // } catch (error) {
    //   console.error(error)
    // }
  }

  const handleSignup = async (e: React.FormEvent) => {
    // e.preventDefault()
    // try {
    //   await signup(email, password)
    // } catch (error) {
    //   setError(error.message)
    // }
  }

  return (
    <div>
      <h1>Login</h1>
      {currentUser ? (
        <p>Already logged in</p>
      ) : (
        <>
          <button onClick={handleLogin}>Login with Google</button>
          <form onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            {error && <p>{error}</p>}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Login