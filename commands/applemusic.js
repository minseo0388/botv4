const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['applemusic', 'apple', 'am', '애플뮤직']
module.exports.run = async (client, msg) => {
  try {
    // Apple Music API는 복잡한 인증이 필요하므로, 
    // 대안으로 iTunes API나 공개 차트 데이터 사용
    
    const embed = new Embed()
      .setTitle('🍎 Apple Music Top Songs')
      .setDescription('Here are the top tracks on Apple Music:')
      .setColor('#FC3C44')
      .setThumbnail('https://logos-world.net/wp-content/uploads/2020/06/Apple-Music-Logo.png')

    // iTunes API를 사용한 예시 (무료)
    try {
      const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=10/json')
      const data = await response.json()
      
      if (data.feed && data.feed.entry) {
        const tracks = data.feed.entry.slice(0, 10)
        const trackList = tracks.map((track, index) => 
          `**${index + 1}.** ${track['im:name'].label} - ${track['im:artist'].label}`
        ).join('\n')
        
        embed.addField('Top Songs', trackList)
        embed.setFooter('Data from iTunes Store')
      } else {
        throw new Error('No data received')
      }
    } catch (apiError) {
      // Fallback to example data
      const appleTracks = [
        { name: 'Anti-Hero', artist: 'Taylor Swift', position: 1 },
        { name: 'Unholy', artist: 'Sam Smith ft. Kim Petras', position: 2 },
        { name: 'I\'m Good (Blue)', artist: 'David Guetta & Bebe Rexha', position: 3 },
        { name: 'Lavender Haze', artist: 'Taylor Swift', position: 4 },
        { name: 'Flowers', artist: 'Miley Cyrus', position: 5 }
      ]

      const trackList = appleTracks.map(track => 
        `**${track.position}.** ${track.name} - ${track.artist}`
      ).join('\n')

      embed.addField('Top Songs', trackList)
      embed.setFooter('Example data - Configure Apple Music API for live data')
    }

    msg.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Apple Music command error:', error)
    msg.reply('Failed to fetch Apple Music chart data.')
  }
}
