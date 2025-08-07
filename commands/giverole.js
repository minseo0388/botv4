const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['giverole', 'assignrole', '역할부여']
module.exports.run = async (client, msg) => {
  if (!msg.member.permissions.has('MANAGE_ROLES')) {
    return msg.reply('You need the "Manage Roles" permission to use this command!')
  }

  const args = msg.content.split(' ').slice(1)
  if (args.length < 2) {
    return msg.reply(`Usage: \`${client.settings.prefix}giverole <@user|userID> <@role|roleID|role_name>\``)
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
    await targetUser.roles.add(role)

    const embed = new Embed()
      .setTitle('✅ Role Added')
      .setDescription(`Role **${role.name}** has been given to **${targetUser.displayName}**`)
      .addField('User', `${targetUser.user.username}#${targetUser.user.discriminator}`, true)
      .addField('Role', role.name, true)
      .setColor('#00ff00')

    msg.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Give role error:', error)
    msg.reply('Failed to give role. Make sure the bot has proper permissions and the role is below the bot\'s highest role.')
  }
}
