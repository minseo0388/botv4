const { Embed } = require('@harmonyland/harmony')
const YouTube = require('youtube-sr').default

module.exports.aliases = ['search', 'find', '검색']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  if (!args.length) {
    return msg.reply('Please provide a search query!')
  }

  const query = args.join(' ')
  
  try {
    const searchResults = await YouTube.search(query, { limit: 10 })
    
    if (!searchResults.length) {
      return msg.reply('No results found for your search!')
    }

    const embed = new Embed()
      .setTitle('🔍 YouTube Search Results')
      .setDescription(`Search results for: **${query}**`)
      .setColor('#FF0000')

    const resultsList = searchResults.slice(0, 5).map((video, index) => {
      const duration = video.duration ? formatDuration(video.duration) : 'Unknown'
      return `**${index + 1}.** [${video.title}](${video.url})\n` +
             `Channel: ${video.channel?.name || 'Unknown'}\n` +
             `Duration: ${duration}\n` +
             `Views: ${video.views?.toLocaleString() || 'N/A'}`
    }).join('\n\n')

    embed.addField('Results', resultsList)
    embed.setFooter('Use the play command with a song name or URL to add to queue')

    msg.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Search command error:', error)
    msg.reply('There was an error searching for videos!')
  }
}

function formatDuration(seconds) {
  if (!seconds) return 'Unknown'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}
