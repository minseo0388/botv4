const { Embed } = require('@harmonyland/harmony')
const { setLogChannel, removeLogChannel } = require('../utils/logging')

module.exports.aliases = ['setlog', 'logchannel', '로그설정']
module.exports.run = async (client, msg) => {
  if (!msg.member.permissions.has('MANAGE_GUILD')) {
    return msg.reply('You need the "Manage Server" permission to set the log channel!')
  }

  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    // Show current log channel
    const logChannelId = client.logChannels.get(msg.guild.id)
    if (!logChannelId) {
      return msg.reply('No log channel is currently set for this server. Use `n4setlog #channel` to set one.')
    }
    
    const logChannel = await msg.guild.channels.get(logChannelId)
    if (!logChannel) {
      removeLogChannel(client, msg.guild.id)
      return msg.reply('The log channel was deleted. Use `n4setlog #channel` to set a new one.')
    }

    const embed = new Embed()
      .setTitle('📋 Current Log Channel')
      .setDescription(`Log channel is set to ${logChannel}`)
      .setColor('#0099ff')

    return msg.channel.send({ embeds: [embed] })
  }

  const subCommand = args[0].toLowerCase()

  if (subCommand === 'disable' || subCommand === 'off') {
    removeLogChannel(client, msg.guild.id)
    
    const embed = new Embed()
      .setTitle('✅ Logging Disabled')
      .setDescription('Message logging has been disabled for this server.')
      .setColor('#ff0000')

    return msg.channel.send({ embeds: [embed] })
  }

  // Set log channel
  let targetChannel
  const channelMention = args[0].match(/^<#(\d+)>$/)
  
  if (channelMention) {
    targetChannel = await msg.guild.channels.get(channelMention[1])
  } else if (/^\d+$/.test(args[0])) {
    targetChannel = await msg.guild.channels.get(args[0])
  } else {
    targetChannel = msg.guild.channels.cache.find(ch => ch.name.toLowerCase() === args[0].toLowerCase())
  }

  if (!targetChannel) {
    return msg.reply('Channel not found! Please mention a channel or use a valid channel ID.')
  }

  if (targetChannel.type !== 'GUILD_TEXT') {
    return msg.reply('Log channel must be a text channel!')
  }

  // Check if bot has permissions in the channel
  const botPermissions = targetChannel.permissionsFor(msg.guild.me)
  if (!botPermissions || !botPermissions.has('SEND_MESSAGES') || !botPermissions.has('EMBED_LINKS')) {
    return msg.reply('I need "Send Messages" and "Embed Links" permissions in the log channel!')
  }

  setLogChannel(client, msg.guild.id, targetChannel.id)

  const embed = new Embed()
    .setTitle('✅ Log Channel Set')
    .setDescription(`Log channel has been set to ${targetChannel}`)
    .addField('Logged Events', '• Message deletions\n• Message edits\n• Member joins/leaves (coming soon)', false)
    .setColor('#00ff00')

  msg.channel.send({ embeds: [embed] })

  // Send test message to log channel
  const testEmbed = new Embed()
    .setTitle('📋 Logging Enabled')
    .setDescription('Message logging has been enabled for this server.')
    .addField('Set by', `${msg.author.username}#${msg.author.discriminator}`, true)
    .addField('In channel', `${msg.channel}`, true)
    .setColor('#00ff00')
    .setTimestamp()

  targetChannel.send({ embeds: [testEmbed] })
}
