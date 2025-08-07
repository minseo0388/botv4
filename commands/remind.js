const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['remind', 'reminder', '리마인더', '알림']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    // Show user's reminders
    const userReminders = client.reminders.get(msg.author.id) || []
    
    if (userReminders.length === 0) {
      return msg.reply('You have no reminders set! Use `!remind <time> <message>` to add one.')
    }

    const embed = new Embed()
      .setTitle(`⏰ ${msg.author.username}'s Reminders`)
      .setColor('#0099ff')

    let description = ''
    userReminders.forEach((reminder, index) => {
      const timeLeft = reminder.time - Date.now()
      const timeLeftStr = formatDuration(timeLeft)
      
      description += `**${index + 1}.** ${reminder.message}\n`
      description += `⏱️ ${timeLeft > 0 ? `In ${timeLeftStr}` : 'Overdue'}\n\n`
    })

    embed.setDescription(description)
    return msg.channel.send({ embeds: [embed] })
  }

  const subCommand = args[0].toLowerCase()

  if (subCommand === 'list') {
    // Same as no args - show user's reminders
    const userReminders = client.reminders.get(msg.author.id) || []
    
    if (userReminders.length === 0) {
      return msg.reply('You have no reminders set! Use `!remind <time> <message>` to add one.')
    }

    const embed = new Embed()
      .setTitle(`⏰ ${msg.author.username}'s Reminders`)
      .setColor('#0099ff')

    let description = ''
    userReminders.forEach((reminder, index) => {
      const timeLeft = reminder.time - Date.now()
      const timeLeftStr = formatDuration(timeLeft)
      
      description += `**${index + 1}.** ${reminder.message}\n`
      description += `⏱️ ${timeLeft > 0 ? `In ${timeLeftStr}` : 'Overdue'}\n\n`
    })

    embed.setDescription(description)
    return msg.channel.send({ embeds: [embed] })

  } else if (subCommand === 'remove' || subCommand === 'delete') {
    if (args.length < 2) {
      return msg.reply('Usage: `!remind remove <number>` (use `!remind list` to see numbers)')
    }

    const index = parseInt(args[1]) - 1
    const userReminders = client.reminders.get(msg.author.id) || []

    if (index < 0 || index >= userReminders.length) {
      return msg.reply('Invalid reminder number!')
    }

    const removed = userReminders.splice(index, 1)[0]
    client.reminders.set(msg.author.id, userReminders)

    const embed = new Embed()
      .setTitle('✅ Reminder Removed')
      .setDescription(`Reminder **${removed.message}** has been removed!`)
      .setColor('#ff0000')

    msg.channel.send({ embeds: [embed] })

  } else {
    // Add reminder: !remind 1h30m Remember to do homework
    const timeStr = args[0]
    const message = args.slice(1).join(' ')

    if (!message) {
      return msg.reply('Usage: `!remind <time> <message>`\nExample: `!remind 1h30m Do homework`')
    }

    const duration = parseTimeString(timeStr)
    if (!duration) {
      return msg.reply('Invalid time format! Examples: 5m, 1h, 2h30m, 1d, 30s')
    }

    const reminderTime = Date.now() + duration
    const userReminders = client.reminders.get(msg.author.id) || []
    
    const reminder = {
      message: message,
      time: reminderTime,
      channelId: msg.channel.id,
      created: Date.now()
    }

    userReminders.push(reminder)
    client.reminders.set(msg.author.id, userReminders)

    // Set timeout for the reminder
    setTimeout(() => {
      sendReminder(client, msg.author.id, msg.channel.id, message)
    }, duration)

    const embed = new Embed()
      .setTitle('✅ Reminder Set')
      .setDescription(`I'll remind you in ${formatDuration(duration)}`)
      .addField('Message', message, false)
      .addField('Time', `<t:${Math.floor(reminderTime / 1000)}:F>`, false)
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

async function sendReminder(client, userId, channelId, message) {
  try {
    const channel = await client.channels.get(channelId)
    const user = await client.users.get(userId)
    
    if (channel && user) {
      const embed = new Embed()
        .setTitle('⏰ Reminder!')
        .setDescription(`${user}, here's your reminder:`)
        .addField('Message', message, false)
        .setColor('#ffff00')
        .setTimestamp()

      await channel.send({ embeds: [embed] })

      // Remove from reminders list
      const userReminders = client.reminders.get(userId) || []
      const updatedReminders = userReminders.filter(r => r.message !== message || r.channelId !== channelId)
      client.reminders.set(userId, updatedReminders)
    }
  } catch (error) {
    console.error('Error sending reminder:', error)
  }
}
