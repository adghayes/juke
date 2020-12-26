import API from './api'

export async function notifyUploadStart(blobId){
    return fetch(API.url('tracks'), {
        method: 'POST',
        body: JSON.stringify({ track: {original: blobId}}),
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
        body: JSON.stringify({ track: {uploaded: true}}),
        headers: {
            ...API.authHeader(),
            ...API.contentHeader
        }
    })
    .then(response => response.json())
}