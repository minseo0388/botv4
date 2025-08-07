const fs = require('fs')
const path = require('path')

const logChannelsFile = path.join(__dirname, '../data/logChannels.json')

// Load log channels data
function loadLogChannels() {
  try {
    if (fs.existsSync(logChannelsFile)) {
      return JSON.parse(fs.readFileSync(logChannelsFile, 'utf8'))
    }
  } catch (error) {
    console.error('Error loading log channels:', error)
  }
  return {}
}

// Save log channels data
function saveLogChannels(data) {
  try {
    fs.writeFileSync(logChannelsFile, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving log channels:', error)
  }
}

// Initialize log channels from file
function initializeLogChannels(client) {
  const data = loadLogChannels()
  Object.entries(data).forEach(([guildId, channelId]) => {
    client.logChannels.set(guildId, channelId)
  })
}

// Save log channel setting
function setLogChannel(client, guildId, channelId) {
  client.logChannels.set(guildId, channelId)
  const data = loadLogChannels()
  data[guildId] = channelId
  saveLogChannels(data)
}

// Remove log channel setting
function removeLogChannel(client, guildId) {
  client.logChannels.delete(guildId)
  const data = loadLogChannels()
  delete data[guildId]
  saveLogChannels(data)
}

module.exports = {
  loadLogChannels,
  saveLogChannels,
  initializeLogChannels,
  setLogChannel,
  removeLogChannel
}
