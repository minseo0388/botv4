const { Embed } = require('@harmonyland/harmony')
module.exports.aliases = ['unban', 'ub']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ')
  if (!msg.member.permissions.has('BAN_MEMBERS')) {
    msg.reply('You have no permission!')
    return
  }
  if (args[1] === 'help') {
    msg.reply(`${client.settings.prefix}unban <user_id> <reason>`)
    return
  }
  const userID = args[1]
  if (!userID) return msg.channel.send('Please provide a user ID to unban')
  
  const unbReason = args.slice(2).join(' ') || 'No reason provided'
  
  try {
    await msg.guild.unban(userID, unbReason)
    const unbanEmbed = new Embed()
      .setDescription('Unban')
      .setColor('#00ff00')
      .addField('Unbanned User ID', userID)
      .addField('Unbanned by', `<@${msg.author.id}>, ID: ${msg.author.id}`)
      .addField('Time', msg.createdAt)
      .addField('Reason', unbReason)
    msg.channel.send({ embeds: [unbanEmbed] })
  } catch (error) {
    msg.channel.send('Failed to unban user. Please check if the user ID is valid and banned.')
  }
}
