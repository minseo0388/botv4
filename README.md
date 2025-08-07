# Harmony Bot Example

A comprehensive Discord bot built with Harmony (harmonyland/harmony) Discord API library, featuring music playbook, role management, and various utility functions.

## Features

### 🎵 Music System
- **Play music** from YouTube with search functionality
- **Queue management** (add, skip, stop, pause, resume)
- **Volume control** and real-time audio streaming
- **Now playing** information with thumbnails
- **Music charts** from Spotify, Apple Music, and Melon

### 👥 Role Management
- **Create roles** with custom colors and settings
- **Assign/remove roles** to/from users
- **Delete roles** with proper permission checks
- **List all roles** in the server with member counts

### 💤 AFK System
- **Set AFK status** with custom reasons
- **Automatic nickname updates** with [AFK] prefix
- **AFK mention notifications** when users are mentioned
- **Welcome back messages** with AFK duration

### 📅 Personal D-Day Calculator
- **Add personal D-Days** with custom names and dates
- **View all D-Days** with countdown/countup display
- **Remove D-Days** by number or name
- **Date validation** and formatting

### ⏰ Reminder System
- **Set reminders** with natural time parsing (5m, 1h30m, 2d)
- **List active reminders** with time remaining
- **Remove reminders** before they trigger
- **Automatic notifications** in the original channel

### ⏲️ Timer Functionality
- **Start timers** with custom names and durations
- **Multiple active timers** per user
- **Stop/cancel timers** before completion
- **Timer completion notifications**

### ⏱️ Stopwatch System
- **Start/stop/pause stopwatches** with precision timing
- **Multiple named stopwatches** per user
- **Reset and delete** stopwatch functionality
- **High-precision time display** (milliseconds)

### 🛠️ Moderation Tools
- **Ban/unban** users with reasons
- **Kick** users from server
- **Mute/unmute** members temporarily
- **Clear messages** in bulk

### 📊 Information Commands
- **Server information** with detailed stats
- **User information** with join dates and roles
- **Role information** with permissions and member lists
- **Bot uptime** and system information

### 🎮 Fun Commands
- **osu! player stats** lookup
- **Minecraft server status** checker
- **Random color** generator
- **Han River temperature** (Korean weather data)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `settings.json` file in the root directory:
   ```json
   {
     "token": "YOUR_BOT_TOKEN_HERE",
     "prefix": "n>",
     "osuApiKey": "YOUR_OSU_API_KEY_HERE",
     "owners": ["YOUR_USER_ID_HERE"]
   }
   ```

   Or set environment variables:
   ```bash
   export naesungToken="YOUR_BOT_TOKEN_HERE"
   export naesungPrefix="n>"
   export OSU_API_KEY="YOUR_OSU_API_KEY_HERE"
   ```

3. Run the bot:
   ```bash
   npm start
   ```

## Features

This bot includes various commands such as:

### General Commands
- `ping` - Shows bot latency
- `info` - Shows bot information
- `userinfo` - Shows user information
- `serverinfo` - Shows server information
- `clear` - Clears messages
- `uptime` - Shows bot uptime

### Moderation Commands
- `ban` - Bans a user
- `kick` - Kicks a user
- `unban` - Unbans a user
- `mute`/`unmute` - Mutes/unmutes a user

### Music Commands
- `play <song>` - Plays a song from YouTube
- `search <query>` - Searches for songs on YouTube
- `queue` - Shows the current music queue
- `skip` - Skips the current song
- `stop` - Stops music and clears queue
- `pause`/`resume` - Pauses/resumes music
- `volume <0-100>` - Sets the music volume
- `nowplaying` - Shows currently playing song

### Chart Commands
- `spotify` - Shows Spotify Global Top 50
- `applemusic` - Shows Apple Music top songs
- `melon` - Shows Melon music chart
- `hangang` - Shows Han River temperature

### Utility Commands
- `userlist` - Exports user list (Admin only)
- `osu` - Shows osu! player information (requires API key)
- `minecraft` - Shows Minecraft player information
- `randomcolor` - Generates a random color
- `addchannel` - Creates a new channel
- `guildedit` - Edits guild name
- `roleinfo` - Shows role information
- `invite` - Creates an invite link
- And more!

## Configuration

### Required Settings
- `token`: Your Discord bot token
- `prefix`: Command prefix (default: "n>")

### Optional Settings
- `osuApiKey`: osu! API key for osu! player lookup command
- `owners`: Array of user IDs with owner permissions for userlist command
- `spotifyClientId` & `spotifyClientSecret`: Spotify API credentials for live chart data
- `appleMusicKey`: Apple Music API key for live chart data

### API Keys
- **osu! API**: Get your API key from https://osu.ppy.sh/p/api
- **Spotify API**: Create an app at https://developer.spotify.com/dashboard
- **Apple Music API**: Get credentials from https://developer.apple.com/apple-music/
- Add them to your `settings.json` or set environment variables

### Music Features
- YouTube music playback with search functionality
- Queue management (add, skip, clear)
- Volume control and pause/resume
- Live music charts from Spotify and Apple Music
- Korean music chart integration (Melon)

## Migration from Discord.js

This bot has been migrated from Discord.js to Harmony. Key changes include:

- Using `@harmonyland/harmony` instead of `discord.js`
- Event `message` changed to `messageCreate`
- `MessageEmbed` changed to `Embed`
- Various API method changes for consistency with Harmony
- Cache access changed from `.cache.get()` to direct manager methods
- Permission checks updated for Harmony's permission system

## License

ISC