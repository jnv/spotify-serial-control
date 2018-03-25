'use strict'

const SerialPort = require('serialport')
const { Readline } = SerialPort.parsers

function findPort(manufacturer = 'arduino') {
  return SerialPort.list().then(ports => {
    for (const port of ports) {
      const pm = port.manufacturer
      if (pm && pm.toString().includes(manufacturer)) {
        return port.comName
      }
    }
    return Promise.reject(`Port with manufacturer '${manufacturer}' not found`)
  })
}

function listen(baudRate = 9600) {
  return findPort()
    .then(portPath => {
      return new SerialPort(portPath, { baudRate })
    })
    .then(port => {
      const parser = port.pipe(new Readline())
      //parser.on('data', console.log)
      return parser
    })
}
module.exports = { listen }
