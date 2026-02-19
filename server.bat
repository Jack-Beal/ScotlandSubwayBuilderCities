@echo off
echo Starting map server...
echo This window must remain open while playing.
echo.
cd /d "./server"
.\\pmtiles.exe serve . --port 8081 --cors=*
if %errorlevel% neq 0 (
    echo.
    echo Error: Could not start pmtiles.exe
    pause
)