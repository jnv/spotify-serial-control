'use strict'
const { auth } = require('./auth')
const { listen } = require('./serial')
const { Player } = require('./player')

async function run() {
  const spotify = await auth()
  console.log('Spotify initialized, starting serial port')
  const parser = await listen(115200)
  const player = Player(spotify)
  player.start()
  parser.on('data', data => {
    console.log(data)
    player.requestPlay(`${data}`.trim())
  })
}

run()
