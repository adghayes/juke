import API from './api'

export function getAvatar(path){
    if(path){
        return API.url(path)
    } else {
        return '/thumbnail.jpg'
    }
}

export function getThumbnail(path){
    if(path){
        return API.url(path)
    } else {
        return '/headphones.jpg'
    }
}
