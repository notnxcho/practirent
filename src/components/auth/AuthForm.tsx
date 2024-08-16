import { UserCredential } from 'firebase/auth'
import { useState } from 'react'
import { useForm } from 'react-hook-form' 
import { useAuth } from '../../contexts/AuthContext'
import { addUserDocument } from '../../services/firestoreService'
import './authStyles.scss'
import '../forms/formStyles.scss'
import Button from '../common/Button/Button'
import { XmarkCircle } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Logo from '../../assets/practirent-iso.png'

const AuthForm = ({type}: {type: 'signup' | 'login'}) => {

    const [error, setError] = useState<{message: string}>({message: ''})
    const { signup, login } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async (data: { email: string, password: string, name?: string, lastName?: string }) => {
        setLoading(true)
        try {
            if (type === 'signup') {
                signup(data.email, data.password)
                    .then((userCredential: UserCredential) => {
                        addUserDocument({
                            id: userCredential.user.uid,
                            email: userCredential.user.email || '',
                            name: `${data.name} ${data.lastName}` || '',
                            properties: []
                        })
                        toast.success('Signup successful')
                    })
                    .catch((error: any) => {
                        setError({message: error.message})
                        toast.error('Signup failed')
                    })
            } else {
                await login(data.email, data.password)
                toast.success('Login successful')
            }
        } catch (error: any) {
            setError({message: error.message})
            toast.error('Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className='flex align-center justify-center mb-3'><img src={Logo} alt='logo' width={120} height={120}/></div>
                <form onSubmit={handleSubmit(onSubmit as any)} className="w-full form-container">
                    <div className="flex flex-col gap-3 mb-3">
                    <div className='text-4xl font-semibold leading-[140%]'>{error.message ? 'Oops...' : type === 'signup' ? "Let's get you started" : 'Welcome back!'}</div>
                    {error.message && <p className='flex items-center px-3 py-2 bg-[#f8f8f8] rounded gap-2 text-red-500 text-[14px] font-medium leading-[160%]'><XmarkCircle width={20} height={20} color='#FF4444'/>{error.message}</p>}
                </div>
                { type === 'signup' && (
                    <>
                        <div className='input-wrap'>
                            <label htmlFor="name" className="label">First Name</label>
                            <input id="name" {...register('name', { required: true })} type="text" className="input" placeholder='John'/>
                            {errors.name && <span className="text-red-500 text-xs">This field is required</span>}
                        </div>
                        <div className='input-wrap'>
                            <label htmlFor="last-name" className="label">Last Name</label>
                            <input id="lastName" {...register('lastName', { required: true })} type="text" className="input" placeholder='Doe'/>
                            {errors.lastName && <span className="text-red-500 text-xs">This field is required</span>}
                        </div>
                    </>
                )}
                <div className='input-wrap'>
                    <label htmlFor="email" className="label">Email</label>
                    <input id="email" {...register('email', { required: true })} type="email" className="input" placeholder='Email'/>
                    {errors.email && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                <div className='input-wrap'>
                    <label htmlFor="password" className="label">Password</label>
                    <input id="password" {...register('password', { required: true })} type="password" className="input" placeholder='Password'/>
                    {errors.password && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {type === 'login' && <div className='text-right text-[14px] text-gray-500 cursor-pointer hover:text-gray-600 underline underline-offset-2'>Forgot?</div>}
                <div className='flex flex-col mt-6 gap-3'>
                    <Button type='submit' loading={loading} size='large'>
                        {type === 'login' ? 'Login' : 'Sign Up'}
                    </Button>
                    <div className='text-center text-[14px] text-gray-500'>{type === 'login' ? "Don't have an account?" : "Already have an account?"} <span className='text-gray-600 cursor-pointer hover:text-gray-700 underline underline-offset-2' onClick={() => navigate(type === 'login' ? '/signup' : '/login')}>{type === 'login' ? 'Sign Up' : 'Login'}</span></div>
                </div>
            </form>
        </div>
    )
}

export default AuthForm