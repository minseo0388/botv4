const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['listroles', 'roles', '역할목록']
module.exports.run = async (client, msg) => {
  const roles = msg.guild.roles.cache
    .filter(role => role.name !== '@everyone')
    .sort((a, b) => b.position - a.position)

  if (roles.size === 0) {
    return msg.reply('No roles found in this server!')
  }

  const embed = new Embed()
    .setTitle(`📋 Roles in ${msg.guild.name}`)
    .setColor('#0099ff')
    .setFooter(`Total: ${roles.size} roles`)

  let description = ''
  roles.forEach(role => {
    const memberCount = role.members.size
    description += `${role} - \`${role.name}\` (${memberCount} members)\n`
  })

  if (description.length > 2048) {
    description = description.substring(0, 2045) + '...'
  }

  embed.setDescription(description)
  msg.channel.send({ embeds: [embed] })
}
