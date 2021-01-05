
import { useContext, useEffect, useState, useRef } from 'react'
import { JukeboxContext, WindowContext } from '../pages/_app'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { getAvatar, getThumbnail } from '../lib/thumbnails'

function normalize(num){
    return Math.max(Math.min(num, 1), 0)
}

function rgba(color){
    return `rgba(${color.toString()})`
}

function rgbaMidpoint(color1, color2, ratio){
    const [r1, g1, b1, a1] = color1
    const [r2, g2, b2, a2] = color2
    const r = r1 * (1 - ratio) + r2 * ratio
    const g = g1 * (1 - ratio) + g2 * ratio
    const b = b1 * (1 - ratio) + b2 * ratio
    const a = a1 * (1 - ratio) + a2 * ratio
    return [r, g, b, a]
}

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
                    <Waves track={track} scaleY={1} active={active}
                        upperBarMinHeight={2} lowerBarMinHeight={1} upperBarMaxHeight={44} lowerBarMaxHeight={22}
                    />
                </div>
            </div>
        </div>
    )
}

export default Player

const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

const playedColor = [219, 39, 119, 1]
const selectedColor = [131, 24, 67, 1]
const unplayedColor = [107, 114, 128, 1]
const inactiveColor = [107, 114, 128, 0.8]

function Waves({ track, active, upperBarMaxHeight, upperBarMinHeight, lowerBarMaxHeight, lowerBarMinHeight }){
    console.log('render')
    const jukebox = useContext(JukeboxContext)
    const innerWidth = useContext(WindowContext)

    const canvasElement = useRef(null)
    const [ctx, setCtx] = useState(null)
    
    const [peaks, setPeaks] = useState([])
    const [barCount, setBarCount] = useState(0)
    const [bars, setBars] = useState([])

    const [hover, setHover] = useState(false)
    const hoverPosition = useRef(null)
    const playPosition = useRef(0)
    const animationId = useRef(null)

    const height = lowerBarMaxHeight + upperBarMaxHeight + 1
    const width = barCount * 3

    useEffect(() => {
        setCtx(canvasElement.current.getContext('2d'))
    }, [])

    useEffect(() => {
        if(track) {
            setPeaks(track.peaks.split('').map(char => base64.indexOf(char)))
        }
    }, [track])

    useEffect(() => {
        let newBarCount
        if(innerWidth > 1024){
            newBarCount = 192
        } else if (innerWidth > 768) {
            newBarCount = 144
        } else if (innerWidth > 640) {
            newBarCount = 96
        } else {
            newBarCount = 48
        }
        setBarCount(newBarCount)
    }, [innerWidth])

    useEffect(() => {
        if(track && barCount){
            recalculateBars()
        }
    }, [track, barCount])

    useEffect(() => {
        if(ctx && bars){
            if(active && (hover || jukebox.playing)){
                animationId.current = window.requestAnimationFrame(animationStep)
            } else {
                draw()
            }
        }

        return () => {
            cancelAnimationFrame(animationId.current)
        }
    }, [active, ctx, bars, hover, jukebox.playing])

    function animationStep() {
        playPosition.current = jukebox.seek()
        draw()
        animationId.current = window.requestAnimationFrame(animationStep)
    }

    function recalculateBars(){
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

    function drawBar(y, index){
        ctx.fillRect(3 * index, upperBarMaxHeight, 2, -(upperBarMinHeight + (upperBarMaxHeight - upperBarMinHeight) * y / 63 ))
        ctx.beginPath()
        ctx.moveTo(3 * index, upperBarMaxHeight + 1)
        ctx.lineTo(3 * index + 1, upperBarMaxHeight + 1 + lowerBarMinHeight + (lowerBarMaxHeight - lowerBarMinHeight) * y / 63)
        ctx.lineTo(3 * index + 2, upperBarMaxHeight + 1)
        ctx.closePath()
        ctx.fill()
    }

    function drawBars(colors, breakpoints){ 
        let barIndex = 0
        let colorIndex = 0
        ctx.fillStyle = rgba(colors[0])
        
        while (barIndex < barCount){
            if(barIndex >= breakpoints[colorIndex]){
                colorIndex += 1
                ctx.fillStyle = rgba(colors[colorIndex])
            }
            drawBar(bars[barIndex], barIndex)
            barIndex += 1
        }
    }

    function drawTime(){
        ctx.fillStyle = rgba([0,0,0,.9])
        ctx.fillRect(0, upperBarMaxHeight, 24, -12)
        ctx.fillRect(width, upperBarMaxHeight, -24, -12)
    }


    function draw(){
        ctx.clearRect(0, 0, width, height)
        if (!active){
            drawBars([hover ? unplayedColor : inactiveColor], [barCount])
        } else {
            const currentBar = Math.floor(playPosition.current / track.duration * barCount)
            const currentBarRatio = playPosition.current / track.duration * barCount - currentBar
            let colors, breakpoints
            if(!!hoverPosition.current){
                const hoverBar = Math.round(hoverPosition.current * barCount)
                if(hoverBar < currentBar){
                    const currentBarColor = rgbaMidpoint(unplayedColor, selectedColor, currentBarRatio)
                    colors = [playedColor, selectedColor, currentBarColor, unplayedColor]
                    breakpoints = [hoverBar, currentBar, currentBar + 1, barCount]
                } else {
                    const currentBarColor = rgbaMidpoint(selectedColor, playedColor, currentBarRatio)
                    colors = [playedColor, currentBarColor, selectedColor, unplayedColor]
                    breakpoints = [currentBar, currentBar + 1, hoverBar + 1, barCount]
                }
            } else {
                const currentBarColor = rgbaMidpoint(unplayedColor, playedColor, currentBarRatio)
                colors = [playedColor, currentBarColor, unplayedColor]
                breakpoints = [currentBar, currentBar + 1, barCount]
            }
            drawBars(colors, breakpoints)
            drawTime()
        }
    }

    function getRatio(e){
        const {left, right} = canvasElement.current.getBoundingClientRect()
        const ratio = normalize((e.clientX - left) / (right - left))
        return ratio
    }

    function onClick(e){
        if(active){
            jukebox.seek(getRatio(e))
        } else {
            jukebox.play(track)
        }
    }

    return (
        <canvas 
            className="waves cursor-pointer" 
            height={height} 
            width={width}
            style={{height, width}}
            ref={canvasElement}
            onMouseEnter={() => setHover(true)}
            onMouseMove={(e) => hoverPosition.current = getRatio(e)}
            onMouseLeave={() => {
               setHover(false)
               hoverPosition.current = null
            }}
            onClick={onClick}
        />
    )

}
