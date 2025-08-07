const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['volume', 'vol', '볼륨']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!msg.member.voice?.channelID) {
    return msg.reply('You need to be in a voice channel to change volume!')
  }

  if (!client.musicQueue) client.musicQueue = new Map()
  const serverQueue = client.musicQueue.get(msg.guild.id)

  if (!serverQueue) {
    return msg.reply('There is no song playing!')
  }

  if (!args.length) {
    const embed = new Embed()
      .setTitle('🔊 Current Volume')
      .setDescription(`Current volume is **${serverQueue.volume * 10}%**`)
      .setColor('#0099ff')
    
    return msg.channel.send({ embeds: [embed] })
  }

  const volume = parseInt(args[0])
  
  if (isNaN(volume) || volume < 0 || volume > 100) {
    return msg.reply('Please provide a volume between 0 and 100!')
  }

  serverQueue.volume = volume / 10

  const embed = new Embed()
    .setTitle('🔊 Volume Changed')
    .setDescription(`Volume set to **${volume}%**`)
    .setColor('#00ff00')

  msg.channel.send({ embeds: [embed] })
}
