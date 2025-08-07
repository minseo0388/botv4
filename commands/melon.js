const { Embed } = require('@harmonyland/harmony')
const melon = require('melon-chart-api')

module.exports.aliases = ['melon']

/**
 * @param {import('../classes/Client')} client
 * @param {import('@harmonyland/harmony').Message} msg
 */
module.exports.run = async (_, msg) => {
  let now = new Date()
  const embed = new Embed()
  now = (now.getMonth + 1) + '/' + now.getDate() + '/' + now.getFullYear
  const res = await melon(now, { cutLine: 9 }).daily()
  res.data.forEach(item => {
    const res1 = item.rank + ''
    const res6 = item.title + ' - ' + item.artist
    embed.addField(res1, res6, true)
  })
  msg.channel.send({ embeds: [embed] })
}
