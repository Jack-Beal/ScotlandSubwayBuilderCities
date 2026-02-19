@echo off
echo [ScotlandCities] Installing server dependencies...
cd /d "%~dp0server"
npm install
echo [ScotlandCities] Starting server on http://localhost:8081 ...
node server.mjs %*
pause
