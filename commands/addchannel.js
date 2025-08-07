module.exports.aliases = ['addchannel', 'ac']

/**
 * @param {import('../classes/Client')} client
 * @param {import('@harmonyland/harmony').Message} msg
 */
module.exports.run = async (client, msg) => {
  if (!msg.member.permissions.has('MANAGE_CHANNELS')) {
    msg.reply('You have no permission!')
    return
  }

  const { args } = msg.query
  const channel = args.length < 1 ? 'text-channel' : args.join('-')
  const res = await msg.guild.channels.create({
    name: channel,
    type: 'GUILD_TEXT'
  })
  msg.channel.send('Created <#' + res.id + '>')
}
