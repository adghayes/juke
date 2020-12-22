import API from './api'
import { mutate } from 'swr'

async function patchUser(payload){
    fetch(API.BACKEND + 'user', {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
            ...API.authHeader,
            ...API.contentHeader
        }
    })
    .then(response => response.json())
    .then(user => {
        mutate('user', user, false)
    })
}

export default patchUser