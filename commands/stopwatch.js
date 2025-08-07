const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['stopwatch', 'sw', '스탑와치']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  const subCommand = args[0]?.toLowerCase()

  if (!subCommand || subCommand === 'list') {
    // Show user's active stopwatches
    const userStopwatches = client.stopwatches.get(msg.author.id) || []
    
    if (userStopwatches.length === 0) {
      return msg.reply('You have no active stopwatches! Use `!stopwatch start [name]` to start one.')
    }

    const embed = new Embed()
      .setTitle(`⏱️ ${msg.author.username}'s Stopwatches`)
      .setColor('#0099ff')

    let description = ''
    userStopwatches.forEach((stopwatch, index) => {
      let elapsed
      if (stopwatch.running) {
        elapsed = Date.now() - stopwatch.startTime + (stopwatch.elapsed || 0)
      } else {
        elapsed = stopwatch.elapsed || 0
      }
      
      const status = stopwatch.running ? '🟢 Running' : '🔴 Stopped'
      const elapsedStr = formatDuration(elapsed)
      
      description += `**${index + 1}.** ${stopwatch.name} - ${status}\n`
      description += `⏱️ ${elapsedStr}\n\n`
    })

    embed.setDescription(description)
    return msg.channel.send({ embeds: [embed] })
  }

  if (subCommand === 'start') {
    const name = args.slice(1).join(' ') || `Stopwatch ${Date.now()}`
    const userStopwatches = client.stopwatches.get(msg.author.id) || []
    
    // Check if stopwatch with this name already exists
    const existing = userStopwatches.find(sw => sw.name === name)
    if (existing) {
      if (existing.running) {
        return msg.reply(`Stopwatch **${name}** is already running!`)
      } else {
        // Resume existing stopwatch
        existing.running = true
        existing.startTime = Date.now()
        client.stopwatches.set(msg.author.id, userStopwatches)

        const embed = new Embed()
          .setTitle('▶️ Stopwatch Resumed')
          .setDescription(`Stopwatch **${name}** has been resumed!`)
          .setColor('#00ff00')

        return msg.channel.send({ embeds: [embed] })
      }
    }

    // Create new stopwatch
    const stopwatch = {
      name: name,
      startTime: Date.now(),
      elapsed: 0,
      running: true,
      created: Date.now()
    }

    userStopwatches.push(stopwatch)
    client.stopwatches.set(msg.author.id, userStopwatches)

    const embed = new Embed()
      .setTitle('▶️ Stopwatch Started')
      .setDescription(`Stopwatch **${name}** has been started!`)
      .setColor('#00ff00')

    msg.channel.send({ embeds: [embed] })

  } else if (subCommand === 'stop' || subCommand === 'pause') {
    if (args.length < 2) {
      return msg.reply('Usage: `!stopwatch stop <number or name>`')
    }

    const identifier = args.slice(1).join(' ')
    const userStopwatches = client.stopwatches.get(msg.author.id) || []
    
    let stopwatch
    if (/^\d+$/.test(identifier)) {
      const index = parseInt(identifier) - 1
      if (index >= 0 && index < userStopwatches.length) {
        stopwatch = userStopwatches[index]
      }
    } else {
      stopwatch = userStopwatches.find(sw => sw.name === identifier)
    }

    if (!stopwatch) {
      return msg.reply('Stopwatch not found!')
    }

    if (!stopwatch.running) {
      return msg.reply(`Stopwatch **${stopwatch.name}** is already stopped!`)
    }

    // Stop the stopwatch
    stopwatch.elapsed = (stopwatch.elapsed || 0) + (Date.now() - stopwatch.startTime)
    stopwatch.running = false
    client.stopwatches.set(msg.author.id, userStopwatches)

    const embed = new Embed()
      .setTitle('⏸️ Stopwatch Stopped')
      .setDescription(`Stopwatch **${stopwatch.name}** has been stopped!`)
      .addField('Total Time', formatDuration(stopwatch.elapsed), false)
      .setColor('#ff6600')

    msg.channel.send({ embeds: [embed] })

  } else if (subCommand === 'reset') {
    if (args.length < 2) {
      return msg.reply('Usage: `!stopwatch reset <number or name>`')
    }

    const identifier = args.slice(1).join(' ')
    const userStopwatches = client.stopwatches.get(msg.author.id) || []
    
    let stopwatch
    if (/^\d+$/.test(identifier)) {
      const index = parseInt(identifier) - 1
      if (index >= 0 && index < userStopwatches.length) {
        stopwatch = userStopwatches[index]
      }
    } else {
      stopwatch = userStopwatches.find(sw => sw.name === identifier)
    }

    if (!stopwatch) {
      return msg.reply('Stopwatch not found!')
    }

    // Reset the stopwatch
    stopwatch.startTime = Date.now()
    stopwatch.elapsed = 0
    stopwatch.running = false
    client.stopwatches.set(msg.author.id, userStopwatches)

    const embed = new Embed()
      .setTitle('🔄 Stopwatch Reset')
      .setDescription(`Stopwatch **${stopwatch.name}** has been reset!`)
      .setColor('#0099ff')

    msg.channel.send({ embeds: [embed] })

  } else if (subCommand === 'delete' || subCommand === 'remove') {
    if (args.length < 2) {
      return msg.reply('Usage: `!stopwatch delete <number or name>`')
    }

    const identifier = args.slice(1).join(' ')
    const userStopwatches = client.stopwatches.get(msg.author.id) || []
    
    let index = -1
    if (/^\d+$/.test(identifier)) {
      index = parseInt(identifier) - 1
    } else {
      index = userStopwatches.findIndex(sw => sw.name === identifier)
    }

    if (index < 0 || index >= userStopwatches.length) {
      return msg.reply('Stopwatch not found!')
    }

    const deleted = userStopwatches.splice(index, 1)[0]
    client.stopwatches.set(msg.author.id, userStopwatches)

    const embed = new Embed()
      .setTitle('🗑️ Stopwatch Deleted')
      .setDescription(`Stopwatch **${deleted.name}** has been deleted!`)
      .setColor('#ff0000')

    msg.channel.send({ embeds: [embed] })

  } else if (subCommand === 'time' || subCommand === 'check') {
    if (args.length < 2) {
      return msg.reply('Usage: `!stopwatch time <number or name>`')
    }

    const identifier = args.slice(1).join(' ')
    const userStopwatches = client.stopwatches.get(msg.author.id) || []
    
    let stopwatch
    if (/^\d+$/.test(identifier)) {
      const index = parseInt(identifier) - 1
      if (index >= 0 && index < userStopwatches.length) {
        stopwatch = userStopwatches[index]
      }
    } else {
      stopwatch = userStopwatches.find(sw => sw.name === identifier)
    }

    if (!stopwatch) {
      return msg.reply('Stopwatch not found!')
    }

    let elapsed
    if (stopwatch.running) {
      elapsed = Date.now() - stopwatch.startTime + (stopwatch.elapsed || 0)
    } else {
      elapsed = stopwatch.elapsed || 0
    }

    const status = stopwatch.running ? '🟢 Running' : '🔴 Stopped'

    const embed = new Embed()
      .setTitle(`⏱️ ${stopwatch.name}`)
      .setDescription(`${status}`)
      .addField('Elapsed Time', formatDuration(elapsed), false)
      .setColor(stopwatch.running ? '#00ff00' : '#ff6600')

    msg.channel.send({ embeds: [embed] })

  } else {
    const helpEmbed = new Embed()
      .setTitle('⏱️ Stopwatch Commands')
      .setDescription('Manage your personal stopwatches!')
      .addField('`!stopwatch start [name]`', 'Start a new stopwatch', false)
      .addField('`!stopwatch stop <name/number>`', 'Stop/pause a stopwatch', false)
      .addField('`!stopwatch reset <name/number>`', 'Reset a stopwatch', false)
      .addField('`!stopwatch time <name/number>`', 'Check stopwatch time', false)
      .addField('`!stopwatch delete <name/number>`', 'Delete a stopwatch', false)
      .addField('`!stopwatch list`', 'Show all stopwatches', false)
      .setColor('#0099ff')

    msg.channel.send({ embeds: [helpEmbed] })
  }
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const h = hours
  const m = minutes % 60
  const s = seconds % 60
  const ms_remaining = Math.floor((ms % 1000) / 10) // 2 decimal places

  if (hours > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms_remaining.toString().padStart(2, '0')}`
  } else if (minutes > 0) {
    return `${m}:${s.toString().padStart(2, '0')}.${ms_remaining.toString().padStart(2, '0')}`
  } else {
    return `${s}.${ms_remaining.toString().padStart(2, '0')}s`
  }
}
