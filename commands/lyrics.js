const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['lyrics', 'lyric', '가사']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!lyrics <artist> - <song title>`\nExample: `!lyrics BTS - Dynamite`')
  }

  const query = args.join(' ')
  let artist, title

  if (query.includes(' - ')) {
    [artist, title] = query.split(' - ').map(s => s.trim())
  } else {
    title = query
    artist = ''
  }

  try {
    // Using lyrics.ovh API (free)
    let response
    if (artist && title) {
      response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`)
    } else {
      // Search for the song
      const searchResponse = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${process.env.GENIUS_TOKEN || 'YOUR_GENIUS_TOKEN'}`
        }
      })
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        if (searchData.response.hits.length > 0) {
          const hit = searchData.response.hits[0].result
          artist = hit.primary_artist.name
          title = hit.title
          response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`)
        }
      }
    }

    if (!response || !response.ok) {
      return msg.reply('Song lyrics not found! Please check the artist and song title.')
    }

    const data = await response.json()
    
    if (!data.lyrics) {
      return msg.reply('Lyrics not available for this song.')
    }

    let lyrics = data.lyrics.trim()
    
    // Truncate if too long for Discord
    if (lyrics.length > 2000) {
      lyrics = lyrics.substring(0, 1900) + '\n\n...[Lyrics truncated]'
    }

    const embed = new Embed()
      .setTitle(`🎵 ${title}${artist ? ` - ${artist}` : ''}`)
      .setDescription(lyrics)
      .setColor('#1db954')
      .setFooter('Lyrics provided by lyrics.ovh')

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('Lyrics API error:', error)
    
    // Fallback: try a different approach
    try {
      const fallbackResponse = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(query)}`)
      const fallbackData = await fallbackResponse.json()
      
      if (fallbackData.lyrics) {
        let lyrics = fallbackData.lyrics
        if (lyrics.length > 2000) {
          lyrics = lyrics.substring(0, 1900) + '\n\n...[Lyrics truncated]'
        }

        const embed = new Embed()
          .setTitle(`🎵 ${fallbackData.title || query}`)
          .setDescription(lyrics)
          .setColor('#1db954')
          .setFooter('Lyrics provided by Some Random API')

        return msg.channel.send({ embeds: [embed] })
      }
    } catch (fallbackError) {
      console.error('Fallback lyrics API error:', fallbackError)
    }
    
    msg.reply('Failed to fetch song lyrics. Please try again with a different format or check the song title.')
  }
}
