const { Embed } = require('@harmonyland/harmony')

module.exports.aliases = ['addrole', 'createrole', '역할생성']
module.exports.run = async (client, msg) => {
  if (!msg.member.permissions.has('MANAGE_ROLES')) {
    return msg.reply('You need the "Manage Roles" permission to use this command!')
  }

  const args = msg.content.split(' ').slice(1)
  if (!args.length) {
    return msg.reply(`Usage: \`${client.settings.prefix}addrole <role_name> [color] [mentionable]\``)
  }

  const roleName = args[0]
  const roleColor = args[1] || '#000000'
  const mentionable = args[2] === 'true' || args[2] === 'yes'

  try {
    const role = await msg.guild.roles.create({
      name: roleName,
      color: roleColor,
      mentionable: mentionable,
      permissions: []
    })

    const embed = new Embed()
      .setTitle('✅ Role Created')
      .setDescription(`Role **${role.name}** has been created!`)
      .addField('Role ID', role.id, true)
      .addField('Color', roleColor, true)
      .addField('Mentionable', mentionable ? 'Yes' : 'No', true)
      .setColor(roleColor)

    msg.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Create role error:', error)
    msg.reply('Failed to create role. Make sure the bot has proper permissions.')
  }
}
