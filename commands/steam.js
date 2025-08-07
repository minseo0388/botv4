const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['steam', 'steamprofile', '스팀']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!steam <username or Steam ID>`')
  }

  const query = args.join(' ')

  try {
    // Steam API requires an API key, using alternative approach
    const steamIdResponse = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY || 'YOUR_STEAM_API_KEY'}&vanityurl=${encodeURIComponent(query)}`)
    const steamIdData = await steamIdResponse.json()
    
    let steamId = steamIdData.response.steamid || query

    const profileResponse = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY || 'YOUR_STEAM_API_KEY'}&steamids=${steamId}`)
    const profileData = await profileResponse.json()

    if (!profileData.response.players.length) {
      return msg.reply('Steam profile not found!')
    }

    const player = profileData.response.players[0]
    
    // Get game stats
    const gamesResponse = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY || 'YOUR_STEAM_API_KEY'}&steamid=${steamId}&format=json`)
    const gamesData = await gamesResponse.json()

    const totalGames = gamesData.response?.game_count || 0
    const totalPlaytime = gamesData.response?.games?.reduce((sum, game) => sum + (game.playtime_forever || 0), 0) || 0

    const embed = new Embed()
      .setTitle(`🎮 Steam Profile: ${player.personaname}`)
      .setThumbnail(player.avatarfull)
      .setColor('#1b2838')
      .addField('Profile Status', getProfileStatus(player.communityvisibilitystate), true)
      .addField('Account Created', player.timecreated ? new Date(player.timecreated * 1000).toLocaleDateString() : 'Unknown', true)
      .addField('Last Online', player.lastlogoff ? new Date(player.lastlogoff * 1000).toLocaleDateString() : 'Unknown', true)
      .addField('Total Games', totalGames.toString(), true)
      .addField('Total Playtime', `${Math.floor(totalPlaytime / 60)} hours`, true)
      .addField('Profile URL', `[View Profile](${player.profileurl})`, true)

    if (player.gameextrainfo) {
      embed.addField('Currently Playing', player.gameextrainfo, false)
    }

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('Steam API error:', error)
    msg.reply('Failed to fetch Steam profile. Please check the username and try again.')
  }
}

function getProfileStatus(visibility) {
  switch (visibility) {
    case 1: return 'Private'
    case 2: return 'Friends Only'
    case 3: return 'Public'
    default: return 'Unknown'
  }
}
