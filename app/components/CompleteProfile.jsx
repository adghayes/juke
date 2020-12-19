import useUser from '../data/useUser'
import { useState } from 'react'

function CompleteProfile(){
    const [aboutMe, setAboutMe] = useState('')

    return (
        <form id="completeProfile" className="flex flex-col px-16 py-8 bg-white">
            <h1 className="text-4xl">Complete Your Profile</h1>
            <label className='flex flex-col mt-6 font-medium'>About Me
                <textarea value={aboutMe} onChange={ e => setAboutMe(e.target.value) }></textarea>
            </label>
        </form>
    )
}

export default CompleteProfile