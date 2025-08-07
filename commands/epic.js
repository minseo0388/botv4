const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['epic', 'epicgames', 'fortnite', '에픽게임즈', '포트나이트']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!epic <username>`')
  }

  const username = args[0]

  try {
    // Using Fortnite API (fortnite-api.com)
    const response = await fetch(`https://fortnite-api.com/v2/stats/br/v2/${encodeURIComponent(username)}`)
    
    if (!response.ok) {
      return msg.reply('Epic Games/Fortnite profile not found!')
    }

    const data = await response.json()
    const stats = data.data

    if (!stats) {
      return msg.reply('No Fortnite stats found for this user.')
    }

    const overall = stats.stats.all.overall
    const solo = stats.stats.all.solo
    const duo = stats.stats.all.duo
    const squad = stats.stats.all.squad

    const embed = new Embed()
      .setTitle(`🎮 Fortnite Stats: ${stats.account.name}`)
      .setColor('#9147ff')
      .addField('Account Level', stats.battlePass?.level?.toString() || 'Unknown', true)
      .addField('Account ID', stats.account.id, true)

    // Overall stats
    if (overall) {
      embed.addField('🏆 Overall Stats', 
        `**Wins:** ${overall.wins}\n**Kills:** ${overall.kills}\n**Matches:** ${overall.matches}\n**Win Rate:** ${(overall.winRate || 0).toFixed(2)}%\n**K/D:** ${(overall.kd || 0).toFixed(2)}`, 
        true
      )
    }

    // Solo stats
    if (solo && solo.matches > 0) {
      embed.addField('👤 Solo Stats',
        `**Wins:** ${solo.wins}\n**Kills:** ${solo.kills}\n**Matches:** ${solo.matches}\n**Win Rate:** ${(solo.winRate || 0).toFixed(2)}%\n**K/D:** ${(solo.kd || 0).toFixed(2)}`,
        true
      )
    }

    // Duo stats
    if (duo && duo.matches > 0) {
      embed.addField('👥 Duo Stats',
        `**Wins:** ${duo.wins}\n**Kills:** ${duo.kills}\n**Matches:** ${duo.matches}\n**Win Rate:** ${(duo.winRate || 0).toFixed(2)}%\n**K/D:** ${(duo.kd || 0).toFixed(2)}`,
        true
      )
    }

    // Squad stats
    if (squad && squad.matches > 0) {
      embed.addField('👨‍👩‍👧‍👦 Squad Stats',
        `**Wins:** ${squad.wins}\n**Kills:** ${squad.kills}\n**Matches:** ${squad.matches}\n**Win Rate:** ${(squad.winRate || 0).toFixed(2)}%\n**K/D:** ${(squad.kd || 0).toFixed(2)}`,
        true
      )
    }

    if (stats.image) {
      embed.setThumbnail(stats.image)
    }

    embed.setFooter('Data provided by Fortnite-API.com')

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('Epic Games/Fortnite API error:', error)
    msg.reply('Failed to fetch Epic Games/Fortnite profile. Please check the username and try again.')
  }
}
