const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['pause', 'resume', '일시정지', '재개']
module.exports.run = async (client, msg) => {
  if (!msg.member.voice?.channelID) {
    return msg.reply('You need to be in a voice channel to pause/resume music!')
  }

  if (!client.musicQueue) client.musicQueue = new Map()
  const serverQueue = client.musicQueue.get(msg.guild.id)

  if (!serverQueue) {
    return msg.reply('There is no song playing!')
  }

  const command = msg.content.split(' ')[0].toLowerCase().slice(client.settings.prefix.length)
  
  if (command === 'pause' || command === '일시정지') {
    if (!serverQueue.playing) {
      return msg.reply('Music is already paused!')
    }
    
    serverQueue.playing = false
    // Here you would pause the audio connection
    
    const embed = new Embed()
      .setTitle('⏸️ Music Paused')
      .setDescription('Music has been paused!')
      .setColor('#ffff00')
    
    msg.channel.send({ embeds: [embed] })
  } else if (command === 'resume' || command === '재개') {
    if (serverQueue.playing) {
      return msg.reply('Music is already playing!')
    }
    
    serverQueue.playing = true
    // Here you would resume the audio connection
    
    const embed = new Embed()
      .setTitle('▶️ Music Resumed')
      .setDescription('Music has been resumed!')
      .setColor('#00ff00')
    
    msg.channel.send({ embeds: [embed] })
  }
}
