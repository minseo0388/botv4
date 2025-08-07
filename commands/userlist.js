const fs = require('fs')
module.exports.aliases = ['userlist', 'ul']
module.exports.run = async (client, msg) => {
  // Check if user is bot owner or has admin permissions
  const isOwner = client.settings.owners?.includes(msg.author.id) || msg.author.id === msg.guild.ownerID
  if (!isOwner && !msg.member.permissions.has('ADMINISTRATOR')) {
    return msg.reply('You have no permission!')
  }
  
  try {
    const members = await msg.guild.members.array()
    const memberList = members.map(member => ({
      username: member.user.username,
      displayName: member.displayName || member.user.username,
      id: member.id,
      joinedAt: member.joinedAt
    }))
    
    const guildData = {
      guildName: msg.guild.name,
      guildId: msg.guild.id,
      memberCount: members.length,
      members: memberList
    }
    
    // Save to file
    fs.writeFileSync('userlist.json', JSON.stringify(guildData, null, 2))
    
    msg.reply(`User list saved! Found ${members.length} members in ${msg.guild.name}`)
  } catch (error) {
    console.error(error)
    msg.reply('Failed to generate user list.')
  }
}
