const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['help', 'commands', 'cmd', '도움말', '명령어']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  const category = args[0]?.toLowerCase()

  if (!category) {
    // Main help menu
    const embed = new Embed()
      .setTitle('🤖 Bot Commands Help')
      .setDescription(`Use \`n4help <category>\` for detailed commands in each category.`)
      .setColor('#0099ff')
      .addField('🎵 Music', '`n4help music` - Music playback and controls', false)
      .addField('👥 Moderation', '`n4help moderation` - Server management tools', false)
      .addField('👤 Roles', '`n4help roles` - Role management system', false)
      .addField('💤 AFK', '`n4help afk` - Away from keyboard system', false)
      .addField('📊 Levels', '`n4help levels` - Experience and ranking system', false)
      .addField('⏰ Time', '`n4help time` - Timers, reminders, and utilities', false)
      .addField('🎮 Gaming', '`n4help gaming` - Game profile lookups', false)
      .addField('💰 Finance', '`n4help finance` - Stocks and cryptocurrency', false)
      .addField('🎵 Lyrics', '`n4help lyrics` - Song lyrics search', false)
      .addField('📋 Logging', '`n4help logging` - Message logging system', false)
      .addField('ℹ️ Info', '`n4help info` - Server and user information', false)
      .addField('🎲 Fun', '`n4help fun` - Entertainment commands', false)
      .setFooter(`Bot Prefix: n4 | Total Commands: 50+`)

    return msg.channel.send({ embeds: [embed] })
  }

  let embed = new Embed().setColor('#0099ff')

  switch (category) {
    case 'music':
    case 'musics':
    case '음악':
      embed.setTitle('🎵 Music Commands')
        .setDescription('Control music playback in voice channels')
        .addField('Basic Controls', 
          '`n4play <song>` - Play music from YouTube\n' +
          '`n4stop` - Stop music and clear queue\n' +
          '`n4skip` - Skip current song\n' +
          '`n4pause` - Pause current song\n' +
          '`n4resume` - Resume paused song', false)
        .addField('Queue Management', 
          '`n4queue` - Show current music queue\n' +
          '`n4nowplaying` - Show currently playing song\n' +
          '`n4search <query>` - Search for songs\n' +
          '`n4volume <1-100>` - Set volume level', false)
        .addField('Charts', 
          '`n4spotify` - Show Spotify charts\n' +
          '`n4applemusic` - Show Apple Music charts\n' +
          '`n4melon` - Show Melon charts', false)
      break

    case 'moderation':
    case 'mod':
    case '관리':
      embed.setTitle('👥 Moderation Commands')
        .setDescription('Server management and moderation tools')
        .addField('User Management', 
          '`n4ban <user> [reason]` - Ban a user\n' +
          '`n4unban <userID>` - Unban a user\n' +
          '`n4kick <user> [reason]` - Kick a user\n' +
          '`n4mute <user> [time] [reason]` - Mute a user\n' +
          '`n4unmute <user>` - Unmute a user', false)
        .addField('Channel Management', 
          '`n4clear <amount>` - Clear messages\n' +
          '`n4addchannel <name> [type]` - Create a channel', false)
        .addField('Required Permissions', 'Most commands require appropriate server permissions', false)
      break

    case 'roles':
    case 'role':
    case '역할':
      embed.setTitle('👤 Role Management Commands')
        .setDescription('Create and manage server roles')
        .addField('Role Creation', 
          '`n4addrole <name> [color] [mentionable]` - Create a new role\n' +
          '`n4deleterole <role>` - Delete a role\n' +
          '`n4listroles` - List all server roles', false)
        .addField('Role Assignment', 
          '`n4giverole <user> <role>` - Give role to user\n' +
          '`n4removerole <user> <role>` - Remove role from user\n' +
          '`n4roleinfo <role>` - Show role information', false)
        .addField('Note', 'Requires "Manage Roles" permission', false)
      break

    case 'afk':
    case '자리비움':
      embed.setTitle('💤 AFK System Commands')
        .setDescription('Away from keyboard status management')
        .addField('AFK Commands', 
          '`n4afk [reason]` - Set AFK status\n' +
          '`n4unafk` - Remove AFK status', false)
        .addField('Features', 
          '• Automatic nickname update with [AFK] prefix\n' +
          '• Mention notifications when AFK users are mentioned\n' +
          '• Welcome back messages with AFK duration\n' +
          '• Automatic AFK removal when sending messages', false)
      break

    case 'levels':
    case 'level':
    case 'xp':
    case '레벨':
      embed.setTitle('📊 Level System Commands')
        .setDescription('Experience points and ranking system')
        .addField('Level Commands', 
          '`n4level` - Show your level stats\n' +
          '`n4level <user>` - Show user\'s level\n' +
          '`n4level leaderboard` - Show server leaderboard', false)
        .addField('How it Works', 
          '• Gain 15-25 XP per message (1 minute cooldown)\n' +
          '• Level up when reaching XP thresholds\n' +
          '• Server-wide ranking system\n' +
          '• Automatic level up notifications', false)
      break

    case 'time':
    case 'timer':
    case 'reminder':
    case '시간':
      embed.setTitle('⏰ Time Management Commands')
        .setDescription('Timers, reminders, and time utilities')
        .addField('D-Day System', 
          '`n4dday` - Show your D-Days\n' +
          '`n4dday add <name> <YYYY-MM-DD>` - Add D-Day\n' +
          '`n4dday remove <number>` - Remove D-Day', false)
        .addField('Reminders', 
          '`n4remind <time> <message>` - Set reminder\n' +
          '`n4remind list` - Show active reminders\n' +
          '`n4remind remove <number>` - Remove reminder', false)
        .addField('Timers & Stopwatch', 
          '`n4timer <time> [name]` - Start timer\n' +
          '`n4timer list` - Show active timers\n' +
          '`n4stopwatch start [name]` - Start stopwatch\n' +
          '`n4stopwatch stop <name>` - Stop stopwatch', false)
        .addField('Time Format', 'Examples: 5m, 1h30m, 2d (s=seconds, m=minutes, h=hours, d=days)', false)
      break

    case 'gaming':
    case 'games':
    case '게임':
      embed.setTitle('🎮 Gaming Profile Commands')
        .setDescription('Look up gaming profiles and stats')
        .addField('PC Gaming', 
          '`n4steam <username>` - Steam profile stats\n' +
          '`n4battlenet <battletag> [region]` - Overwatch stats\n' +
          '`n4github <username>` - GitHub profile\n' +
          '`n4epic <username>` - Epic Games/Fortnite stats', false)
        .addField('Other Platforms', 
          '`n4lol <summoner> [region]` - League of Legends\n' +
          '`n4roblox <username>` - Roblox profile\n' +
          '`n4twitch <channel>` - Twitch channel info\n' +
          '`n4osu <username>` - osu! player stats', false)
        .addField('Minecraft', 
          '`n4minecraft <server>` - Server status check', false)
      break

    case 'finance':
    case 'money':
    case 'stock':
    case '금융':
      embed.setTitle('💰 Financial Information Commands')
        .setDescription('Stock market and cryptocurrency data')
        .addField('Stock Market', 
          '`n4stock <symbol>` - Get stock information\n' +
          'Examples: `n4stock AAPL`, `n4stock TSLA`', false)
        .addField('Cryptocurrency', 
          '`n4crypto <symbol>` - Get crypto information\n' +
          'Examples: `n4crypto BTC`, `n4crypto ETH`', false)
        .addField('Data Includes', 
          '• Current price and 24h change\n' +
          '• Market cap and trading volume\n' +
          '• Korean Won (KRW) prices for crypto\n' +
          '• Real-time market data', false)
      break

    case 'lyrics':
    case 'lyric':
    case '가사':
      embed.setTitle('🎵 Lyrics Search Commands')
        .setDescription('Find song lyrics')
        .addField('Lyrics Command', 
          '`n4lyrics <artist> - <song>` - Search for lyrics\n' +
          'Example: `n4lyrics BTS - Dynamite`', false)
        .addField('Features', 
          '• Multiple API sources for better results\n' +
          '• Automatic text truncation for Discord\n' +
          '• Fallback search systems', false)
      break

    case 'logging':
    case 'logs':
    case '로깅':
      embed.setTitle('📋 Logging System Commands')
        .setDescription('Message logging and moderation tracking')
        .addField('Setup Commands', 
          '`n4setlog #channel` - Set log channel\n' +
          '`n4setlog disable` - Disable logging\n' +
          '`n4setlog` - Show current log channel', false)
        .addField('Logged Events', 
          '• Message deletions with content\n' +
          '• Message edits with before/after\n' +
          '• Attachment and embed information\n' +
          '• User and channel details', false)
        .addField('Required Permissions', 'Requires "Manage Server" permission to set up', false)
      break

    case 'info':
    case 'information':
    case '정보':
      embed.setTitle('ℹ️ Information Commands')
        .setDescription('Server and user information')
        .addField('User Information', 
          '`n4userinfo [user]` - Show user details\n' +
          '`n4userlist` - List all server members', false)
        .addField('Server Information', 
          '`n4serverinfo` - Show server details\n' +
          '`n4roleinfo <role>` - Show role information', false)
        .addField('Bot Information', 
          '`n4info` - Bot information\n' +
          '`n4ping` - Bot latency\n' +
          '`n4uptime` - Bot uptime', false)
      break

    case 'fun':
    case 'entertainment':
    case '재미':
      embed.setTitle('🎲 Fun Commands')
        .setDescription('Entertainment and utility commands')
        .addField('Random & Fun', 
          '`n4randomcolor` - Generate random color\n' +
          '`n4hangang` - Han River temperature', false)
        .addField('Utilities', 
          '`n4invite` - Get bot invite link', false)
      break

    default:
      embed.setTitle('❓ Category Not Found')
        .setDescription('Available categories: music, moderation, roles, afk, levels, time, gaming, finance, lyrics, logging, info, fun')
        .setColor('#ff0000')
  }

  msg.channel.send({ embeds: [embed] })
}
