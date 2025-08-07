const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['lol', 'league', 'leagueoflegends', '롤']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!lol <summoner name> [region]`\nRegions: kr, na1, euw1, eun1, br1, la1, la2, oc1, ru, tr1, jp1')
  }

  const summonerName = args.slice(0, -1).join(' ') || args.join(' ')
  const region = args[args.length - 1].toLowerCase()
  const validRegions = ['kr', 'na1', 'euw1', 'eun1', 'br1', 'la1', 'la2', 'oc1', 'ru', 'tr1', 'jp1']
  const finalRegion = validRegions.includes(region) ? region : 'kr'
  const finalSummonerName = validRegions.includes(region) ? summonerName : args.join(' ')

  try {
    // Using Riot Games API (requires API key)
    const summonerResponse = await fetch(
      `https://${finalRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(finalSummonerName)}?api_key=${process.env.RIOT_API_KEY || 'YOUR_RIOT_API_KEY'}`
    )

    if (!summonerResponse.ok) {
      return msg.reply('Summoner not found! Please check the name and region.')
    }

    const summonerData = await summonerResponse.json()

    // Get ranked info
    const rankedResponse = await fetch(
      `https://${finalRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${process.env.RIOT_API_KEY || 'YOUR_RIOT_API_KEY'}`
    )
    const rankedData = await rankedResponse.json()

    // Get match history
    const matchesResponse = await fetch(
      `https://${finalRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerData.puuid}/ids?start=0&count=10&api_key=${process.env.RIOT_API_KEY || 'YOUR_RIOT_API_KEY'}`
    )
    const matchesData = await matchesResponse.json()

    const embed = new Embed()
      .setTitle(`🏆 ${summonerData.name} (${finalRegion.toUpperCase()})`)
      .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${summonerData.profileIconId}.png`)
      .setColor('#c89b3c')
      .addField('Summoner Level', summonerData.summonerLevel.toString(), true)
      .addField('Region', finalRegion.toUpperCase(), true)

    // Add ranked information
    if (rankedData.length > 0) {
      rankedData.forEach(queue => {
        const queueType = queue.queueType === 'RANKED_SOLO_5x5' ? 'Solo/Duo' : 
                          queue.queueType === 'RANKED_FLEX_SR' ? 'Flex 5v5' : queue.queueType
        const rank = `${queue.tier} ${queue.rank}`
        const lp = `${queue.leaguePoints} LP`
        const winRate = Math.round((queue.wins / (queue.wins + queue.losses)) * 100)
        
        embed.addField(
          `${queueType}`,
          `**${rank}** (${lp})\n${queue.wins}W ${queue.losses}L (${winRate}%)`,
          true
        )
      })
    } else {
      embed.addField('Ranked Status', 'Unranked', true)
    }

    embed.addField('Recent Matches', `${matchesData.length} games found`, true)

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('League of Legends API error:', error)
    msg.reply('Failed to fetch League of Legends profile. Please check the summoner name and try again.')
  }
}
