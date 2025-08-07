const { Embed } = require('@harmonyland/harmony')

module.exports = (client, message) => {
  if (message.author?.bot || !message.guild) return

  const logChannelId = client.logChannels.get(message.guild.id)
  if (!logChannelId) return

  const logChannel = message.guild.channels.cache.get(logChannelId)
  if (!logChannel) {
    client.logChannels.delete(message.guild.id)
    return
  }

  const embed = new Embed()
    .setTitle('🗑️ Message Deleted')
    .setColor('#ff0000')
    .addField('Author', `${message.author.username}#${message.author.discriminator}`, true)
    .addField('Channel', `${message.channel}`, true)
    .addField('Message ID', message.id, true)
    .setTimestamp()

  if (message.content) {
    const content = message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content
    embed.addField('Content', content || '*No text content*', false)
  }

  if (message.attachments && message.attachments.size > 0) {
    const attachmentNames = Array.from(message.attachments.values()).map(att => att.name).join(', ')
    embed.addField('Attachments', attachmentNames, false)
  }

  if (message.embeds && message.embeds.length > 0) {
    embed.addField('Embeds', `${message.embeds.length} embed(s)`, true)
  }

  try {
    logChannel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Error sending delete log:', error)
  }
}
