
import { useContext, useMemo } from 'react'

import { JukeboxContext, WindowContext } from '../pages/_app'
import useUser from '../data/useUser'
import { getThumbnail } from '../lib/thumbnails'
import { like, unlike } from '../lib/api-track'

import Waves from './Waves'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faHeart } from '@fortawesome/free-solid-svg-icons'

function Player({ track }){
    const jukebox = useContext(JukeboxContext)
    const innerWidth = useContext(WindowContext)
    const { user, loggedOut } = useUser()

    const barCount = useMemo(() => calculateBarCount(innerWidth), [innerWidth])

    let active = jukebox.track && jukebox.track.id === track.id
    let playing = active && jukebox.playing
    let liked  = !!user && !!track && user.likes.includes(track.id) 

    function calculateBarCount(innerWidth){
        if (innerWidth > 1024) { return 192 } else 
        if (innerWidth > 768) { return 144 } else 
        if (innerWidth > 640) { return 96} else 
        if (innerWidth > 480) { return 48 } else
            { return 48 }
    }

    function togglePlay(){
        if (!active || !playing) {
            jukebox.play(track)
        } else {
            jukebox.pause()
        }
    }

    function toggleLiked(){
        if (loggedOut) console.log('logged out')
        
        if(liked){
            unlike(user, track.id)
        } else {
            like(user, track.id)
        }
    }

    return (
        <div className="rounded-xl flex flex-col sm:flex-row items-center border border-gray-300 overflow-hidden relative">
            <img src={getThumbnail(track.thumbnail)} alt={`Thumbnail for ${track.title} by ${track.owner.display_name}`} className="w-48 h-48"/>
            <div className="flex flex-col px-4 w-full my-1">

                <div className="flex items-center divide-white flex-col sm:flex-row my-1">
                    <button 
                        className="text-white bg-gray-700 rounded-full w-14 h-14 flex items-center justify-center absolute top-16 sm:static"
                        onClick={togglePlay}
                    >
                        {playing ? 
                            <FontAwesomeIcon icon={faPause}  className="w-6"/> : 
                            <FontAwesomeIcon icon={faPlay}  className="w-7 pl-1"/>}
                    </button>
                    <div className="flex flex-col sm:flex-col-reverse text-sm self-start sm:text-base  sm:my-0 sm:mx-2 sm:self-auto">
                        <span className="inline-flex font-bold">
                            <button onClick={toggleLiked}>
                                <FontAwesomeIcon icon={faHeart} 
                                    className={`mr-2 w-4 sm:hidden ${liked ? 'text-pink-500' : 'text-gray-300'}`}/>
                            </button>
                            <span>{track.title}</span>
                        </span>
                        <span className="text-gray-700">{track.owner.display_name}</span>
                    </div>
                </div>
                {barCount ? 
                <Waves track={track} scaleY={1} active={active}
                    upperBarMinHeight={2} lowerBarMinHeight={1} upperBarMaxHeight={44} lowerBarMaxHeight={22}
                    barWidth={2} barSpacing={1} barCount={barCount} lowerBarAlpha={0.4}
                /> 
                : null }
                <div className="hidden sm:flex flex-row text-xs self-start">
                        <button type="button" onClick={toggleLiked}
                            className="py-0.5 px-1.5 border border-gray-200 rounded flex flex-row items-center justify-center divide-x-8 divide-white m-1"
                            >
                            <FontAwesomeIcon icon={faHeart}  className={`w-4 ${liked ? 'text-pink-500' : 'text-gray-300'}`}/>
                            <span className="">12</span>
                        </button>
                        <span className="py-0.5 px-1.5  rounded flex flex-row items-center justify-center divide-x-8 divide-white m-1">
                            <FontAwesomeIcon icon={faPlay}  className={`w-3 text-gray-300`}/>
                            <span className="">12</span>
                        </span>
                    </div>
            </div>
        </div>
    )
}

export default Player
