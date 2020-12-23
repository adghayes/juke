import API from './api'
import { hasToken, clearToken } from './auth'

export default async function userFetcher(key){
    if(!hasToken()){
        throw new Error('no session')
    }

    const res = await fetch(API.BACKEND + '/' + key, {
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