const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['stop', 'disconnect', '정지']
module.exports.run = async (client, msg) => {
  if (!msg.member.voice?.channelID) {
    return msg.reply('You need to be in a voice channel to stop music!')
  }

  if (!client.musicQueue) client.musicQueue = new Map()
  const serverQueue = client.musicQueue.get(msg.guild.id)

  if (!serverQueue) {
    return msg.reply('There is no song playing!')
  }

  // Clear the queue and stop playing
  serverQueue.songs = []
  
  // Disconnect from voice channel
  if (serverQueue.connection) {
    try {
      await serverQueue.connection.disconnect()
    } catch (error) {
      console.error('Error disconnecting from voice channel:', error)
    }
  }
  
  client.musicQueue.delete(msg.guild.id)

  const embed = new Embed()
    .setTitle('⏹️ Music Stopped')
    .setDescription('Music has been stopped and queue cleared!')
    .setColor('#ff0000')

  msg.channel.send({ embeds: [embed] })
}
