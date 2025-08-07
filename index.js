const Client = require('./classes/Client')
const onReady = require('./events/onReady')
const onMessage = require('./events/onMessage')
const onMessageDelete = require('./events/onMessageDelete')
const onMessageUpdate = require('./events/onMessageUpdate')

const client = new Client()

client.regEvent('ready', onReady)
client.regEvent('messageCreate', onMessage)
client.regEvent('messageDelete', onMessageDelete)
client.regEvent('messageUpdate', onMessageUpdate)
