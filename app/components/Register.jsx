import { register } from '../lib/auth'
import { useState, useReducer, useEffect } from 'react'
import Link from 'next/link'

const initialInput = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function Register({ callback }) {
    function inputReducer(state, {field, value}) {
        return {
            ...state,
            [field]: value
        }
    }    
    const [input, inputDispatch] = useReducer(inputReducer, initialInput)
    const { displayName, email, password, confirmPassword } = input
    
    function errorReducer(state, { fieldError, inputError }) {
        if (inputError) return inputError
        return {
            ...state,
            ...fieldError
        }
    }    
    const [errors, errorDispatch] = useReducer(errorReducer, {})

    function validateDisplayName() {
        const errors = []
        if (displayName.length < 3) errors.push('Minimum Length: 3')
        return errors
    }

    function validateEmail() {
        const errors = []
        if (!emailRegex.test(email)) errors.push('Invalid Email Address')
        return errors
    }

    function validatePassword() {
        const errors = []
        if (password.length < 8) errors.push('Minimum Length: 8')
        return errors
    }

    function validateConfirmPassword (){
        const errors = []
        if (password && password !== confirmPassword) errors.push("Passwords don't match")
        return errors
    }

    function validateInput(){
        return  validateDisplayName().length === 0 &&
                    validateEmail().length === 0 &&
                    validatePassword().length === 0 &&
                    validateConfirmPassword().length === 0
    }

    function handleSubmit(e){
        e.preventDefault()
        register(input)
            .then(() => {
                callback()
            })
            .catch(err => {
                console.log(err.info)
                const inputError = err.info
                inputError.displayName = inputError.display_name
                errorDispatch({inputError})
            })
    }

    return (
        <form id="register" className="flex flex-col px-16 py-8 bg-white" onSubmit={handleSubmit}>
            <h1 className="text-4xl">Join Noisepuff</h1>
            <Field type="text" name="displayName" value={displayName} label="Display Name" 
                inputDispatch={inputDispatch} errors={errors.displayName} errorDispatch={errorDispatch} validator={validateDisplayName}/>
            <Field type="text" name="email" value={email} label="Email" validator={validateEmail}
                inputDispatch={inputDispatch} errors={errors.email} errorDispatch={errorDispatch}/>
            <Field type="password" name="password" value={password} label="Password" validator={validatePassword}
                inputDispatch={inputDispatch} errors={errors.password} errorDispatch={errorDispatch}/>
            <Field type="password" name="confirmPassword" value={confirmPassword} label="Confirm Password" validator={validateConfirmPassword}
                inputDispatch={inputDispatch} errors={errors.confirmPassword} errorDispatch={errorDispatch}/>
            <input className={"rounded text-white px-8 py-2 mt-6 whitespace-nowrap w-min mx-auto" + 
                ' ' + (validateInput() ? 'bg-purple-500' : 'bg-gray-200')} 
                type="submit" value="Sign Up" disabled={!validateInput()}/>
            <span className="text-sm pt-6 text-center">Already have an account?
                <Link href='/login'>
                    <a className="px-3 hover:underline font-bold">Log In</a>
                </Link>
            </span>
        </form>
    )
}

function Field({type, name, value, label, inputDispatch, errors, errorDispatch, validator}){
    const [invalid, setInvalid] = useState(false)

    return (
        <label className='flex flex-col mt-6 font-medium'>{label}
        <input name={name} type={type} value={value}
            className='pl-1 mt-1 border-b-2 border-gray-300 focus:border-black hover:border-black w-56' 
            onChange={e => {
                inputDispatch({ field: e.target.name, value: e.target.value })
                if(validator && invalid){
                    const errors = validator(e.target.value) 
                    errorDispatch({fieldError: { [name]: errors }})
                    if (errors.length === 0) {
                        setInvalid(false)
                    }
                }
            }}
            onBlur={e => {
                if(validator){
                    const errors = validator(e.target.value) 
                    errorDispatch({fieldError: { [name]: errors }})
                    if (errors.length > 0) setInvalid(true)
                }
            }}/>
        { errors && errors.length > 0 ? <Errors messages={errors} /> : null }
        </label>
    )
}

function Errors({messages}){
    return (
        <ul className={messages.length > 1 ? 'list-disc' : ''}>
            { messages.map((message, idx) => {
                return (
                <li key={idx} className="min-height">
                    <strong className="text-red-700 font-medium text-xs whitespace-wrap">
                        {message}
                    </strong>
                </li>
            )})}
        </ul>
    )
}

export default Register