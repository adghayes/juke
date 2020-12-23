import { inputReducer } from './FormHelpers'
import { SubmitButton } from './FormHelpers'
import Bio from './Bio'
import Thumbnailer from './Thumbnailer'

import Router from 'next/router'
import useUser from '../data/useUser'
import { useEffect, useReducer } from 'react'

import Uploader from '../lib/uploader'
import patchUser from '../lib/patchUser'
import API from '../lib/api'

const thumbnailInfo = 'Your thumbnail is what people see on your profile page, when you post ' +
    "tracks without their own thumbnail, or when you comment on other artist's tracks"

function CompleteProfile({ callback }){
    const { user, loggedOut, loading } = useUser()

    const [input, inputDispatch] = useReducer(inputReducer, {
        bio: '',
        thumbnail: null
    })
    
    useEffect(() => {
        if (user && user.bio){
            inputDispatch({bio: user.bio})
        } else if(loggedOut){
            Router.replace('/')
        } 
    }, [loggedOut, user])
    if(loggedOut) return 'redirecting...'
    if(loading) return (
        <p className="font-bold text-lg">loading...</p>
    )

    async function onSubmit(e){
        e.preventDefault()
        if(!input.bio && !input.thumbnail){
            return callback()
        }

        const payload = { bio: input.bio }
        if(input.thumbnail){
            const avatarUpload = new Uploader(input.thumbnail, e => {
                console.log('progress ' + e.loaded / e.total)
            })
            payload.avatar = await avatarUpload.start()
        }
        patchUser(payload)
        if(callback) callback()
    }

    return (
        <form id="completeProfile" className="flex flex-col items-center px-8 py-4 bg-white rounded-xl"
            onSubmit={onSubmit}>
            <h1 className="text-3xl py-2">Complete Profile</h1>
            <div className="flex flex-col items-center space-between divide-x-8 divide-white">
                <Thumbnailer 
                    thumbnail={input.thumbnail} 
                    placeholder={API.avatar(user.avatar)} 
                    inputDispatch={inputDispatch}
                    info={thumbnailInfo}
                    />
                <Bio 
                    bio={input.bio} 
                    inputDispatch={inputDispatch} 
                    />
            </div>
            <SubmitButton disabled={false} value="Done!"/>
        </form>
    )
}

export default CompleteProfile