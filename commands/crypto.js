const { Embed } = require('@harmonyland/harmony')
const fetch = require('node-fetch')

module.exports.aliases = ['crypto', 'bitcoin', 'btc', 'coin', '암호화폐', '비트코인']
module.exports.run = async (client, msg) => {
  const args = msg.content.split(' ').slice(1)
  
  if (!args.length) {
    return msg.reply('Usage: `!crypto <symbol>`\nExample: `!crypto BTC`, `!crypto ETH`, `!crypto ADA`')
  }

  const symbol = args[0].toUpperCase()

  try {
    // Using CoinGecko API (free)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${getCoinId(symbol)}&vs_currencies=usd,krw&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
    )
    
    const data = await response.json()
    const coinId = getCoinId(symbol)
    
    if (!data[coinId]) {
      return msg.reply('Cryptocurrency not found! Please check the symbol and try again.')
    }

    const coinData = data[coinId]
    const price = coinData.usd
    const priceKRW = coinData.krw
    const change24h = coinData.usd_24h_change
    const volume24h = coinData.usd_24h_vol
    const marketCap = coinData.usd_market_cap

    const isPositive = change24h >= 0
    const color = isPositive ? '#00ff00' : '#ff0000'
    const arrow = isPositive ? '📈' : '📉'

    // Get additional coin info
    const coinInfoResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`
    )
    const coinInfo = await coinInfoResponse.json()

    const embed = new Embed()
      .setTitle(`${arrow} ${coinInfo.name} (${symbol})`)
      .setThumbnail(coinInfo.image?.thumb)
      .setColor(color)
      .addField('Price (USD)', `$${price?.toLocaleString() || 'N/A'}`, true)
      .addField('Price (KRW)', `₩${priceKRW?.toLocaleString() || 'N/A'}`, true)
      .addField('24h Change', `${isPositive ? '+' : ''}${change24h?.toFixed(2) || 'N/A'}%`, true)
      .addField('24h Volume', `$${volume24h?.toLocaleString() || 'N/A'}`, true)
      .addField('Market Cap', `$${marketCap?.toLocaleString() || 'N/A'}`, true)
      .addField('Market Rank', `#${coinInfo.market_cap_rank || 'N/A'}`, true)

    if (coinInfo.description?.en) {
      const description = coinInfo.description.en.substring(0, 200) + '...'
      embed.addField('Description', description, false)
    }

    embed.setFooter('Data provided by CoinGecko')

    msg.channel.send({ embeds: [embed] })

  } catch (error) {
    console.error('Crypto API error:', error)
    msg.reply('Failed to fetch cryptocurrency information. Please try again.')
  }
}

function getCoinId(symbol) {
  const coinMap = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'LINK': 'chainlink',
    'XRP': 'ripple',
    'LTC': 'litecoin',
    'BCH': 'bitcoin-cash',
    'BNB': 'binancecoin',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'SOL': 'solana',
    'AVAX': 'avalanche-2',
    'MATIC': 'matic-network',
    'DOGE': 'dogecoin',
    'SHIB': 'shiba-inu',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
    'ALGO': 'algorand',
    'VET': 'vechain'
  }
  
  return coinMap[symbol] || symbol.toLowerCase()
}
