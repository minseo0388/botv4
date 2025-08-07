const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['unafk', 'back']
module.exports.run = async (client, msg) => {
  if (!client.afkUsers.has(msg.author.id)) {
    return msg.reply('You are not currently AFK!')
  }

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
        await msg.member.setNickname(null)
      } else {
        await msg.member.setNickname(newNickname)
      }
    }
  } catch (error) {
    console.log('Could not change nickname:', error.message)
  }
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
