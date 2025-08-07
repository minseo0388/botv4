const { Client } = require('@harmonyland/harmony')
const { resolve: path } = require('path')
const { existsSync: exists, readdir } = require('fs')
const { initializeLogChannels } = require('../utils/logging')

class mClient extends Client {
  constructor () {
    super({
      intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'DIRECT_MESSAGES',
        'GUILD_VOICE_STATES',
        'GUILD_MEMBERS'
      ]
    })
    this.settings = { exist: exists(path() + '/settings.json') }
    if (this.settings.exist) this.settings = require(path() + '/settings.json')
    else this.settings = { token: process.env.naesungToken, prefix: process.env.naesungPrefix }

    if (!this.settings.prefix) this.settings.prefix = 'n4'

    // Initialize music queue and other features
    this.musicQueue = new Map()
    this.afkUsers = new Map()
    this.reminders = new Map()
    this.timers = new Map()
    this.stopwatches = new Map()
    this.ddays = new Map()
    this.logChannels = new Map() // Guild ID -> Channel ID for logging

    // Initialize log channels from saved data
    initializeLogChannels(this)

    this.connect(this.settings.token)

    const cmdRoot = path() + '/commands/'
    this.commands = []
    readdir(cmdRoot, (err, files) => {
      if (err) console.log(err)
      files.forEach((f) => {
        f = f.replace('.js', '')
        f = require(cmdRoot + f)
        this.commands.push(f)
      })
    })
  }

  regEvent (type, cb) {
    // eslint-disable-next-line standard/no-callback-literal
    this.on(type, (...args) => cb(this, ...args))
  }
}

module.exports = mClient
