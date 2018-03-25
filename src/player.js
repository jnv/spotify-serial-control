'use strict'

const PLAYLISTS = {
  1: 'spotify:user:1171695759:playlist:60aH1na1UzvCXhWYB3sm4h',
  2: 'spotify:user:1171695759:playlist:60aH1na1UzvCXhWYB3sm4h',
  3: 'spotify:user:1171695759:playlist:5VU5WJFyWytQBRrzPaEv0a',
  4: 'spotify:user:william99mustang:playlist:4PoMTOcQlmhU8eo4U4ogr5',
  5: 'spotify:user:1171695759:playlist:4hjhykSQfF6lDre2a2RwAs',
}

/**
 * @param {SpotifyWebApi} spotify
 */
function Player(spotify) {
  let nextPlayCb
  const validPlaylists = new Set(Object.keys(PLAYLISTS))

  function isValidPlaylist(playlist) {
    return validPlaylists.has(playlist)
  }

  function getPlaybackState() {
    return spotify.getMyCurrentPlaybackState().then(data => {
      const { body } = data
      const timestamp = body.timestamp
      const isPlaying = body.is_playing
      let context, remaining

      if (isPlaying) {
        context = body.context.uri
        const progress = body.progress_ms
        const duration = body.item.duration_ms
        remaining = duration - progress
      }
      //console.log(isPlaying, context, remaining)
      return { isPlaying, context, remaining }
    })
  }

  function makePlayCb(context) {
    return () => {
      spotify.play({ context_uri: context }).catch(err => {
        console.log('Error in playCb', err)
      })
    }
  }

  function cancelPlayCb() {
    if (nextPlayCb) {
      clearTimeout(nextPlayCb)
      nextPlayCb = null
    }
  }

  async function enqueuePlay(newContext) {
    const { isPlaying, context, remaining } = await getPlaybackState()
    if (!isPlaying) {
      console.log('Starting playback now')
      process.nextTick(makePlayCb(newContext))
      return
    }
    if (context !== newContext) {
      console.log(`Scheduling next playback in ${remaining} ms`)
      cancelPlayCb()
      nextPlayCb = setTimeout(makePlayCb(newContext), remaining)
    }
  }

  return {
    start() {},
    requestPlay(playlist) {
      if (!isValidPlaylist(playlist)) {
        console.log(`Ignoring unknown playlist: ${playlist}`)
        return
      }
      const context = PLAYLISTS[playlist]
      enqueuePlay(context)
    },
  }
}

module.exports = { Player }
