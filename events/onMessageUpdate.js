const { Embed } = require('@harmonyland/harmony')

module.exports = (client, oldMessage, newMessage) => {
  if (oldMessage.author?.bot || !oldMessage.guild) return
  if (oldMessage.content === newMessage.content) return // No content change

  const logChannelId = client.logChannels.get(oldMessage.guild.id)
  if (!logChannelId) return

  const logChannel = oldMessage.guild.channels.cache.get(logChannelId)
  if (!logChannel) {
    client.logChannels.delete(oldMessage.guild.id)
    return
  }

  const embed = new Embed()
    .setTitle('✏️ Message Edited')
    .setColor('#ffaa00')
    .addField('Author', `${oldMessage.author.username}#${oldMessage.author.discriminator}`, true)
    .addField('Channel', `${oldMessage.channel}`, true)
    .addField('Message ID', oldMessage.id, true)
    .setTimestamp()

  if (oldMessage.content || newMessage.content) {
    const oldContent = oldMessage.content || '*No text content*'
    const newContent = newMessage.content || '*No text content*'
    
    const truncatedOld = oldContent.length > 500 ? oldContent.substring(0, 497) + '...' : oldContent
    const truncatedNew = newContent.length > 500 ? newContent.substring(0, 497) + '...' : newContent
    
    embed.addField('Before', truncatedOld, false)
    embed.addField('After', truncatedNew, false)
  }

  embed.addField('Jump to Message', `[Click here](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`, false)

  try {
    logChannel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Error sending edit log:', error)
  }
}
