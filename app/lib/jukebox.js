import {Howl, Howler} from 'howler'
import API from './api'

export default class Jukebox {
    constructor({sound, track, mutateJukebox, playing, queue}){
        this.sound = sound
        this.track = track
        this.mutateJukebox = mutateJukebox
        this.playing = playing
        this.queue = queue
    }

    dispatch(){
        this.mutateJukebox(new Jukebox({...this}))
    }

    play(track, queue){
        if(!track && !this.track) throw new Error('play what track?')

        if(track && (!this.track || track.id !== this.track.id)){
            if(this.playing) this.sound.pause()

            this.sound = new Howl({
                src: track.src.map(path => API.url(path)),
                html5: true,
                onend: () => {
                    this.stepForward.bind(this)()
                }
            })
            this.track = track
            if(queue) this.queue = queue
        } 

        this.sound.play()
        this.playing = true
        this.dispatch()
    }

    pause(){
        if (this.playing){
            this.sound.pause()
            this.playing = false
            this.dispatch()
        } 
    }

    currentIndex(){
        return this.queue.tracks.findIndex(track => track.id === this.track.id)
    }

    stepBack(){
        if(!this.track || !this.queue) return

        const previousTrack = this.queue.tracks[this.currentIndex() - 1]
        if(this.seek() > 10){
            this.seek(0)
        } else if(previousTrack){
            this.play(previousTrack)
        } else {
            this.seek(0)
            this.pause()
        }
    }

    stepForward(){
        if(!this.track || !this.queue) return

        const nextTrack = this.queue.tracks[this.currentIndex() + 1]
        if(nextTrack){
            this.play(nextTrack)
        } else {
            this.pause()
        }
    }

    seek(val){
        if(this.sound){
            if(val !== undefined){ 
                let newPosition = this.sound.seek(val * this.track.duration)
                if (!this.playing) this.dispatch()
                return newPosition
            } else {
                return this.sound.seek()
            }
        } 
        return 0
    }

    volume(level){
        Howler.volume(level)
    }

    composeDuration(seconds){
        let hours, minutes
        if (seconds > 3600){
            hours = Math.floor(seconds / 3600)
            seconds = seconds % 3600
        }
        minutes = Math.floor(seconds / 60)
        seconds = Math.floor(seconds % 60)

        return (hours ? hours.toString() + ':' : '') + minutes.toString() + ':' + seconds.toString().padStart(2, '0')
    }

    readableDuration(){
        return this.composeDuration(this.track.duration)
    }
}