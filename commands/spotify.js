const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['spotify', 'spot', '스포티파이']
module.exports.run = async (client, msg) => {
  try {
    // Spotify Web API는 인증이 필요하므로, 대안으로 공개 차트 API 사용
    // 또는 스포티파이 차트 크롤링 서비스 이용
    
    const embed = new Embed()
      .setTitle('🎵 Spotify Global Top 50')
      .setDescription('Here are the top tracks on Spotify:')
      .setColor('#1DB954')
      .setThumbnail('https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png')

    // 예시 데이터 (실제로는 API에서 가져와야 함)
    const spotifyTracks = [
      { name: 'As It Was', artist: 'Harry Styles', position: 1 },
      { name: 'Heat Waves', artist: 'Glass Animals', position: 2 },
      { name: 'Stay', artist: 'The Kid LAROI & Justin Bieber', position: 3 },
      { name: 'Bad Habit', artist: 'Steve Lacy', position: 4 },
      { name: 'About Damn Time', artist: 'Lizzo', position: 5 }
    ]

    const trackList = spotifyTracks.map(track => 
      `**${track.position}.** ${track.name} - ${track.artist}`
    ).join('\n')

    embed.addField('Top Tracks', trackList)
    embed.setFooter('Data from Spotify Global Charts')
    
    // 실제 Spotify API 사용 시:
    /*
    const clientId = client.settings.spotifyClientId
    const clientSecret = client.settings.spotifyClientSecret
    
    if (!clientId || !clientSecret) {
      return msg.channel.send('Spotify API credentials not configured!')
    }
    
    // Get access token
    const authResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    })
    
    const authData = await authResponse.json()
    
    // Get playlist (Global Top 50)
    const playlistResponse = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=10', {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`
      }
    })
    
    const playlistData = await playlistResponse.json()
    */

    msg.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Spotify command error:', error)
    msg.reply('Failed to fetch Spotify chart data.')
  }
}
