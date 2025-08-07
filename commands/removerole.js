const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['removerole', 'takerole', '역할제거']
module.exports.run = async (client, msg) => {
  if (!msg.member.permissions.has('MANAGE_ROLES')) {
    return msg.reply('You need the "Manage Roles" permission to use this command!')
  }

  const args = msg.content.split(' ').slice(1)
  if (args.length < 2) {
    return msg.reply(`Usage: \`${client.settings.prefix}removerole <@user|userID> <@role|roleID|role_name>\``)
  }

  let targetUser
  const userMention = args[0].match(/^<@!?(\d+)>$/)
  if (userMention) {
    targetUser = await msg.guild.members.get(userMention[1])
  } else {
    targetUser = await msg.guild.members.get(args[0])
  }

  if (!targetUser) {
    return msg.reply('User not found!')
  }

  let role
  const roleMention = args[1].match(/^<@&(\d+)>$/)
  if (roleMention) {
    role = await msg.guild.roles.get(roleMention[1])
  } else if (/^\d+$/.test(args[1])) {
    role = await msg.guild.roles.get(args[1])
  } else {
    const roleName = args.slice(1).join(' ')
    role = msg.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase())
  }

  if (!role) {
    return msg.reply('Role not found!')
  }

  try {
    await targetUser.roles.remove(role)

    const embed = new Embed()
      .setTitle('✅ Role Removed')
      .setDescription(`Role **${role.name}** has been removed from **${targetUser.displayName}**`)
      .addField('User', `${targetUser.user.username}#${targetUser.user.discriminator}`, true)
      .addField('Role', role.name, true)
      .setColor('#ff0000')

    msg.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Remove role error:', error)
    msg.reply('Failed to remove role. Make sure the bot has proper permissions.')
  }
}
