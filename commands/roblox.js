const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['roblox', 'rbx', '로블록스']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!roblox <username>`')
  }

  const username = args[0]

  try {
    // Get user ID from username
    const userResponse = await fetch(`https://api.roblox.com/users/get-by-username?username=${encodeURIComponent(username)}`)
    const userData = await userResponse.json()

    if (userData.errorMessage || !userData.Id) {
      return msg.reply('Roblox user not found!')
    }

    const userId = userData.Id

    // Get detailed user info
    const detailResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`)
    const detailData = await detailResponse.json()

    // Get user avatar
    const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`)
    const avatarData = await avatarResponse.json()

    // Get user's friends count
    const friendsResponse = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends/count`)
    const friendsData = await friendsResponse.json()

    // Get user's followers count
    const followersResponse = await fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`)
    const followersData = await followersResponse.json()

    // Get user's following count
    const followingResponse = await fetch(`https://friends.roblox.com/v1/users/${userId}/followings/count`)
    const followingData = await followingResponse.json()

    const embed = new Embed()
      .setTitle(`🟦 Roblox Profile: ${detailData.displayName}`)
      .setColor('#00a2ff')
      .addField('Username', `@${detailData.name}`, true)
      .addField('Display Name', detailData.displayName, true)
      .addField('User ID', userId.toString(), true)
      .addField('Account Created', new Date(detailData.created).toLocaleDateString(), true)
      .addField('Friends', friendsData.count?.toString() || '0', true)
      .addField('Followers', followersData.count?.toString() || '0', true)
      .addField('Following', followingData.count?.toString() || '0', true)

    if (detailData.description) {
      embed.addField('Description', detailData.description.substring(0, 200) + (detailData.description.length > 200 ? '...' : ''), false)
    }

    if (avatarData.data && avatarData.data[0] && avatarData.data[0].imageUrl) {
      embed.setThumbnail(avatarData.data[0].imageUrl)
    }

    // Get user's badges (optional)
    try {
      const badgesResponse = await fetch(`https://badges.roblox.com/v1/users/${userId}/badges?limit=10&sortOrder=Asc`)
      const badgesData = await badgesResponse.json()
      
      if (badgesData.data && badgesData.data.length > 0) {
        const badgeNames = badgesData.data.slice(0, 3).map(badge => badge.name).join(', ')
        embed.addField('Recent Badges', badgeNames + (badgesData.data.length > 3 ? '...' : ''), false)
      }
    } catch (badgeError) {
      console.log('Could not fetch badges:', badgeError.message)
    }

    embed.addField('Profile URL', `[View Profile](https://www.roblox.com/users/${userId}/profile)`, false)

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('Roblox API error:', error)
    msg.reply('Failed to fetch Roblox profile. Please check the username and try again.')
  }
}
