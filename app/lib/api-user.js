import API from './api'
import { hasToken, clearToken } from './auth'
import { mutate } from 'swr'

export async function userFetcher(key){
    if(!hasToken()){
        throw new Error('no session')
    }

    const res = await fetch(API.url(key), {
        headers: {
            ...API.authHeader()
        }
    })

    switch(res.status) {
        case 200:
            return res.json()
        case 401:
            clearToken()
            throw new Error('invalid session')
        default:
            const error = new Error('unexpected error')
            error.status = res.status
            throw error
    }
}


export async function patchUser(payload){
    return fetch(API.url('user'), {
        method: 'PATCH',
        body: JSON.stringify({ user }),
        headers: {
            ...API.authHeader(),
            ...API.contentHeader
        }
    })
    .then(response => response.json())
    .then(user => {
        mutate('user', user, true)
    })
}