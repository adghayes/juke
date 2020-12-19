import API from './api'
import { hasToken, clearToken } from './auth'

export default async function userFetcher(key){
    if(!hasToken()) {
        return null
    }

    const res = await fetch(API.BACKEND + key, {
        headers: {
            ...API.authHeader()
        }
    })

    if(!res.ok){
        if(res.status === 401){
            clearToken()
        }
        const error = new Error('error fetching data')
        error.info = await res.json()
        error.status = res.status
        throw error
    }

    return res.json()
}