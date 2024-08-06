import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { useState } from 'react'
import { useForm } from 'react-hook-form' 
import { useAuth } from '../../contexts/AuthContext'
import { addUserDocument } from '../../services/firestoreService'

const AuthForm = ({type}: {type: 'signup' | 'login'}) => {

    const [error, setError] = useState<{message: string}>({message: ''})
    const { signup, login } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data: { email: string, password: string }) => {
        try {
            if (type === 'signup') {
                signup(data.email, data.password).then((userCredential: UserCredential) => {
                    addUserDocument({
                        id: userCredential.user.uid,
                        email: userCredential.user.email || '',
                        name: userCredential.user.displayName || '',
                        properties: []
                    })
                })
            } else {
                await login(data.email, data.password)
            }
        } catch (error: any) {
            setError({message: error.message})
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="w-full max-w-xs">
            <h2>{type === 'signup' ? 'Sign Up' : 'Login'}</h2>
            {error.message && <p>{error.message}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Email"
                />
                {/* {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>} */}
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Password"
                />
                {/* {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>} */}
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {type === 'login' ? 'Login' : 'Sign Up'}
                </button>
            </div>
        </form>
    )
}

export default AuthForm