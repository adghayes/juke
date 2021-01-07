import { register } from '../lib/auth'
import { useReducer } from 'react'
import { TextField, SubmitButton, inputReducer, errorReducer } from './FormHelpers'
import Link from 'next/link'
import useUser from '../data/useUser'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const displayInfo = 'Your Display Name is what other people see when you post or repost tracks, ' +
    'and also what appears in your public URL'

const initialInput = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

function Register({ callback }) {
    const [input, inputDispatch] = useReducer(inputReducer, initialInput)
    const { mutate } = useUser()
    const { displayName, email, password, confirmPassword } = input
    
    const [errors, errorDispatch] = useReducer(errorReducer, {})
    const validations = {
        displayName: value => {
            return value.length < 3 ? ['Minimum Length: 3'] : []
        },

        email: value => {
            return !emailRegex.test(value) ? ['Invalid Email Address'] : []
        },

        password: value => {
            return value.length < 8 ? ['Minimum Length: 8'] : []
        },

        confirmPassword: value => {
            return password && password !== value ? ["Passwords don't match"] : []
        }
    }

    function validateInput(){
        return Object.entries(validations).every(([field, validation]) => {
            return validation(input[field]).length === 0
        })
    }

    const syncErrors = field => newValue => {
        const newErrors = validations[field](newValue)
        errorDispatch({fieldError: { [field]: newErrors }})
        return newErrors.length > 0
    }

    async function handleSubmit(e){
        e.preventDefault()
        register(input)
            .then(() => {
                callback()
            })
            .catch(err => {
                const inputError = err.info
                inputError.displayName = inputError.display_name
                errorDispatch({inputError})
            })
    }

    return (
        <form id='register' className='flex flex-col items-center px-8 py-4 bg-white rounded-xl' onSubmit={handleSubmit}>
            <h1 className='text-3xl py-4 font-medium'>Join Noisepuff</h1>
            <TextField type='text' name='displayName' label='Display Name'
                value={displayName} inputDispatch={inputDispatch} 
                errors={errors.displayName} syncErrors={syncErrors('displayName')}
                info={displayInfo} autoComplete="username"/>
            <TextField type='text' name='email' label='Email'
                value={email} inputDispatch={inputDispatch}
                errors={errors.email} syncErrors={syncErrors('email')}
                autoComplete="email"/>
            <TextField type='password' name='password' label='Password'
                value={password} inputDispatch={inputDispatch} 
                errors={errors.password} syncErrors={syncErrors('password')}
                autoComplete="new-password"/>
            <TextField type='password' name='confirmPassword' label='Confirm Password'
                value={confirmPassword} inputDispatch={inputDispatch} 
                errors={errors.confirmPassword} syncErrors={syncErrors('confirmPassword')}
                autoComplete="new-password"/>
            <SubmitButton disabled={!validateInput()} value='Sign Up' />
            <span className='text-sm pt-6 text-center'>Already have an account?
                <Link href='/login'>
                    <a className='px-3 hover:underline focus:underline focus:outline-none font-bold whitespace-nowrap'>Log In</a>
                </Link>
            </span>
        </form>
    )
}

export default Register