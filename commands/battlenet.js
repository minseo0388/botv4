const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['battlenet', 'overwatch', 'ow', '배틀넷', '오버워치']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!battlenet <battletag> [region]`\nExample: `!battlenet Player-1234 us`\nRegions: us, eu, asia')
  }

  const battletag = args[0].replace('#', '-')
  const region = args[1]?.toLowerCase() || 'us'
  const validRegions = ['us', 'eu', 'asia']
  
  if (!validRegions.includes(region)) {
    return msg.reply('Invalid region! Use: us, eu, or asia')
  }

  try {
    // Using Overwatch API (unofficial)
    const response = await fetch(`https://ow-api.com/v1/stats/pc/${region}/${battletag}/profile`)
    
    if (!response.ok) {
      return msg.reply('Battle.net/Overwatch profile not found! Make sure to use the format Player-1234')
    }

    const data = await response.json()

    if (data.error) {
      return msg.reply('Profile not found or is private!')
    }

    const embed = new Embed()
      .setTitle(`🎯 Overwatch Profile: ${data.name}`)
      .setThumbnail(data.icon)
      .setColor('#f99e1a')
      .addField('Battletag', data.name, true)
      .addField('Level', data.level?.toString() || 'Unknown', true)
      .addField('Endorsement', data.endorsement?.toString() || 'Unknown', true)

    if (data.private) {
      embed.addField('Profile Status', '🔒 Private', true)
    } else {
      // Competitive stats
      if (data.competitive) {
        let compInfo = ''
        
        // Tank
        if (data.competitive.tank) {
          compInfo += `**Tank:** ${data.competitive.tank.rank || 'Unranked'}`
          if (data.competitive.tank.rank_img) compInfo += '\n'
        }
        
        // Damage
        if (data.competitive.damage) {
          compInfo += `**Damage:** ${data.competitive.damage.rank || 'Unranked'}`
          if (data.competitive.damage.rank_img) compInfo += '\n'
        }
        
        // Support
        if (data.competitive.support) {
          compInfo += `**Support:** ${data.competitive.support.rank || 'Unranked'}`
        }

        if (compInfo) {
          embed.addField('Competitive Ranks', compInfo, false)
        }
      }

      // Quick Play stats
      if (data.quickPlayStats) {
        const qpStats = data.quickPlayStats.careerStats?.allHeroes?.game
        if (qpStats) {
          embed.addField('Quick Play Stats',
            `**Games Won:** ${qpStats.gamesWon || 0}\n**Time Played:** ${qpStats.timePlayed || 'Unknown'}`,
            true
          )
        }
      }

      // Most played heroes
      if (data.quickPlayStats?.topHeroes) {
        const topHeroes = Object.keys(data.quickPlayStats.topHeroes)
          .slice(0, 3)
          .map(hero => hero.charAt(0).toUpperCase() + hero.slice(1))
          .join(', ')
        
        if (topHeroes) {
          embed.addField('Top Heroes', topHeroes, true)
        }
      }
    }

    embed.addField('Region', region.toUpperCase(), true)
    embed.setFooter('Data provided by ow-api.com')

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('Battle.net/Overwatch API error:', error)
    msg.reply('Failed to fetch Battle.net/Overwatch profile. Please check the battletag format (Player-1234) and try again.')
  }
}
