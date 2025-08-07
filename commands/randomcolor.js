const { Embed } = require('@harmonyland/harmony')
module.exports.aliases = ['randomcolor', 'cr']
module.exports.run = (client, msg) => {
  const color = ((1 << 24) * Math.random() | 0).toString(16)
  const embed = new Embed()
    .setTitle(`#${color}`)
    .setColor(`#${color}`)
  msg.channel.send({ embeds: [embed] })
}
