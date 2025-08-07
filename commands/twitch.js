const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['twitch', 'tv', '트위치']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!twitch <channel_name>`')
  }

  const channelName = args[0].toLowerCase()

  try {
    // Get OAuth token first (requires client ID and secret)
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${process.env.TWITCH_CLIENT_ID || 'YOUR_TWITCH_CLIENT_ID'}&client_secret=${process.env.TWITCH_CLIENT_SECRET || 'YOUR_TWITCH_CLIENT_SECRET'}&grant_type=client_credentials`
    })
    
    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info
    const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${channelName}`, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID || 'YOUR_TWITCH_CLIENT_ID',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const userData = await userResponse.json()

    if (!userData.data || userData.data.length === 0) {
      return msg.reply('Twitch channel not found!')
    }

    const user = userData.data[0]

    // Get stream info
    const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID || 'YOUR_TWITCH_CLIENT_ID',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const streamData = await streamResponse.json()
    const isLive = streamData.data && streamData.data.length > 0
    const stream = isLive ? streamData.data[0] : null

    // Get follower count
    const followersResponse = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${user.id}`, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID || 'YOUR_TWITCH_CLIENT_ID',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const followersData = await followersResponse.json()

    const embed = new Embed()
      .setTitle(`📺 Twitch: ${user.display_name}`)
      .setThumbnail(user.profile_image_url)
      .setColor(isLive ? '#9146ff' : '#6441a4')
      .setDescription(user.description || 'No description available')
      .addField('Channel', user.login, true)
      .addField('Account Type', user.broadcaster_type || 'Regular', true)
      .addField('Account Created', new Date(user.created_at).toLocaleDateString(), true)
      .addField('Total Followers', followersData.total?.toString() || 'Unknown', true)

    if (isLive && stream) {
      embed.addField('🔴 LIVE NOW!', `**${stream.title}**`, false)
      embed.addField('Game', stream.game_name || 'Unknown', true)
      embed.addField('Viewers', stream.viewer_count.toString(), true)
      embed.addField('Started', new Date(stream.started_at).toLocaleString(), true)
      embed.setImage(stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180'))
    } else {
      embed.addField('Status', '⚫ Offline', true)
    }

    embed.addField('Channel URL', `[Watch on Twitch](https://twitch.tv/${user.login})`, false)

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('Twitch API error:', error)
    msg.reply('Failed to fetch Twitch channel info. Please try again.')
  }
}
