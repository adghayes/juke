import { Howl, Howler } from "howler";
import API from "./api";
import { listen } from "./api-track";

const formats = ["webm", "ogg", "m4a", "aac", "mp3", "mp4"];

export default class Jukebox {
  constructor() {
    this.navigationHistory = [];
    this.repeat = "none";
  }

  dispatch() {
    this.setJuke((juke) => ({ ...juke, id: juke.id + 1 }));
  }

  src(track) {
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

  set(track) {
    if (!track) throw new Error("won't set track to falsy value");

    if (!this.track || track.id !== this.track.id) {
      this._pausePlayback();

      this.sound = new Howl({
        src: this.src(track),
        html5: true,
        onend: () => {
          this.stepForward.bind(this)();
        },
      });
      this.track = track;
      const listenedMark = Math.min(5000, (this.track.duration / 2) * 1000);
      this.timer = new Timer(listenedMark, () => {
        listen(track);
      });

      this.navigationHistory.push(track.id);

      this._ensureNext();
    }
  }

  async _ensureNext() {
    const nextTrack = this.queue && this.queue.tracks[this._currentIndex() + 1];
    if (!nextTrack && this.queue && this.queue.pushNext) {
      this.queue = await this.queue.pushNext();
    }
  }

  play(track, queue) {
    if (!track && !this.track) throw new Error("play what track?");

    if (queue) this.queue = queue;
    if (track) this.set(track);

    this.sound.play();
    this.timer.start();
    this.playing = true;
    this.dispatch();
  }

  _pausePlayback() {
    if (this.sound) this.sound.pause();
    if (this.timer) this.timer.stop();
  }

  pause() {
    this._pausePlayback();
    this.playing = false;
    this.dispatch();
  }

  toggle(track, queue) {
    if (!this.track || track.id !== this.track.id || !this.playing) {
      this.play(track, queue);
    } else {
      this.pause();
    }
  }

  _stepTo(track) {
    this.set(track);
    this.playing ? this.play() : this.dispatch();
  }

  _currentIndex() {
    return this.queue.tracks.findIndex((track) => track.id === this.track.id);
  }

  repeatMode() {
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
    this.dispatch();
  }

  stepBack() {
    if (!this.queue) return;

    const previousTrack = this.queue.tracks[this._currentIndex() - 1];
    if (this.seek() > 10) {
      this.play(this.track);
    } else if (previousTrack) {
      this._stepTo(previousTrack);
    } else {
      this.seek(0);
      this.pause();
    }
  }

  stepForward() {
    if (!this.track) return;

    if (this.repeat === "track") {
      this.seek(0);
      if (this.playing) this.play();
    } else {
      if (!this.queue) return;

      const nextTrack = this.queue.tracks[this._currentIndex() + 1];

      if (nextTrack) {
        this._stepTo(nextTrack);
      } else if (this.repeat === "queue") {
        this._stepTo(this.queue.tracks[0]);
      } else {
        this.pause();
      }
    }
  }

  seek(val) {
    if (this.sound) {
      if (val !== undefined) {
        let newPosition = this.sound.seek(val * this.track.duration);
        if (!this.playing) this.dispatch();
        return newPosition;
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
