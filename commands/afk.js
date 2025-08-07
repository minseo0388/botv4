const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['afk', 'away']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  const reason = args.join(' ') || 'No reason provided'

  client.afkUsers.set(msg.author.id, {
    reason: reason,
    time: Date.now(),
    guildId: msg.guild.id
  })

  const embed = new Embed()
    .setTitle('💤 AFK Status Set')
    .setDescription(`${msg.author} is now AFK: **${reason}**`)
    .setColor('#ffff00')
    .setTimestamp()

  msg.channel.send({ embeds: [embed] })

  // Try to add [AFK] prefix to nickname
  try {
    if (msg.member.nickname) {
      if (!msg.member.nickname.startsWith('[AFK]')) {
        await msg.member.setNickname(`[AFK] ${msg.member.nickname}`)
      }
    } else {
      await msg.member.setNickname(`[AFK] ${msg.author.username}`)
    }
  } catch (error) {
    console.log('Could not change nickname:', error.message)
  }
}
