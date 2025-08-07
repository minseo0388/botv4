const { Embed } = require('@harmonyland/harmony')
module.exports.aliases = ['serverinfo', 'is']
module.exports.run = async (client, msg) => {
  const serverembed = new Embed()
    .setDescription('Server Information')
    .setColor('#1e90ff')
    .setThumbnail(msg.guild.iconURL())
    .addField('Name', msg.guild.name)
    .addField('Creation Date', msg.guild.createdAt)
    .addField('Join Date', msg.member.joinedAt)
    .addField('Number of Member', msg.guild.memberCount)
  // .addField("Role", msg.guild.cache.role.reduce((role, result) => result += role + ' '))
    .addField('Owner', (await msg.guild.fetchOwner()).user.tag)
    .addField('Channel', msg.guild.channels.size)
    .addField('ID', msg.guild.id)
  msg.channel.send({ embeds: [serverembed] })
}
