const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['dday', 'd-day', '디데이']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    // Show user's D-Days
    const userDdays = client.ddays.get(msg.author.id) || []
    
    if (userDdays.length === 0) {
      return msg.reply('You have no D-Days set! Use `!dday add <name> <YYYY-MM-DD>` to add one.')
    }

    const embed = new Embed()
      .setTitle(`📅 ${msg.author.username}'s D-Days`)
      .setColor('#0099ff')

    let description = ''
    userDdays.forEach((dday, index) => {
      const targetDate = new Date(dday.date)
      const today = new Date()
      const diffTime = targetDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let dayText
      if (diffDays > 0) {
        dayText = `D-${diffDays}`
      } else if (diffDays === 0) {
        dayText = 'D-Day!'
      } else {
        dayText = `D+${Math.abs(diffDays)}`
      }

      description += `**${index + 1}.** ${dday.name} - ${dayText} (${dday.date})\n`
    })

    embed.setDescription(description)
    return msg.channel.send({ embeds: [embed] })
  }

  const subCommand = args[0].toLowerCase()

  if (subCommand === 'add') {
    if (args.length < 3) {
      return msg.reply('Usage: `!dday add <name> <YYYY-MM-DD>`')
    }

    const name = args.slice(1, -1).join(' ')
    const dateStr = args[args.length - 1]

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dateStr)) {
      return msg.reply('Invalid date format! Use YYYY-MM-DD (e.g., 2024-12-25)')
    }

    const targetDate = new Date(dateStr)
    if (isNaN(targetDate.getTime())) {
      return msg.reply('Invalid date! Please check your date.')
    }

    const userDdays = client.ddays.get(msg.author.id) || []
    userDdays.push({ name, date: dateStr, created: Date.now() })
    client.ddays.set(msg.author.id, userDdays)

    const today = new Date()
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let dayText
    if (diffDays > 0) {
      dayText = `D-${diffDays}`
    } else if (diffDays === 0) {
      dayText = 'D-Day!'
    } else {
      dayText = `D+${Math.abs(diffDays)}`
    }

    const embed = new Embed()
      .setTitle('✅ D-Day Added')
      .setDescription(`**${name}** has been added!`)
      .addField('Date', dateStr, true)
      .addField('D-Day', dayText, true)
      .setColor('#00ff00')

    msg.channel.send({ embeds: [embed] })

  } else if (subCommand === 'remove' || subCommand === 'delete') {
    if (args.length < 2) {
      return msg.reply('Usage: `!dday remove <number>` (use `!dday` to see numbers)')
    }

    const index = parseInt(args[1]) - 1
    const userDdays = client.ddays.get(msg.author.id) || []

    if (index < 0 || index >= userDdays.length) {
      return msg.reply('Invalid D-Day number!')
    }

    const removed = userDdays.splice(index, 1)[0]
    client.ddays.set(msg.author.id, userDdays)

    const embed = new Embed()
      .setTitle('✅ D-Day Removed')
      .setDescription(`**${removed.name}** has been removed!`)
      .setColor('#ff0000')

    msg.channel.send({ embeds: [embed] })

  } else if (subCommand === 'list') {
    // Same as no args - show user's D-Days
    const userDdays = client.ddays.get(msg.author.id) || []
    
    if (userDdays.length === 0) {
      return msg.reply('You have no D-Days set! Use `!dday add <name> <YYYY-MM-DD>` to add one.')
    }

    const embed = new Embed()
      .setTitle(`📅 ${msg.author.username}'s D-Days`)
      .setColor('#0099ff')

    let description = ''
    userDdays.forEach((dday, index) => {
      const targetDate = new Date(dday.date)
      const today = new Date()
      const diffTime = targetDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let dayText
      if (diffDays > 0) {
        dayText = `D-${diffDays}`
      } else if (diffDays === 0) {
        dayText = 'D-Day!'
      } else {
        dayText = `D+${Math.abs(diffDays)}`
      }

      description += `**${index + 1}.** ${dday.name} - ${dayText} (${dday.date})\n`
    })

    embed.setDescription(description)
    msg.channel.send({ embeds: [embed] })

  } else {
    const helpEmbed = new Embed()
      .setTitle('📅 D-Day Commands')
      .setDescription('Manage your personal D-Day countdown!')
      .addField('`!dday`', 'Show your D-Days', false)
      .addField('`!dday add <name> <YYYY-MM-DD>`', 'Add a new D-Day', false)
      .addField('`!dday remove <number>`', 'Remove a D-Day', false)
      .addField('`!dday list`', 'Show your D-Days', false)
      .setColor('#0099ff')

    msg.channel.send({ embeds: [helpEmbed] })
  }
}
