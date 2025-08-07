const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['timer', '타이머']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    // Show user's active timers
    const userTimers = client.timers.get(msg.author.id) || []
    
    if (userTimers.length === 0) {
      return msg.reply('You have no active timers! Use `!timer <time> [name]` to start one.')
    }

    const embed = new Embed()
      .setTitle(`⏲️ ${msg.author.username}'s Active Timers`)
      .setColor('#0099ff')

    let description = ''
    userTimers.forEach((timer, index) => {
      const timeLeft = timer.endTime - Date.now()
      const timeLeftStr = timeLeft > 0 ? formatDuration(timeLeft) : 'Finished'
      
      description += `**${index + 1}.** ${timer.name}\n`
      description += `⏱️ ${timeLeftStr}\n\n`
    })

    embed.setDescription(description)
    return msg.channel.send({ embeds: [embed] })
  }

  const subCommand = args[0].toLowerCase()

  if (subCommand === 'list') {
    // Same as no args - show user's timers
    const userTimers = client.timers.get(msg.author.id) || []
    
    if (userTimers.length === 0) {
      return msg.reply('You have no active timers! Use `!timer <time> [name]` to start one.')
    }

    const embed = new Embed()
      .setTitle(`⏲️ ${msg.author.username}'s Active Timers`)
      .setColor('#0099ff')

    let description = ''
    userTimers.forEach((timer, index) => {
      const timeLeft = timer.endTime - Date.now()
      const timeLeftStr = timeLeft > 0 ? formatDuration(timeLeft) : 'Finished'
      
      description += `**${index + 1}.** ${timer.name}\n`
      description += `⏱️ ${timeLeftStr}\n\n`
    })

    embed.setDescription(description)
    return msg.channel.send({ embeds: [embed] })

  } else if (subCommand === 'stop' || subCommand === 'cancel') {
    if (args.length < 2) {
      return msg.reply('Usage: `!timer stop <number>` (use `!timer list` to see numbers)')
    }

    const index = parseInt(args[1]) - 1
    const userTimers = client.timers.get(msg.author.id) || []

    if (index < 0 || index >= userTimers.length) {
      return msg.reply('Invalid timer number!')
    }

    const stopped = userTimers.splice(index, 1)[0]
    client.timers.set(msg.author.id, userTimers)

    const embed = new Embed()
      .setTitle('🛑 Timer Stopped')
      .setDescription(`Timer **${stopped.name}** has been stopped!`)
      .setColor('#ff0000')

    msg.channel.send({ embeds: [embed] })

  } else {
    // Start timer: !timer 5m Study break
    const timeStr = args[0]
    const name = args.slice(1).join(' ') || 'Timer'

    const duration = parseTimeString(timeStr)
    if (!duration) {
      return msg.reply('Invalid time format! Examples: 5m, 1h, 2h30m, 30s')
    }

    if (duration > 24 * 60 * 60 * 1000) {
      return msg.reply('Timer cannot be longer than 24 hours!')
    }

    const endTime = Date.now() + duration
    const userTimers = client.timers.get(msg.author.id) || []
    
    const timer = {
      name: name,
      endTime: endTime,
      channelId: msg.channel.id,
      started: Date.now()
    }

    userTimers.push(timer)
    client.timers.set(msg.author.id, userTimers)

    // Set timeout for the timer
    setTimeout(() => {
      sendTimerNotification(client, msg.author.id, msg.channel.id, name)
    }, duration)

    const embed = new Embed()
      .setTitle('⏲️ Timer Started')
      .setDescription(`Timer **${name}** started for ${formatDuration(duration)}`)
      .addField('Ends at', `<t:${Math.floor(endTime / 1000)}:F>`, false)
      .setColor('#00ff00')

    msg.channel.send({ embeds: [embed] })
  }
}

function parseTimeString(timeStr) {
  const regex = /(\d+)([smhd])/g
  let totalMs = 0
  let match

  while ((match = regex.exec(timeStr)) !== null) {
    const value = parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case 's':
        totalMs += value * 1000
        break
      case 'm':
        totalMs += value * 60 * 1000
        break
      case 'h':
        totalMs += value * 60 * 60 * 1000
        break
      case 'd':
        totalMs += value * 24 * 60 * 60 * 1000
        break
    }
  }

  return totalMs > 0 ? totalMs : null
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

async function sendTimerNotification(client, userId, channelId, name) {
  try {
    const channel = await client.channels.get(channelId)
    const user = await client.users.get(userId)
    
    if (channel && user) {
      const embed = new Embed()
        .setTitle('⏰ Timer Finished!')
        .setDescription(`${user}, your timer **${name}** has finished!`)
        .setColor('#ff6600')
        .setTimestamp()

      await channel.send({ embeds: [embed] })

      // Remove from timers list
      const userTimers = client.timers.get(userId) || []
      const updatedTimers = userTimers.filter(t => t.name !== name || t.channelId !== channelId)
      client.timers.set(userId, updatedTimers)
    }
  } catch (error) {
    console.error('Error sending timer notification:', error)
  }
}
