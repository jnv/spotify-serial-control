'use strict'

const SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const redirectUri = 'http://localhost:8888/callback'
const scopes = [
  'playlist-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
]
const expectedState = 'done'

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri,
})

function requestAuthorizationCode() {
  let server
  const app = express()
  return new Promise((resolve, reject) => {
    app.get('/callback', (req, res) => {
      const { code, state } = req.query
      if (state !== expectedState) {
        res.send(`Error! State: ${state}`)
        return
      }
      res.send(`Done.`)
      res.end()
      server.close()
      resolve(code)
    })
    server = app.listen(8888, null, () => {
      console.log('Server listening on localhost:8888')
      console.log(
        `Visit ${spotifyApi.createAuthorizeURL(scopes, expectedState)}`
      )
    })
  })
}

/**
 * @param {string} authorizationCode
 * @returns {Promise<SpotifyWebApi>}
 */
function requestTokens(authorizationCode) {
  return spotifyApi.authorizationCodeGrant(authorizationCode).then(data => {
    const accessToken = data.body['access_token']
    const refreshToken = data.body['refresh_token']
    console.log(data.body)
    console.log('Retrieved access token', accessToken)
    spotifyApi.setAccessToken(accessToken)
    spotifyApi.setRefreshToken(refreshToken)
    return spotifyApi
  })
}

exports.auth = function() {
  return requestAuthorizationCode().then(requestTokens)
}
