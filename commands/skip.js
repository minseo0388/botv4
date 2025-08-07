const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['skip', 's', '스킵', '다음']
module.exports.run = async (client, msg) => {
  if (!msg.member.voice?.channelID) {
    return msg.reply('You need to be in a voice channel to skip music!')
  }

  if (!client.musicQueue) client.musicQueue = new Map()
  const serverQueue = client.musicQueue.get(msg.guild.id)

  if (!serverQueue || !serverQueue.songs.length) {
    return msg.reply('There is no song playing!')
  }

  const skippedSong = serverQueue.songs[0]
  
  // Remove current song from queue
  serverQueue.songs.shift()

  const embed = new Embed()
    .setTitle('⏭️ Song Skipped')
    .setDescription(`**${skippedSong.title}** has been skipped!`)
    .setColor('#ffff00')

  if (serverQueue.songs.length > 0) {
    embed.addField('🎵 Now Playing', `**${serverQueue.songs[0].title}**`)
    // Play the next song
    playSong(client, msg.guild, serverQueue.songs[0])
  } else {
    embed.setDescription('Song skipped! Queue is now empty.')
    // Disconnect from voice channel
    if (serverQueue.connection) {
      try {
        await serverQueue.connection.disconnect()
      } catch (error) {
        console.error('Error disconnecting from voice channel:', error)
      }
    }
    client.musicQueue.delete(msg.guild.id)
  }

  msg.channel.send({ embeds: [embed] })
}

async function playSong(client, guild, song) {
  const queue = client.musicQueue.get(guild.id)
  if (!queue) return

  try {
    const ytdl = require('ytdl-core')
    const stream = ytdl(song.url, { 
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    })

    if (queue.connection) {
      queue.connection.play(stream, { type: 'opus' })
      
      const embed = new Embed()
        .setTitle('🎵 Now Playing')
        .setDescription(`**${song.title}**`)
        .addField('Duration', song.duration || 'Unknown', true)
        .addField('Requested by', song.requester, true)
        .setThumbnail(song.thumbnail)
        .setColor('#00ff00')

      queue.textChannel.send({ embeds: [embed] })

      queue.connection.on('finish', () => {
        queue.songs.shift()
        if (queue.songs.length > 0) {
          playSong(client, guild, queue.songs[0])
        } else {
          queue.connection.disconnect()
          client.musicQueue.delete(guild.id)
        }
      })
    }
  } catch (error) {
    console.error('Error playing song:', error)
    queue.textChannel.send('Error playing the song!')
  }
}
