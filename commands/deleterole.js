const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['deleterole', '역할삭제']
module.exports.run = async (client, msg) => {
  if (!msg.member.permissions.has('MANAGE_ROLES')) {
    return msg.reply('You need the "Manage Roles" permission to use this command!')
  }

  const args = msg.content.split(' ').slice(1)
  if (!args.length) {
    return msg.reply(`Usage: \`${client.settings.prefix}deleterole <@role|roleID|role_name>\``)
  }

  let role
  const roleMention = args[0].match(/^<@&(\d+)>$/)
  if (roleMention) {
    role = await msg.guild.roles.get(roleMention[1])
  } else if (/^\d+$/.test(args[0])) {
    role = await msg.guild.roles.get(args[0])
  } else {
    const roleName = args.join(' ')
    role = msg.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase())
  }

  if (!role) {
    return msg.reply('Role not found!')
  }

  if (role.managed) {
    return msg.reply('Cannot delete a managed role!')
  }

  try {
    const roleName = role.name
    await role.delete()

    const embed = new Embed()
      .setTitle('✅ Role Deleted')
      .setDescription(`Role **${roleName}** has been deleted!`)
      .setColor('#ff0000')

    msg.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Delete role error:', error)
    msg.reply('Failed to delete role. Make sure the bot has proper permissions and the role is below the bot\'s highest role.')
  }
}
