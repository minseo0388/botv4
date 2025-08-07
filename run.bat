@echo off
@title Harmony Bot Example
@echo off
:home
echo Starting Harmony Bot...
node index.js
echo Bot stopped. Restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto home
pause
