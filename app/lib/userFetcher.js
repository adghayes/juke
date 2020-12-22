import API from './api'

export default async function userFetcher(key){
    const res = await fetch(API.BACKEND + key, {
        headers: {
            ...API.authHeader()
        }
    })

    if(!res.ok){
        const error = new Error('user unauthorized')
        error.status = res.status
        throw error
    }

    return res.json()
}