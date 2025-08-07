const { Embed } = require('@harmonyland/harmony')
module.exports.aliases = ['roleinfo', 'ri']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ')
  let role = msg.mentions.roles.array()[0] || await msg.guild.roles.get(args[0]) || await msg.guild.roles.find(role => role.name === args[0])
  if (!role) role = msg.member.roles.highest
  const embed = new Embed()
    .setColor(role.color)
    .setTitle(`Information about ${role.name}`)
    .addField('Members', (await role.fetchMembers()).size)
    .addField('Color', role.color)
    .addField('Creation Date', role.createdAt.toDateString())
    .addField('Modifiablity', role.editable.toString())
    .addField('Manage Access', role.managed.toString())
    .addField('ID', role.id)
  msg.channel.send({ embeds: [embed] })
}
