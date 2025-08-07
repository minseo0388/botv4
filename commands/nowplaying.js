const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['nowplaying', 'np', '현재재생']
module.exports.run = async (client, msg) => {
  if (!client.musicQueue) client.musicQueue = new Map()
  const serverQueue = client.musicQueue.get(msg.guild.id)

  if (!serverQueue || !serverQueue.songs.length) {
    return msg.reply('There is no song playing!')
  }

  const song = serverQueue.songs[0]
  
  const embed = new Embed()
    .setTitle('🎵 Now Playing')
    .setDescription(`**${song.title}**`)
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    .addField('Duration', formatDuration(song.duration), true)
    .addField('Requested by', song.requestedBy.tag, true)
    .addField('Volume', `${serverQueue.volume * 10}%`, true)
    .addField('Status', serverQueue.playing ? '▶️ Playing' : '⏸️ Paused', true)
    .addField('Queue Length', `${serverQueue.songs.length} songs`, true)
    .setColor('#ff0000')
    .setTimestamp()

  msg.channel.send({ embeds: [embed] })
}

function formatDuration(seconds) {
  if (!seconds) return 'Unknown'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}
