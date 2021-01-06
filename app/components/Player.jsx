
import { useContext, useEffect, useState, useRef, useMemo } from 'react'
import { JukeboxContext, WindowContext } from '../pages/_app'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faHeart } from '@fortawesome/free-solid-svg-icons'
import { getThumbnail } from '../lib/thumbnails'

function Player({ track }){
    const jukebox = useContext(JukeboxContext)
    const innerWidth = useContext(WindowContext)

    const [liked, setLiked] = useState(false)
    const barCount = useMemo(() => calculateBarCount(innerWidth), [innerWidth])

    let active = jukebox.track && jukebox.track.id === track.id
    let playing = active && jukebox.playing

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
        setLiked(status => !status)
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
                    barWidth={2} barSpacing={1} barCount={barCount}
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

const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
const frameInterval = 12

const playedColor = [219, 39, 119, 1]
const selectedColor = [131, 24, 67, 1]
const unplayedColor = [107, 114, 128, 1]
const inactiveColor = [107, 114, 128, 0.8]

function Waves({ track, active, upperBarMaxHeight, upperBarMinHeight, lowerBarMaxHeight, lowerBarMinHeight, barWidth, barSpacing, barCount }){
    const jukebox = useContext(JukeboxContext)

    const canvasElement = useRef(null)
    const [ctx, setCtx] = useState(null)
    const peaks = useMemo(() => track && track.peaks.split('').map(char => base64.indexOf(char)), [track])
    const bars = useMemo(calculateBars, [peaks, barCount])

    const [hover, setHover] = useState(false)
    const [playTime, setPlayTime] = useState(0)
    const hoverPosition = useRef(null)
    const playPosition = useRef(0)
    const animationId = useRef(null)
    const frameIndex = useRef(0)

    const height = lowerBarMaxHeight + upperBarMaxHeight + 1
    const width = barCount * 3
    const lowerBarScale = (lowerBarMaxHeight - lowerBarMinHeight) / 63
    const upperBarScale = (upperBarMaxHeight - upperBarMinHeight) / 63
    const barOffset = barWidth + barSpacing

    function calculateBars(){
        const step = peaks.length / barCount
        let i = 0
        const bars = []
        while (i < barCount){
            let slice = peaks.slice(Math.floor(step * i), Math.floor(step * (i + 1)))
            bars.push(slice.reduce((acc, el) => acc + el) / slice.length)
            i += 1
        }
        return bars
    }

    useEffect(() => {
        setCtx(canvasElement.current.getContext('2d'))
    }, [])

    useEffect(() => {
        if(ctx && bars){
            if(active && (hover || jukebox.playing)){
                animationId.current = window.requestAnimationFrame(animationStep)
            } else {
                refresh()
            }
        }

        return () => {
            cancelAnimationFrame(animationId.current)
        }
    }, [ctx, bars, hover, active, jukebox, jukebox.playing, active])

    function syncSeek(){
        playPosition.current = jukebox.seek()
        setPlayTime(Math.floor(playPosition.current))
    }

    function refresh(){
        syncSeek()
        draw()
    }

    function animationStep() {
        if(frameIndex.current === 0 || hover){
            refresh()
        }
        animationId.current = window.requestAnimationFrame(animationStep)
        frameIndex.current = (frameIndex.current + 1) % frameInterval
    }

    function drawBar(y, index, color){
        ctx.fillStyle = rgba(color)
        ctx.fillRect(barOffset * index, upperBarMaxHeight, barWidth, -(upperBarMinHeight + upperBarScale * y))
        ctx.fillStyle = rgba(color, 0.4)
        ctx.fillRect(barOffset * index, upperBarMaxHeight + 1, barWidth, lowerBarMinHeight + lowerBarScale * y)
    }

    function drawBars(colors, breakpoints){ 
        let barIndex = 0
        let colorIndex = 0
        
        while (barIndex < barCount){
            if(barIndex >= breakpoints[colorIndex]) colorIndex += 1
            drawBar(bars[barIndex], barIndex, colors[colorIndex])
            barIndex += 1
        }
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
        <div className="relative hidden sm:block">
            <span className={`z-10 text-xs bg-gray-800 text-white text-bold px-0.5 absolute left-0 top-7`}>
                {active && jukebox.composeDuration(playTime)}
            </span>
            <canvas 
                className="waves cursor-pointer" 
                height={height} 
                width={width}
                ref={canvasElement}
                onMouseEnter={() => setHover(true)}
                onMouseMove={(e) => hoverPosition.current = getRatio(e)}
                onMouseLeave={() => {
                    setHover(false)
                    hoverPosition.current = null
                }}
                onClick={onClick}
            />
            <span className="z-10 text-xs bg-gray-800 text-white text-bold px-0.5 absolute right-0 top-7">
                {track && jukebox.composeDuration(track.duration)}
            </span>
        </div>
    )
}

function normalize(num){
    return Math.max(Math.min(num, 1), 0)
}

function rgba(color, alpha){
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha ? alpha : color[3]})`
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
