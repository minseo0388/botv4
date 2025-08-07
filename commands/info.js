const { Embed } = require('@harmonyland/harmony')
module.exports.aliases = ['info', 'i']

/**
 * @param {import('../classes/Client')} client
 * @param {import('@harmonyland/harmony').Message} msg
 */
module.exports.run = (client, msg) => {
  const infoembed = new Embed()
    .setTitle('Information of Naesungbot')
    .setColor('#1e90ff')
    .addField('Date', '20200630', true)
    .addField('User', `${client.users.size}`, true)
    .addField('Server', `${client.guilds.size}`, true)
    .addField('Number of User', `${client.users.filter(a => a.bot === false).size}`, true)
    .addField('Number of Bot', `${client.users.filter(a => a.bot === true).size}`, true)
    .setTimestamp()
  msg.channel.send({ embeds: [infoembed] })
}
