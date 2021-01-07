import API from './api'
import { mutate } from 'swr'

export function setToken(token){
    window.localStorage.setItem('sessionToken', token)
}

export function getToken(){
    return typeof window === 'undefined' ? null : window.localStorage.getItem('sessionToken')
}

export function hasToken(){
    return !!getToken()
}

export function clearToken(){
    window.localStorage.removeItem('sessionToken')
}

export async function login(email, password){
    const payload = { user: { email, password } }

    return fetch(API.url('session'), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: API.contentHeader
    })
    .then(res => {
        if(res.ok) return res.json()
        
        throw new Error('invalid credentials')
    })
    .then(data => {
        setToken(data.token)
        mutate('user', data.user, false)
        return data.user
    })
}

export async function logout(){
    return fetch(API.url('session'), {
        method: 'DELETE',
        headers: API.authHeader()
    }).then(res => {
        if(res.status === 200 || res.status === 401){
            clearToken()
            mutate('user', null, false)
            return res.status
        }

        const error = new Error('logout error')
        error.status = res.status
        throw error
    })
}

export async function register(user){
    const payload = {
        user: {
            email: user.email,
            display_name: user.displayName,
            password: user.password
        }
    }

    return fetch(API.url('users'), {
            method: 'POST',
            headers: API.contentHeader,
            body: JSON.stringify(payload)
        })
        .then(async res => {
            if(res.ok) return res.json()

            const error = new Error('registration failed')
            error.status = res.status
            error.info = await res.json()
            throw error
        })
        .then(data => {
            setToken(data.token)
            mutate('user', data.user, false)
            return data.user
        })
}
