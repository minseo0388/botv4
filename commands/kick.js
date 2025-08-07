const { Embed } = require('@harmonyland/harmony')
module.exports.aliases = ['kick', 'k']

/**
 * @param {import('../classes/Client')} client
 * @param {import('@harmonyland/harmony').Message} msg
 */
module.exports.run = async (client, msg) => {
  const { args } = msg.query
  if (!msg.member.permissions.has('KICK_MEMBERS')) return msg.reply('You have no permission!')
  if (args.length < 2 || args[0] === 'help') return msg.reply(`${client.settings.prefix}kick @mention reason`)

  const kUser = await msg.guild.members.get(msg.mentions.users.array()[0]?.id || args[0])
  if (!kUser) return msg.channel.send('User not found')
  if (kUser.id === client.user.id) return msg.send('cannot kick myself')

  const bReason = args.slice(1).join(' ')
  const kickEmbed = new Embed()
    .setDescription('kick')
    .setColor(0xff0000)
    .addField('Kick User', `${kUser}, ID: ${kUser.id}`)
    .addField('Kicked User', `<@${msg.author.id}>, ID: ${msg.author.id}`)
    .addField('Kicked Channel', msg.channel)
    .addField('Time', msg.createdAt)
    .addField('Reason', bReason)

  await msg.guild.kick(kUser.id, bReason)
  msg.channel.send({ embeds: [kickEmbed] })
}
