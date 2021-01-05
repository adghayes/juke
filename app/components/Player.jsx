
import { useContext, useEffect, useState, useRef } from 'react'
import { JukeboxContext, WindowContext } from '../pages/_app'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { getAvatar, getThumbnail } from '../lib/thumbnails'

function Player({ track }){
    const jukebox = useContext(JukeboxContext)
    let active = jukebox.track && jukebox.track.id === track.id
    let playing = active && jukebox.playing


    function togglePlay(){
        if (!active || !playing) {
            jukebox.play(track)
        } else {
            jukebox.pause()
        }
    }

    return (
        
        <div className="rounded">
            <div className="flex inline-flex py-1">
                <img src={getAvatar(track.owner.avatar)} alt="Your user avatar" width='24' height='24' className="rounded-full" />
                <span className="px-3">{track.owner.display_name} posted a track</span>
            </div>
            <div className="flex flex-row items-center">
                <img src={getThumbnail(track.thumbnail)} alt={`Thumbnail for ${track.title} by ${track.owner.display_name}`} width='192' height = '192' className="rounded"/>
                <div className="flex flex-col">

                <div className="flex flex-row items-center">
                    <button 
                        className="text-white text-2xl bg-gray-700 rounded-full text-center w-10 h-10 p-2 mx-1 focus:outline-none"
                        onClick={togglePlay}
                    >
                        {playing ? 
                            <FontAwesomeIcon icon={faPause}  className="w-5 pl-1"/> : 
                            <FontAwesomeIcon icon={faPlay}  className="w-5 pl-1.5"/>}
                    </button>
                    <div className="flex flex-col items-start text-sm">
                            <span className="text-gray-800">{track.owner.display_name}</span>
                            <span className="font-bold">{track.title}</span>
                    </div>
                </div>
                    <Waves track={track} scaleY={1} active={active}/>
                </div>
            </div>
        </div>
    )
}

export default Player

const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

function Waves({ track, scaleY, active }){
    const jukebox = useContext(JukeboxContext)
    const innerWidth = useContext(WindowContext)
    const [id, setId] = useState('waves')
    const [barCount, setBarCount] = useState(0)
    const [peaks, setPeaks] = useState([])
    const [bars, setBars] = useState([])
    const canvasElement = useRef(null)
    const [hover, setHover] = useState(false)

    useEffect(() => {
        if(track) {
            setId(`waves-${track.id}`)
            setPeaks(track.peaks.split('').map(char => base64.indexOf(char)))
        }
    }, [track])

    useEffect(() => {
        console.log(innerWidth)
        let newBarCount
        if(innerWidth > 1024){
            newBarCount = 200
        } else if (innerWidth > 768) {
            newBarCount = 150
        } else if (innerWidth > 640) {
            newBarCount = 100
        } else {
            newBarCount = 50
        }
        setBarCount(newBarCount)
    }, [innerWidth])

    useEffect(() => {
        if(track && barCount){
            refreshBars()
        }
    }, [track, barCount])

    useEffect(() => {
        if(bars){
            draw()
        }
    }, [bars, hover])

    function refreshBars(){
        const step = peaks.length / barCount
        let i = 0
        const bars = []
        while (i < barCount){
            let slice = peaks.slice(Math.floor(step * i), Math.floor(step * (i + 1)))
            bars.push(Math.min(...slice))
            i += 1
        }
        setBars(bars)
    }

    function draw(){
        const canvas = document.getElementById(id)
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, 1024, 1024)
        ctx.fillStyle = `rgba(107, 114, 128, ${hover ? '1' : '0.8'})`
        bars.forEach((y, index) => {
            ctx.fillRect(3 * index, 42, 2, -(3 + y * 2 / 3))
            // ctx.fillRect(3 * index, 43, 2, y /4)
            ctx.beginPath()
            ctx.moveTo(3 * index, 43)
            ctx.lineTo(3 * index + 1, 43 + y / 3)
            ctx.lineTo(3 * index + 2, 43)
            ctx.closePath()
            ctx.fill()
        })
    }

    function onMouseEnter(e){
        setHover(true)
    }

    function onMouseLeave(e){
        setHover(false)
    }

    return (
        <canvas 
            className="waves px-1 cursor-pointer" 
            id={id} 
            height={`${64 * scaleY + 4}`} 
            width={`${barCount * 3}`} 
            ref={canvasElement}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    )

}
