const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['queue', 'q', '큐', '대기열']
module.exports.run = async (client, msg) => {
  if (!client.musicQueue) client.musicQueue = new Map()
  const serverQueue = client.musicQueue.get(msg.guild.id)

  if (!serverQueue || !serverQueue.songs.length) {
    return msg.reply('There are no songs in the queue!')
  }

  const embed = new Embed()
    .setTitle('🎵 Music Queue')
    .setColor('#0099ff')

  // Show current song
  const currentSong = serverQueue.songs[0]
  embed.addField('🎵 Now Playing', `**${currentSong.title}**\nRequested by: ${currentSong.requestedBy.tag}`)

  // Show next songs in queue
  if (serverQueue.songs.length > 1) {
    const queueList = serverQueue.songs.slice(1, 11).map((song, index) => {
      return `**${index + 1}.** ${song.title}\nRequested by: ${song.requestedBy.tag}`
    }).join('\n\n')

    embed.addField(`⏭️ Up Next (${serverQueue.songs.length - 1} songs)`, queueList)

    if (serverQueue.songs.length > 11) {
      embed.setFooter(`And ${serverQueue.songs.length - 11} more songs...`)
    }
  }

  msg.channel.send({ embeds: [embed] })
}
