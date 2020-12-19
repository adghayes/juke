import { login } from '../lib/auth'
import { useState, useEffect } from 'react'
import useUser from '../data/useUser'
import Router from 'next/router'
import Link from 'next/link'

const inputClass = 'pl-1 mt-2 pb-0.5 pt-1 border-b-2 border-gray-300 mb-2 text-sm focus:border-black hover:border-black w-56'
const labelClass = 'flex flex-col text-sm py-3 font-medium'
const submitClass = "rounded bg-purple-500 text-white px-8 py-2 whitespace-nowrap w-min mx-auto"
const formClass = "absolute left-1/2 top-1/4 transform -translate-x-1/2 bg-white rounded border-2 border-black flex flex-col px-8 py-4"
const errorClass = "text-red-700 font-medium text-xs whitespace-wrap w-56"

function Login(props) {
    const { user } = useUser();
    useEffect(() => {
      if (user) {
        Router.replace("/");
      }
    }, [user]);

    const [error, setError] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(e){
        e.preventDefault()
        login(email, password)
            .then(user => {
                Router.replace('/')
            })
            .catch(err => {
                setError(true)
            })
    }
    return (
        <form className={formClass} onSubmit={handleSubmit}>
            {error ? 
                <strong className={errorClass}> 
                    We don't recognize that combination of email and password :(
                </strong> 
            : null }
          <label htmlFor="email" className={labelClass}>Email
            <input id="email" type="text" value={email} className={inputClass}
                onChange={e => setEmail(e.target.value)}/>
          </label>
          <label htmlFor="password" className={labelClass}>Password
            <input id="password" type="password" value={password} className={inputClass}
                onChange={e => setPassword(e.target.value)}/>
          </label>
          <input type="submit" className={submitClass} value="Log In"/>
          <span className="text-sm pt-6 text-center">No Account?
              <Link href='/register'>
                  <a className="px-3 underline hover:font-bold">Sign Up</a>
              </Link>
          </span>
        </form>
    )
}

export default Login