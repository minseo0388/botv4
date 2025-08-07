const { Embed } = require('@harmonyland/harmony')
const fs = require('fs')
const path = require('path')

const levelsFile = path.join(__dirname, '../data/levels.json')

// Ensure data directory exists
if (!fs.existsSync(path.dirname(levelsFile))) {
  fs.mkdirSync(path.dirname(levelsFile), { recursive: true })
}

// Load or create levels data
function loadLevels() {
  try {
    if (fs.existsSync(levelsFile)) {
      return JSON.parse(fs.readFileSync(levelsFile, 'utf8'))
    }
  } catch (error) {
    console.error('Error loading levels:', error)
  }
  return {}
}

function saveLevels(data) {
  try {
    fs.writeFileSync(levelsFile, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving levels:', error)
  }
}

function calculateLevel(xp) {
  return Math.floor(0.1 * Math.sqrt(xp))
}

function calculateXPForLevel(level) {
  return Math.pow(level / 0.1, 2)
}

function addXP(userId, guildId, amount) {
  const levels = loadLevels()
  const key = `${guildId}-${userId}`
  
  if (!levels[key]) {
    levels[key] = { xp: 0, level: 0, lastMessage: 0 }
  }
  
  const oldLevel = levels[key].level
  levels[key].xp += amount
  levels[key].level = calculateLevel(levels[key].xp)
  levels[key].lastMessage = Date.now()
  
  saveLevels(levels)
  
  return {
    oldLevel,
    newLevel: levels[key].level,
    totalXP: levels[key].xp,
    levelUp: levels[key].level > oldLevel
  }
}

module.exports.aliases = ['level', 'lvl', 'rank', '레벨', '랭크']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  const subCommand = args[0]?.toLowerCase()

  if (subCommand === 'leaderboard' || subCommand === 'lb' || subCommand === '순위') {
    // Show leaderboard
    const levels = loadLevels()
    const guildData = Object.entries(levels)
      .filter(([key]) => key.startsWith(`${msg.guild.id}-`))
      .map(([key, data]) => ({
        userId: key.split('-')[1],
        ...data
      }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10)

    if (guildData.length === 0) {
      return msg.reply('No level data found for this server!')
    }

    const embed = new Embed()
      .setTitle(`🏆 Level Leaderboard - ${msg.guild.name}`)
      .setColor('#ffd700')

    let description = ''
    for (let i = 0; i < guildData.length; i++) {
      const userData = guildData[i]
      const user = await client.users.get(userData.userId)
      const username = user ? user.username : 'Unknown User'
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
      
      description += `${medal} **${username}** - Level ${userData.level} (${userData.xp} XP)\n`
    }

    embed.setDescription(description)
    return msg.channel.send({ embeds: [embed] })
  }

  // Show user level
  let targetUser = msg.author
  if (args.length > 0 && !['leaderboard', 'lb', '순위'].includes(subCommand)) {
    const mention = args[0].match(/^<@!?(\d+)>$/)
    if (mention) {
      targetUser = await client.users.get(mention[1])
    } else if (/^\d+$/.test(args[0])) {
      targetUser = await client.users.get(args[0])
    }
  }

  if (!targetUser) {
    return msg.reply('User not found!')
  }

  const levels = loadLevels()
  const key = `${msg.guild.id}-${targetUser.id}`
  const userData = levels[key] || { xp: 0, level: 0 }

  const currentLevel = userData.level
  const currentXP = userData.xp
  const currentLevelXP = calculateXPForLevel(currentLevel)
  const nextLevelXP = calculateXPForLevel(currentLevel + 1)
  const progressXP = currentXP - currentLevelXP
  const neededXP = nextLevelXP - currentLevelXP

  const progressPercentage = Math.round((progressXP / neededXP) * 100)
  const progressBar = '█'.repeat(Math.floor(progressPercentage / 5)) + '░'.repeat(20 - Math.floor(progressPercentage / 5))

  const embed = new Embed()
    .setTitle(`📊 Level Stats for ${targetUser.username}`)
    .setThumbnail(targetUser.avatarURL())
    .setColor('#00ff88')
    .addField('Current Level', currentLevel.toString(), true)
    .addField('Total XP', currentXP.toString(), true)
    .addField('XP to Next Level', `${progressXP}/${neededXP}`, true)
    .addField('Progress', `${progressBar} ${progressPercentage}%`, false)

  // Get user rank in server
  const guildData = Object.entries(levels)
    .filter(([key]) => key.startsWith(`${msg.guild.id}-`))
    .sort(([,a], [,b]) => b.xp - a.xp)
  
  const userRank = guildData.findIndex(([key]) => key === `${msg.guild.id}-${targetUser.id}`) + 1
  
  if (userRank > 0) {
    embed.addField('Server Rank', `#${userRank} of ${guildData.length}`, true)
  }

  msg.channel.send({ embeds: [embed] })
}

// Message XP handler - call this from onMessage.js
module.exports.handleMessage = (client, msg) => {
  if (msg.author.bot || !msg.guild) return

  const levels = loadLevels()
  const key = `${msg.guild.id}-${msg.author.id}`
  const userData = levels[key] || { lastMessage: 0 }

  // Prevent spam (1 minute cooldown)
  if (Date.now() - userData.lastMessage < 60000) return

  // Random XP between 15-25
  const xpGained = Math.floor(Math.random() * 11) + 15
  const result = addXP(msg.author.id, msg.guild.id, xpGained)

  if (result.levelUp) {
    const embed = new Embed()
      .setTitle('🎉 Level Up!')
      .setDescription(`${msg.author} reached level **${result.newLevel}**!`)
      .setColor('#00ff00')
      .setThumbnail(msg.author.avatarURL())

    msg.channel.send({ embeds: [embed] })
  }
}
