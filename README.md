# Spotify Serial Control

> Control Spotify playback by reading serial port

Quick and dirty application to play Spotify playlists according to data read from serial port from Arduino.

## Setup

1. Run `npm install`
1. Setup application at [Spotify for Developers](https://developer.spotify.com/)
1. Copy [`.env.example`](.env.example) file to `.env` and change CLIENT_ID and CLIENT_SECRET to match your application
1. Run `npm start`

## Usage

- Upon start, navigate to the URL printed to console and authorise application for your account.
- The application looks for serial port with manifacturer containing string `arduino` (you can change this in [src/serial.js](src/serial.js) file).
- From Arduino, write line matching the key of `PLAYLISTS` variable in [src/player.js](src/player.js), other strings will be ignored.
- Application will start playing new playlist once the current song finishes, or start playing the playlist immediately when the playback is stopped.

## License

[![CC0 Public Domain](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)