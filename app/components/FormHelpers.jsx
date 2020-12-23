import { useState } from 'react'

export function inputReducer(state, editedFields) {
    return {
        ...state,
        ...editedFields
    }
}

export function errorReducer(state, { fieldError, inputError }) {
    if (inputError) return inputError
    return {
        ...state,
        ...fieldError
    }
}

export function TextField({type, name, label, info, value, inputDispatch, errors, syncErrors}){
    const [strict, setStrict] = useState(false)

    return (
        <label className='flex flex-col font-medium'>
            <span className="inline-flex items-center">
                <span>{label}</span>
                { info ? <Info info={info}/> : null }
            </span>
            <input name={name} type={type} value={value}
                className={`pl-1 mt-1 border-b-2 border-gray-300 relative
                    focus:border-black hover:border-gray-500 w-56 text-sm`} 
                onChange={ e => {
                    inputDispatch({ [name]: e.target.value })
                    if(strict) setStrict(syncErrors(e.target.value))
                }}
                onBlur={ e => {
                    if(syncErrors) setStrict(syncErrors(e.target.value))
                }}/>
            <Errors messages={value && errors} /> 
        </label>
    )
}

export function Info({ info }){
    const [open, setOpen] = useState(false)

    return (
        <div className='relative flex items-center'>
            <i 
                onMouseEnter={ () => setOpen(true)}
                onMouseLeave={ () => setOpen(false)}
                className={`bg-gray-300 text-xs rounded-full text-white text-center 
                    w-min px-1.5 mx-2 hover:bg-gray-400 font-serif font-bold`}>
                {'i'}
            </i>
            <p className={`absolute text-xs z-30 left-16 -top-2 bg-white shadow-lg 
                w-48 h-max p-4 rounded-xl border-2 border-gray-300 border 
                transition transform duration-700 ease-in-out ${open ? 'opacity-100 scale-1 text-black' : 'opacity-0 scale-0 text-white -translate-x-1/2 -translate-y-1/2'}`}>
                {info}
            </p>
        </div>
    )
}

export function Errors({messages}){
    return (
        <ul className='h-8 pl-2'>
            { messages ? messages.map((message, idx) => {
                return (
                <li key={idx}>
                    <strong className='text-red-700 font-medium text-xs whitespace-wrap'>
                        {message}
                    </strong>
                </li>
            )}) : 
                <div></div>
            }
        </ul>
    )
}

export function SubmitButton({ disabled, value }){
    return (
        <input className={'text-sm text-white font-medium px-6 py-2 whitespace-nowrap w-min ' + (disabled ? 'bg-gray-200' : 
            'bg-blue-400 transition duration-300 hover:bg-blue-600 focus:bg-blue-600 hover:shadow cursor-pointer')} 
        type='submit' value={value} disabled={disabled}/>
    )
}