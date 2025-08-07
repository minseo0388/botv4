const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['github', 'gh', '깃허브']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!github <username>`')
  }

  const username = args[0]

  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`)
    
    if (!userResponse.ok) {
      return msg.reply('GitHub user not found!')
    }

    const userData = await userResponse.json()

    // Get repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`)
    const reposData = await reposResponse.json()

    const embed = new Embed()
      .setTitle(`🐙 GitHub Profile: ${userData.name || userData.login}`)
      .setThumbnail(userData.avatar_url)
      .setColor('#24292e')
      .setDescription(userData.bio || 'No bio available')
      .addField('Username', userData.login, true)
      .addField('Public Repos', userData.public_repos.toString(), true)
      .addField('Followers', userData.followers.toString(), true)
      .addField('Following', userData.following.toString(), true)
      .addField('Account Created', new Date(userData.created_at).toLocaleDateString(), true)

    if (userData.location) {
      embed.addField('Location', userData.location, true)
    }

    if (userData.company) {
      embed.addField('Company', userData.company, true)
    }

    if (userData.blog) {
      embed.addField('Website', userData.blog, true)
    }

    // Add top repositories
    if (reposData.length > 0) {
      let repoText = ''
      reposData.slice(0, 3).forEach(repo => {
        const stars = repo.stargazers_count > 0 ? `⭐ ${repo.stargazers_count}` : ''
        const language = repo.language ? `📝 ${repo.language}` : ''
        repoText += `**[${repo.name}](${repo.html_url})**\n${repo.description || 'No description'}\n${stars} ${language}\n\n`
      })
      embed.addField('🔥 Top Repositories', repoText || 'No public repositories', false)
    }

    embed.addField('Profile URL', `[View on GitHub](${userData.html_url})`, false)

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('GitHub API error:', error)
    msg.reply('Failed to fetch GitHub profile. Please try again.')
  }
}
