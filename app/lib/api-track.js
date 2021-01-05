import API from './api'

export async function postTrack(track){
    return fetch(API.url('tracks'), {
        method: 'POST',
        body: JSON.stringify({ track }),
        headers: {
            ...API.authHeader(),
            ...API.contentHeader
        }
    })
    .then(response => response.json())
}

export async function notifyUploadSuccess(trackId){
    return fetch(API.url(['tracks', trackId]), {
        method: 'PATCH',
        body: JSON.stringify({ 
            event: 'uploaded',
            track: {uploaded: true}
        }),
        headers: {
            ...API.authHeader(),
            ...API.contentHeader
        }
    })
    .then(response => response.json())
}

export async function patchTrack(payload, trackId){
    return fetch(API.url(['tracks', trackId]), {
        method: 'PATCH',
        body: JSON.stringify({ track: payload }),
        headers: {
            ...API.authHeader(),
            ...API.contentHeader
        }
    })
    .then(response => response.json())
}

export async function getTrack(trackId){
    return fetch(API.url(['tracks', trackId]), {
        headers: {
        ...API.authHeader()
    }})
    .then(response => response.json())
}