import { faTshirt } from "@fortawesome/free-solid-svg-icons";
import { Howl, Howler } from "howler";
import API from "./api";
import { listen } from "./api-track";

const formats = ["webm", "ogg", "m4a", "aac", "mp3", "mp4"];

export default class Jukebox {
  constructor() {
    this.navigationHistory = [];
    this.repeat = "none";
    this.id = 0;
  }

  _dispatch() {
    this.id += 1;
    this.setJuke((juke) => ({ ...juke, id: this.id }));
    window.jukebox = this;
  }

  _src(track) {
    const options = track.src.map(API.url);
    const ordered = [];
    formats.forEach((format) => {
      options.forEach((option) => {
        if (option.endsWith(format)) {
          ordered.push(option);
        }
      });
    });
    return ordered;
  }

  _pauseSound() {
    if (this.sound) this.sound.pause();
    if (this.timer) this.timer.stop();
  }

  _load(track) {
    if (!track) throw new Error("can't load without a track");

    this._pauseSound();
    const sound = new Howl({
      src: this._src(track),
      html5: true,
    });

    sound.on("end", () => {
      if (sound === this.sound) {
        console.log("onend => onTrackEnd");
        this.onTrackEnd();
      }
    });

    this.sound = sound;
    this.track = track;

    const listenedMark = Math.min(5000, (this.track.duration / 2) * 1000);
    this.timer = new Timer(listenedMark, () => {
      listen(track);
    });

    this.navigationHistory.push(track.id);
    this._ensureNext();
  }

  async _ensureNext() {
    const nextTrack = this.queue && this.queue.tracks[this._currentIndex() + 1];
    if (!nextTrack && this.queue && this.queue.pushNext) {
      this.queue = await this.queue.pushNext();
    }
  }

  onTrackEnd() {
    if (this.repeat === "track") {
      this.seek(0);
      this.play();
    } else {
      this.stepForward();
    }
  }

  play(track, queue) {
    if (!track && !this.track) throw new Error("no track to play");
    if (track && !(this.track && this.track.id === track.id)) this._load(track);
    if (queue) this.queue = queue;

    this.sound.play();
    this.timer.start();
    this.playing = true;
    this._dispatch();
  }

  pause() {
    this._pauseSound();
    this.playing = false;
    this._dispatch();
  }

  toggle(track, queue) {
    if (!this.track || track.id !== this.track.id || !this.playing) {
      this.play(track, queue);
    } else {
      this.pause();
    }
  }

  _currentIndex() {
    return this.queue.tracks.findIndex((track) => track.id === this.track.id);
  }

  toggleRepeat() {
    switch (this.repeat) {
      case "none":
        this.repeat = "queue";
        break;
      case "queue":
        this.repeat = "track";
        break;
      case "track":
        this.repeat = "none";
    }
    this._dispatch();
    return this.repeat;
  }

  stepBack() {
    if (!this.track) return;

    if (this.queue && this.seek() < 5) {
      const previousTrack = this.queue.tracks[this._currentIndex() - 1];
      if (previousTrack) {
        this.play(previousTrack);
        return true;
      }
    }

    this.seek(0);
    return false;
  }

  stepForward() {
    if (!this.track || !this.queue) return;

    const nextTrack = this.queue.tracks[this._currentIndex() + 1];
    if (nextTrack) {
      this.play(nextTrack);
    } else if (this.repeat === "queue") {
      this.play(this.queue.tracks[0]);
    } else {
      this.pause();
      this.seek(0);
    }
  }

  seek(val) {
    if (this.sound && this.sound.duration()) {
      if (val !== undefined) {
        if (val > this.sound.duration() - 0.125) {
          console.log("onSeek => onTrackEnd");
          this.onTrackEnd();
          return 0;
        } else {
          let newPosition = this.sound.seek(Math.max(val, 0));
          if (!this.playing) this._dispatch();
          return newPosition;
        }
      } else {
        return this.sound.seek();
      }
    }
    return 0;
  }

  queueAlert(queue) {
    if (
      this.queue &&
      JSON.stringify(this.queue.key) === JSON.stringify(queue.key)
    ) {
      this.queue = queue;
    }
  }

  volume(level) {
    Howler.volume(level);
  }

  composeDuration(seconds) {
    let hours, minutes;
    if (seconds > 3600) {
      hours = Math.floor(seconds / 3600);
      seconds = seconds % 3600;
    }
    minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    return (
      (hours ? hours.toString() + ":" : "") +
      minutes.toString() +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  }

  readableDuration() {
    return this.composeDuration(this.track.duration);
  }
}

class Timer {
  constructor(time, cb) {
    this.time = time;
    this.elapsed = 0;
    this.listened = false;
    this.cb = cb;
  }

  start() {
    if (this.started) return;

    if (!this.listened) {
      this.started = Date.now();
      this.poll = setInterval(() => {
        if (this.current() > this.time) {
          this.listened = true;
          this.started = null;
          clearInterval(this.poll);
          this.cb();
        }
      }, 500);
    }
  }

  stop() {
    if (!this.started) return;

    this.elapsed += Date.now() - this.started;
    this.started = null;
    if (this.poll) clearInterval(this.poll);
  }

  current() {
    return this.elapsed + (this.started ? Date.now() - this.started : 0);
  }
}
