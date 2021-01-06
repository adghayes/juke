import {Howl, Howler} from 'howler'
import API from './api'

export default class Jukebox {
    constructor({sound, track, mutateJukebox, playing}){
        this.sound = sound
        this.track = track
        this.mutateJukebox = mutateJukebox
        this.playing = playing
    }

    play(track){
        if(!track && !this.track) throw new Error('play what track?')

        if(track && (!this.track || track.id !== this.track.id)){
            if(this.playing) this.sound.pause()

            this.sound = new Howl({
                src: track.src.map(path => API.url(path)),
                html5: true
            })
            this.track = track
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

    dispatch(){
        this.mutateJukebox(new Jukebox({
            sound: this.sound,
            track: this.track,
            playing: this.playing,
            mutateJukebox: this.mutateJukebox
        }))
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