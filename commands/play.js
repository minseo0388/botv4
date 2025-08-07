const { Embed } = require('@harmonyland/harmony')
const ytdl = require('ytdl-core')
const YouTube = require('youtube-sr').default

module.exports.aliases = ['play', 'p', '재생']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  if (!args.length) {
    return msg.reply('Please provide a song name or YouTube URL to play!')
  }

  // Check if user is in a voice channel
  if (!msg.member.voice?.channelID) {
    return msg.reply('You need to be in a voice channel to play music!')
  }

  const query = args.join(' ')
  
  try {
    let videoURL = query
    let videoInfo

    // If not a YouTube URL, search for the song
    if (!ytdl.validateURL(query)) {
      const searchResults = await YouTube.search(query, { limit: 1 })
      if (!searchResults.length) {
        return msg.reply('No songs found for your search!')
      }
      videoURL = searchResults[0].url
      videoInfo = searchResults[0]
    } else {
      // Get video info for YouTube URL
      videoInfo = await ytdl.getInfo(videoURL)
    }

    const serverQueue = client.musicQueue.get(msg.guild.id)
    
    const song = {
      title: videoInfo.title || videoInfo.videoDetails?.title,
      url: videoURL,
      duration: videoInfo.duration || videoInfo.videoDetails?.lengthSeconds,
      thumbnail: videoInfo.thumbnail?.url || videoInfo.videoDetails?.thumbnails?.[0]?.url,
      requestedBy: msg.author
    }

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: msg.channel,
        voiceChannel: msg.member.voice.channelID,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      }

      client.musicQueue.set(msg.guild.id, queueConstruct)
      queueConstruct.songs.push(song)

      try {
        // Connect to voice channel using Harmony
        const voiceChannel = await client.channels.get(msg.member.voice.channelID)
        if (voiceChannel) {
          queueConstruct.connection = await voiceChannel.join()
          
          const embed = new Embed()
            .setTitle('🎵 Added to Queue')
            .setDescription(`**${song.title}**`)
            .setThumbnail(song.thumbnail)
            .addField('Duration', formatDuration(song.duration), true)
            .addField('Requested by', song.requestedBy.tag, true)
            .setColor('#00ff00')

          msg.channel.send({ embeds: [embed] })
          
          // Start playing
          playSong(client, msg.guild, queueConstruct.songs[0])
        } else {
          throw new Error('Voice channel not found')
        }
      } catch (err) {
        console.log(err)
        client.musicQueue.delete(msg.guild.id)
        return msg.reply('There was an error connecting to the voice channel!')
      }
    } else {
      serverQueue.songs.push(song)
      
      const embed = new Embed()
        .setTitle('🎵 Added to Queue')
        .setDescription(`**${song.title}**`)
        .setThumbnail(song.thumbnail)
        .addField('Position in queue', serverQueue.songs.length.toString(), true)
        .addField('Duration', formatDuration(song.duration), true)
        .addField('Requested by', song.requestedBy.tag, true)
        .setColor('#00ff00')

      return msg.channel.send({ embeds: [embed] })
    }
  } catch (error) {
    console.error('Play command error:', error)
    msg.reply('There was an error trying to play that song!')
  }
}

async function playSong(client, guild, song) {
  const serverQueue = client.musicQueue.get(guild.id)
  
  if (!song) {
    if (serverQueue?.connection) {
      await serverQueue.connection.disconnect()
    }
    client.musicQueue.delete(guild.id)
    return
  }

  try {
    const stream = ytdl(song.url, { 
      filter: 'audioonly',
      highWaterMark: 1 << 25
    })

    if (serverQueue?.connection) {
      // Play audio using Harmony's voice connection
      serverQueue.connection.play(stream, {
        type: 'opus'
      })

      serverQueue.connection.on('finish', () => {
        serverQueue.songs.shift()
        playSong(client, guild, serverQueue.songs[0])
      })
    }

    const embed = new Embed()
      .setTitle('🎵 Now Playing')
      .setDescription(`**${song.title}**`)
      .setThumbnail(song.thumbnail)
      .addField('Duration', formatDuration(song.duration), true)
      .addField('Requested by', song.requestedBy.tag, true)
      .setColor('#ff0000')

    serverQueue.textChannel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Error playing song:', error)
    serverQueue.textChannel.send('There was an error playing this song!')
    serverQueue.songs.shift()
    playSong(client, guild, serverQueue.songs[0])
  }
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
