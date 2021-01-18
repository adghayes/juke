# [Juke](https://juke.adghayes.vercel.app) - Soundcloud Clone

Live at https://juke-music.vercel.app/. Check it out!

## Overview

Juke is a single-page app which emulates several of Soundcloud's basic features:

- Listening Experience
  - Embedded Waveform Player
  - Global Player
  - Track Queuing
- Artists
  - Profile Creation
  - Artist Pages (Tracks, Likes, Recently Played)
- Tracks
  - Track Upload and Submission
  - Audio Processing
    - Playback: transcoding via FFmpeg
    - Waveform: server-side peak generation
- Landing and Stream Pages

## Architecture

Instead of building a React App on Rails, I chose to separate the backend and frontend: a Rails API (deployed to Heroku) and a NextJS App (deployed to Vercel). Naturally, this introduces complexity and a host of CORS issues, but in the end I think it is a more modern JAM-stack that allows taking advantage of the best of each framework.

For scalability purposes, audio analysis and conversion is not done on the application server - it is instead done through an AWS-hosted serverless function. The repository and README for the microservice is a separate project of mine, [serverless-ffmpeg](http://www.github.com/adghayes/serverless-ffmpeg).

There was an emphasis on audio processing so that Juke is able serve audio in multiple formats and be compatible with any browser, and so that the browser was not responsible for generating peaks which might interfere with rendering.

## Art Credits

Juke is seeded with music found on [Dig CC Mixter](http://dig.ccmixter.org/), processed and redistibuted (with attribution) under their Creative Commons non-commercial licenses. Avatars, thumbnails, and the splash image were found on [Unsplash](https://unsplash.com/).

## Notable Dependencies

Things that made building something "from scratch" much easier...

**Frontend NextJS App**:

- [howler.js](https://github.com/goldfire/howler.js#documentation) for audio playback
- [SWR](https://swr.vercel.app/) for data-fetching
- [tailwindcss](https://tailwindcss.com/) for styling
- [FontAwesome](https://fontawesome.com/) for icons
- react-avatar-editor, react-hook-form, react-dropzone...

**Backend Rails API** - friendly_id, rack-cors, scenic

## Future Features

With more time to dedicate to this pet project, I would build out these features first:

- Track Page
  - Enlarged Waveform Player / Visualizer
  - Comments
  - Update / Delete Capabilities
- Profile Update / Delete
- Search
- Playlists
