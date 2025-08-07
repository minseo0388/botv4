const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch') // You'll need to install: npm install node-fetch

module.exports.aliases = ['minecraft', 'mc']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ')
  const username = args[1]
  if (!username) return msg.channel.send('Please type a Minecraft username! Example: `!mc Notch`')
  
  try {
    const url = `https://api.mojang.com/users/profiles/minecraft/${username}`
    const response = await fetch(url)
    
    if (!response.ok) {
      return msg.channel.send('Minecraft account not found or API error occurred.')
    }
    
    const body = await response.json()
    
    if (body.id && body.name) {
      const url1 = `https://visage.surgeplay.com/full/512/${body.id}`
      const url2 = `https://visage.surgeplay.com/head/512/${body.id}`
      const url3 = `https://visage.surgeplay.com/face/512/${body.id}`
      
      const embed = new Embed()
        .setColor('#18B4E9')
        .setTimestamp()
        .setAuthor(`${msg.author.username}`, url3)
        .setTitle(`Minecraft account information about ${body.name}`)
        .addField('Username', body.name, true)
        .addField('UUID', body.id, true)
        .setThumbnail(url2)
        .setImage(url1)
        .setFooter(`Requested by ${msg.author.tag}`, msg.author.avatarURL())
      
      msg.channel.send({ embeds: [embed] })
    } else {
      msg.channel.send('Minecraft account not found')
    }
  } catch (error) {
    console.error('Minecraft API Error:', error)
    msg.channel.send('Error occurred while fetching Minecraft account information.')
  }
}
