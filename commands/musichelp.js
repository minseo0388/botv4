const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['musichelp', 'mhelp', '음악도움말']
module.exports.run = async (client, msg) => {
  const embed = new Embed()
    .setTitle('🎵 Music Commands Help')
    .setColor('#0099ff')
    .setThumbnail('https://cdn.discordapp.com/attachments/placeholder/music-icon.png')
    
  embed.addField('🎵 Playback Commands', 
    `\`${client.settings.prefix}play <song>\` - Play a song from YouTube\n` +
    `\`${client.settings.prefix}search <query>\` - Search for songs\n` +
    `\`${client.settings.prefix}pause\` - Pause current song\n` +
    `\`${client.settings.prefix}resume\` - Resume paused song\n` +
    `\`${client.settings.prefix}skip\` - Skip current song\n` +
    `\`${client.settings.prefix}stop\` - Stop music and clear queue`
  )
  
  embed.addField('📋 Queue Commands',
    `\`${client.settings.prefix}queue\` - Show music queue\n` +
    `\`${client.settings.prefix}nowplaying\` - Show current song\n` +
    `\`${client.settings.prefix}volume <0-100>\` - Set volume`
  )
  
  embed.addField('📊 Chart Commands',
    `\`${client.settings.prefix}spotify\` - Spotify Global Top 50\n` +
    `\`${client.settings.prefix}applemusic\` - Apple Music Top Songs\n` +
    `\`${client.settings.prefix}melon\` - Melon Chart (Korean)`
  )
  
  embed.addField('ℹ️ Music Bot Info',
    '• You must be in a voice channel to use music commands\n' +
    '• The bot requires permissions to join and speak in voice channels\n' +
    '• Use song names or YouTube URLs with the play command\n' +
    '• Charts show example data unless API keys are configured'
  )
  
  embed.setFooter('Use the commands with your bot prefix: ' + client.settings.prefix)
  
  msg.channel.send({ embeds: [embed] })
}
