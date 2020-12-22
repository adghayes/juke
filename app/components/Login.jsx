import { login } from '../lib/auth'
import { useState, useReducer, useLayoutEffect } from 'react'
import useUser from '../data/useUser'
import Router from 'next/router'
import Link from 'next/link'
import { TextField, SubmitButton, inputReducer } from './FormHelpers'

const initialInput = {
    email: '',
    password: '',
}

function Login(props) {
    const { user } = useUser();
    useLayoutEffect(() => {
      if (user) {
        Router.replace("/");
      }
    }, [user]);

    const [input, inputDispatch] = useReducer(inputReducer, initialInput)
    const { email, password } = input
    console.log(input)
    const [error, setError] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        login(email, password)
            .then(() => {
                Router.replace('/')
            })
            .catch(() => {
                setError(true)
            })
    }

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col items-center px-8 py-4 bg-white rounded-xl`} >
            <h1 className='text-3xl py-4 font-medium'>Log In</h1>
            {error ? 
                <strong className='text-center text-red-700 font-medium text-xs whitespace-wrap w-56 pb-2'> 
                    We don't recognize that combination of email and password...
                </strong> 
            : null }
            <TextField type='text' name='email' label='Email'
                value={email} inputDispatch={inputDispatch}/>
            <TextField type='password' name='password' label='Password'
                value={password} inputDispatch={inputDispatch}/>
            <SubmitButton disabled={false} value='Log In' />
            <span className='text-sm pt-6 text-center'>No Account?
                <Link href='/register'>
                    <a className='px-3 hover:underline focus:underline focus:outline-none font-bold whitespace-nowrap'>Sign Up</a>
                </Link>
            </span>
        </form>
    )
}

export default Login