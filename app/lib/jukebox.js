import {Howl, Howler} from 'howler'
import API from './api'

export default class Jukebox {
    constructor({sound, track, setJukebox, playing}){
        this.sound = sound
        this.track = track
        this.setJukebox = setJukebox
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
                return this.sound.seek(val * this.track.duration)
            } else {
                return this.sound.seek()
            }
        } 
        return -1
    }

    volume(level){
        Howler.volume(level)
    }

    dispatch(){
        this.setJukebox(new Jukebox({
            sound: this.sound,
            track: this.track,
            playing: this.playing,
            setJukebox: this.setJukebox
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