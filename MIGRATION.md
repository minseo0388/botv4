# Migration Guide from Discord.js to Harmony

This document outlines the key changes made when migrating this Discord bot from Discord.js to Harmony.

## Key Changes

### 1. Package Dependencies
- **Before**: `discord.js`
- **After**: `@harmonyland/harmony`

### 2. Client Setup
- **Before**: `new Client()` (simple constructor)
- **After**: `new Client({ intents: [...] })` (requires intents specification)

### 3. Authentication
- **Before**: `client.login(token)`
- **After**: `client.connect(token)`

### 4. Events
- **Before**: `'message'` event
- **After**: `'messageCreate'` event

### 5. Embeds
- **Before**: `MessageEmbed` from discord.js
- **After**: `Embed` from @harmonyland/harmony
- **Before**: `msg.channel.send(embed)`
- **After**: `msg.channel.send({ embeds: [embed] })`

### 6. Cache Access
- **Before**: `client.users.cache.get()`, `msg.guild.roles.cache.get()`
- **After**: `client.users.get()`, `msg.guild.roles.get()`

### 7. Permissions
- **Before**: `msg.member.hasPermission('PERMISSION_NAME')`
- **After**: `msg.member.permissions.has('PERMISSION_NAME')`

### 8. User/Member Properties
- **Before**: `user.displayAvatarURL`
- **After**: `user.avatarURL()`
- **Before**: `client.user.username`
- **After**: `client.user.tag`

### 9. Mentions
- **Before**: `msg.mentions.users.first()`
- **After**: `msg.mentions.users.array()[0]`

### 10. Guild Operations
- **Before**: `msg.guild.members.ban(user)`
- **After**: `msg.guild.ban(user.id, { reason: 'reason' })`
- **Before**: `msg.guild.members.kick(user)`
- **After**: `msg.guild.kick(user.id, 'reason')`

### 11. Channel Creation
- **Before**: `guild.channels.create(name, { type: 'text' })`
- **After**: `guild.channels.create({ name: name, type: 'GUILD_TEXT' })`

### 12. Ping Access
- **Before**: `client.ws.ping`
- **After**: `client.gateway.ping`

### 13. Guild/User Info
- **Before**: `msg.guild.iconURL`
- **After**: `msg.guild.iconURL()`
- **Before**: `msg.guild.owner`
- **After**: `(await msg.guild.fetchOwner()).user.tag`

## New Features Added

### Gaming Platform Integration
- **Steam**: Profile stats, game library, playtime tracking
- **League of Legends**: Ranked stats, match history, champion data
- **GitHub**: Repository stats, contribution data, profile info
- **Twitch**: Stream status, follower count, channel info
- **Epic Games/Fortnite**: Battle Royale stats, account level
- **Roblox**: User profiles, friends count, badges
- **Battle.net/Overwatch**: Competitive ranks, hero stats

### Level System
- **XP Gain**: Automatic XP from messaging with cooldown
- **Leaderboards**: Server-wide ranking system
- **Progress Tracking**: Visual progress bars and statistics
- **Data Persistence**: JSON-based storage system

### Financial Data
- **Stock Market**: Real-time stock prices and changes
- **Cryptocurrency**: Bitcoin, Ethereum, and altcoin prices
- **Market Analysis**: 24h changes, volume, market cap

### Lyrics Integration
- **Song Search**: Find lyrics by artist and title
- **Multiple Sources**: Primary and fallback API sources
- **Smart Formatting**: Truncation and display optimization

### Voice Connection Updates
- **Real Audio Streaming**: Actual voice channel connections using Harmony
- **ytdl-core Integration**: High-quality YouTube audio streaming
- **Connection Management**: Proper cleanup and error handling

## Environment Variables

Add these to your environment or settings:
```bash
# Gaming APIs
STEAM_API_KEY=your_steam_api_key
RIOT_API_KEY=your_riot_games_api_key
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret

# Financial APIs
ALPHA_VANTAGE_KEY=your_alpha_vantage_key

# Music APIs
GENIUS_TOKEN=your_genius_api_token
```

## Installation Instructions

1. Remove discord.js:
   ```bash
   npm uninstall discord.js
   ```

2. Install Harmony and new dependencies:
   ```bash
   npm install @harmonyland/harmony
   npm install node-fetch superagent melon-chart-api
   npm install ytdl-core youtube-sr @discordjs/voice
   npm install ffmpeg-static sodium
   ```

3. Update your bot token configuration in `settings.json` or environment variables.

4. Create data directory for level system:
   ```bash
   mkdir data
   ```

5. Run the bot:
   ```bash
   npm start
   ```

## Notes

- Harmony is designed for both Node.js and Deno, but this bot is configured for Node.js
- Some features may have different API designs in Harmony
- Always check the [Harmony documentation](https://harmony.mod.land/) for the latest API reference
- The bot maintains backward compatibility for command aliases and functionality
- Level system data is stored locally in JSON format
- Gaming platform APIs may require registration and API keys
- Voice functionality requires FFmpeg to be installed on the system
