module.exports.aliases = ['mute', 'm']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ')
  const tomute = await msg.guild.members.get(msg.mentions.users.array()[0]?.id || args[1])
  if (!tomute) return msg.reply('Cannot find a user.')
  if (tomute.permissions.has('MANAGE_MESSAGES')) return msg.reply('You have no permission!')
  let muterole = await msg.guild.roles.find(role => role.name === 'muted')
  if (!muterole) {
    muterole = await msg.guild.roles.create({
      name: 'muted',
      color: '#000000',
      permissions: []
    })
    msg.guild.channels.array().forEach(async (channel) => {
      await channel.editOverrides(muterole.id, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      })
    })
  }
  await tomute.addRole(muterole.id)
  msg.reply(`Muted <@${tomute.id}>`)
}
