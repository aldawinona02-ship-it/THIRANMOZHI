@echo off
echo ========================================================
echo Starting Thiranmozhi App...
echo ========================================================

set NODE_PATH="C:\Users\aldaw\AppData\Local\Programs\cursor\resources\app\resources\helpers\node.exe"

if exist %NODE_PATH% (
    echo Starting server with local Node.js runtime...
    start http://localhost:3000
    %NODE_PATH% server.js
) else (
    where node >nul 2>nul
    if %errorlevel% equ 0 (
        start http://localhost:3000
        node server.js
    ) else (
        echo Node.js not detected in default path.
        pause
    )
)
