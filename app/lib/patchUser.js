import API from './api'
import { mutate } from 'swr'

async function patchUser(payload){
    return fetch(API.url('user'), {
        method: 'PATCH',
        body: JSON.stringify(payload),
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

export default patchUser