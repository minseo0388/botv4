module.exports.aliases = ['ping', '핑']
module.exports.run = (client, msg) => {
  msg.reply(':ping_pong:' + Math.round(client.gateway.ping) + 'ms')
}
