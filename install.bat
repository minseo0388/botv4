@echo off
echo Installing Harmony Bot Dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo Node.js and npm are installed.
echo.

REM Install dependencies
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Installation completed successfully!
echo.
echo Next steps:
echo 1. Install FFmpeg for music playback:
echo    Download from: https://ffmpeg.org/download.html
echo    Add FFmpeg to your system PATH
echo.
echo 2. Create a settings.json file with your bot token:
echo    {
echo      "token": "YOUR_BOT_TOKEN_HERE",
echo      "prefix": "n>",
echo      "osuApiKey": "YOUR_OSU_API_KEY",
echo      "spotifyClientId": "YOUR_SPOTIFY_CLIENT_ID",
echo      "spotifyClientSecret": "YOUR_SPOTIFY_CLIENT_SECRET"
echo    }
echo.
echo 3. Run the bot with: npm start
echo.
echo Music Features:
echo - YouTube music playback and search
echo - Spotify and Apple Music charts
echo - Volume control and queue management
echo.
pause
