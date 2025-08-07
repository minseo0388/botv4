const Query = require('../classes/Query')
const { Embed } = require('@harmonyland/harmony')
const levelSystem = require('../commands/level')

module.exports = (client, msg) => {
  if (msg.author.bot || !msg.guild) return
  
  // Handle level system XP gain
  levelSystem.handleMessage(client, msg)
  
  // Check if user is returning from AFK
  if (client.afkUsers.has(msg.author.id)) {
    const afkData = client.afkUsers.get(msg.author.id)
    const afkTime = Date.now() - afkData.time
    const duration = formatDuration(afkTime)

    client.afkUsers.delete(msg.author.id)

    const embed = new Embed()
      .setTitle('👋 Welcome Back!')
      .setDescription(`${msg.author} is no longer AFK`)
      .addField('AFK Duration', duration, true)
      .addField('Reason', afkData.reason, true)
      .setColor('#00ff00')
      .setTimestamp()

    msg.channel.send({ embeds: [embed] })

    // Try to remove [AFK] prefix from nickname
    try {
      if (msg.member.nickname && msg.member.nickname.startsWith('[AFK]')) {
        const newNickname = msg.member.nickname.replace('[AFK] ', '')
        if (newNickname === msg.author.username) {
          msg.member.setNickname(null)
        } else {
          msg.member.setNickname(newNickname)
        }
      }
    } catch (error) {
      console.log('Could not change nickname:', error.message)
    }
  }

  // Check for mentions of AFK users
  if (msg.mentions.users.size > 0) {
    msg.mentions.users.forEach(user => {
      if (client.afkUsers.has(user.id)) {
        const afkData = client.afkUsers.get(user.id)
        const afkTime = Date.now() - afkData.time
        const duration = formatDuration(afkTime)

        const embed = new Embed()
          .setTitle('💤 User is AFK')
          .setDescription(`${user} has been AFK for ${duration}`)
          .addField('Reason', afkData.reason, true)
          .setColor('#ffff00')
          .setTimestamp(afkData.time)

        msg.channel.send({ embeds: [embed] })
      }
    })
  }
  
  if (!msg.content.startsWith(client.settings.prefix)) return

  const query = new Query(msg.content, client.settings.prefix)
  msg.query = query

  const target = client.commands.find((c) => c.aliases.includes(query.cmd))
  if (target) target.run(client, msg)
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}
