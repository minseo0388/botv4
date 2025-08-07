module.exports.aliases = ['unmute', 'um']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ')
  const tomute = await msg.guild.members.get(msg.mentions.users.array()[0]?.id || args[1])
  if (!tomute) return msg.reply('Cannot find a user.')
  if (!msg.member.permissions.has('MANAGE_MESSAGES')) return msg.reply('You have no permission!')
  
  const muterole = await msg.guild.roles.find(role => role.name === 'muted')
  if (!muterole) return msg.reply('Muted role not found. User might not be muted.')
  
  try {
    await tomute.removeRole(muterole.id)
    msg.reply(`<@${tomute.id}> has been unmuted.`)
  } catch (error) {
    msg.reply('Failed to unmute user.')
  }
}
