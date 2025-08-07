const { Embed } = require('@harmonyland/harmony')
module.exports.aliases = ['userinfo', 'iu']
module.exports.run = (client, msg) => {
  const args = msg.content.split(' ')
  function senduserinfo (user) {
    embed.setAuthor('User Information')
      .setColor('#1e90ff')
      .setAuthor(user.username)
      .setDescription(`Information of ${user.username}`)
      .setThumbnail(user.avatarURL())
      .addField('Name:', `${user.tag}`)
      .addField('ID:', `${user.id}`)
      .addField('Creation Date:', user.createdAt)
    msg.channel.send({ embeds: [embed] })
  }
  const embed = new Embed()
  if (args.length === 1) {
    const user = msg.author
    senduserinfo(user)
  } else if (args.length === 2) {
    const user = msg.mentions.users.array()[0]
    senduserinfo(user)
  } else {
    msg.channel.send('Too much factors.')
  }
}
