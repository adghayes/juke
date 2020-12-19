import API from './api'
import { mutate } from 'swr'

export function setToken(token){
    window.localStorage.setItem('sessionToken', token)
}

export function clearToken(){
    window.localStorage.removeItem('sessionToken')
}

export function getToken(){
    if(this){
        return this.localStorage.getItem('sessionToken')
    } else {
        return window.localStorage.getItem('sessionToken')
    }
}

export function hasToken(){
    return !!getToken()
}

export async function login(email, password){
    console.log('login')
    const payload = { user: { email: email, password: password } }
    console.log(JSON.stringify(payload))
    return fetch(API.BACKEND + 'session', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            ...API.contentHeader
        }
    })
    .then(res => {
        if(!res.ok) throw new Error('invalid credentials')
        return res.json()
    })
    .then(data => {
        setToken(data.token)
        mutate('user', data.user, false)
        return data.user
    })
}

export async function logout(){
    return fetch(API.BACKEND + 'session', {
        method: 'DELETE',
        headers: {
            'Authorization': `bearer ${getToken()}`
        }
    }).then(res => {
        if(res.ok){
            clearToken()
            mutate('user', null, false)
        }
        return res.ok
    })
}

export async function register(user){
    const payload = {
        email: user.email,
        display_name: user.displayName,
        password: user.password
    }

    return fetch(API.BACKEND + 'users', {
            method: 'POST',
            headers: {
                ...API.contentHeader
            },
            body: JSON.stringify(payload)
        })
        .then(async res => {
            if(res.ok){
                return res.json()
            }
            
            console.log('error on create')
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