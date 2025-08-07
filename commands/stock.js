const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['stock', 'stocks', '주식']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!stock <symbol>`\nExample: `!stock AAPL` or `!stock 005930` (Samsung)')
  }

  const symbol = args[0].toUpperCase()

  try {
    // Using Alpha Vantage API (free tier available)
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY || 'demo'}`
    )
    
    const data = await response.json()
    const quote = data['Global Quote']

    if (!quote || Object.keys(quote).length === 0) {
      return msg.reply('Stock symbol not found! Please check the symbol and try again.')
    }

    const price = parseFloat(quote['05. price'])
    const change = parseFloat(quote['09. change'])
    const changePercent = quote['10. change percent'].replace('%', '')
    const volume = parseInt(quote['06. volume']).toLocaleString()
    const high = parseFloat(quote['03. high'])
    const low = parseFloat(quote['04. low'])
    const open = parseFloat(quote['02. open'])
    const previousClose = parseFloat(quote['08. previous close'])

    const isPositive = change >= 0
    const color = isPositive ? '#00ff00' : '#ff0000'
    const arrow = isPositive ? '📈' : '📉'

    const embed = new Embed()
      .setTitle(`${arrow} ${quote['01. symbol']} Stock Info`)
      .setColor(color)
      .addField('Current Price', `$${price.toFixed(2)}`, true)
      .addField('Change', `${isPositive ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`, true)
      .addField('Volume', volume, true)
      .addField('Open', `$${open.toFixed(2)}`, true)
      .addField('High', `$${high.toFixed(2)}`, true)
      .addField('Low', `$${low.toFixed(2)}`, true)
      .addField('Previous Close', `$${previousClose.toFixed(2)}`, true)
      .addField('Last Updated', quote['07. latest trading day'], true)
      .setFooter('Data provided by Alpha Vantage')

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('Stock API error:', error)
    msg.reply('Failed to fetch stock information. Please try again.')
  }
}
