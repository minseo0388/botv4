const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch') // You'll need to install: npm install node-fetch

module.exports.aliases = ['osu', 'o']
module.exports.run = async (client, msg) => {
    const args = msg.content.split(' ')
    const username = args[1]
    if (!username) return msg.channel.send('Please write your osu username! Example: `!osu peppy`')
    
    try {
        // Using osu! API v2 (requires API key)
        const apiKey = client.settings.osuApiKey || process.env.OSU_API_KEY
        if (!apiKey) {
            return msg.channel.send('OSU API key not configured. Please set `osuApiKey` in settings.json or OSU_API_KEY environment variable.')
        }
        
        const response = await fetch(`https://osu.ppy.sh/api/get_user?k=${apiKey}&u=${username}`)
        const data = await response.json()
        
        if (!data || data.length === 0) {
            return msg.channel.send('User not found!')
        }
        
        const user = data[0]
        const embed = new Embed()
            .setThumbnail(`http://s.ppy.sh/a/${user.user_id}`)
            .setColor('#D0436A')
            .setTitle(`osu! Profile: ${user.username}`)
            .addField('PP', Math.round(user.pp_raw) || 'N/A', true)
            .addField('Global Rank', `#${user.pp_rank}` || 'N/A', true)
            .addField('Country Rank', `#${user.pp_country_rank}` || 'N/A', true)
            .addField('Level', Math.round(user.level) || 'N/A', true)
            .addField('Country', user.country || 'N/A', true)
            .addField('Play Count', user.playcount || 'N/A', true)
            .addField('Accuracy', `${parseFloat(user.accuracy).toFixed(2)}%` || 'N/A', true)
            .addField('Join Date', user.join_date || 'N/A', true)
            .setFooter(`Requested by ${msg.author.tag}`, msg.author.avatarURL())
            .setTimestamp()
        
        msg.channel.send({ embeds: [embed] })
    } catch (error) {
        console.error('OSU API Error:', error)
        msg.channel.send('Failed to fetch osu! user data. Please try again later.')
    }
}
