import { inputReducer } from './FormHelpers'
import { SubmitButton } from './FormHelpers'
import Bio from './Bio'
import Thumbnailer from './Thumbnailer'

import Router from 'next/router'
import useUser from '../data/useUser'
import { useEffect, useReducer } from 'react'

import Uploader from '../lib/uploader'
import patchUser from '../lib/patchUser'
const defaultThumbnail = "/thumbnail.jpg"

function CompleteProfile({ callback }){
    const { user, loading, loggedOut } = useUser()

    const [input, inputDispatch] = useReducer(inputReducer, {
        bio: '',
        thumbnail: null
    })

    useEffect(() => {
        if(user && user.bio){
            inputDispatch({field: 'bio', value: user.bio})
        }

        if(loggedOut){
            Router.replace('/')
        }
    }, [user, loggedOut])

    async function onSubmit(e){
        e.preventDefault()
        if(!input.bio && !input.thumbnail){
            return callback()
        }

        const payload = { bio: input.bio }
        if(input.thumbnail){
            const avatarUpload = new Uploader(input.thumbnail, e => {
                console.log(e.loaded / e.total)
            })
            const blob_id = await avatarUpload.start()
            console.log(blob_id)
            payload['avatar'] = blob_id
        }
        patchUser(payload)
    }

    return (
        <form id="completeProfile" className="flex flex-col items-center px-8 py-4 bg-white rounded-xl"
            onSubmit={onSubmit}>
            <h1 className="text-3xl py-2">Spice Up Your Profile</h1>
            <div className="flex flex-col items-center space-between divide-x-8 divide-white">
                <Thumbnailer thumbnail={input.thumbnail} placeholder={defaultThumbnail} inputDispatch={inputDispatch}/>
                <Bio bio={input.bio} inputDispatch={inputDispatch} />
            </div>
            <SubmitButton disabled={false} value="Done!"/>
        </form>
    )
}

export default CompleteProfile