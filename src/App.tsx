import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import Home from './components/home/Home'
import Login from './components/login/Login'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PrivateRoute component={Home} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  )
}

export default App