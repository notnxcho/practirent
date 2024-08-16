import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PropertiesProvider } from './contexts/PropertiesContext'
import PrivateRoute from './routes/PrivateRoute'
import Home from './pages/home/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Properties from './pages/properties/Properties'
import PropertyDetails from './pages/properties/PropertyDetails'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <AuthProvider>
      <PropertiesProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute component={Home} />} />
          <Route path="/properties" element={<PrivateRoute component={Properties} />} />
          <Route path="/properties/:id" element={<PrivateRoute component={PropertyDetails} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnHover={true}
          draggable={true}
          theme="dark"
          transition={Slide}
        />
      </PropertiesProvider>
    </AuthProvider>
  )
}

export default App