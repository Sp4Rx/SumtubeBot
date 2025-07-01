@echo off
REM SumTube Bot EC2 Upload Script for Windows
REM This script uploads built files to EC2 instance

echo 🚀 Uploading SumTube Bot to EC2...

REM Configuration
set EC2_HOST=ec2-3-110-118-25.ap-south-1.compute.amazonaws.com
set EC2_USER=ubuntu
set KEY_PATH=%1
set APP_DIR=/opt/sumtube-bot

if "%KEY_PATH%"=="" (
    echo ❌ Please provide the path to your EC2 private key file
    echo Usage: upload-to-ec2.bat "path\to\your-key.pem"
    pause
    exit /b 1
)

if not exist "%KEY_PATH%" (
    echo ❌ Key file not found: %KEY_PATH%
    pause
    exit /b 1
)

echo 📦 Uploading files to %EC2_HOST%...

REM Upload built application
echo 📁 Uploading dist/ directory...
scp -i "%KEY_PATH%" -r dist\ %EC2_USER%@%EC2_HOST%:%APP_DIR%/

REM Upload configuration files
echo 📄 Uploading configuration files...
scp -i "%KEY_PATH%" package.json ecosystem.config.js %EC2_USER%@%EC2_HOST%:%APP_DIR%/

if %errorlevel% equ 0 (
    echo ✅ Upload completed successfully!
    echo 🔗 SSH into your EC2 instance to complete deployment:
    echo    ssh -i "%KEY_PATH%" %EC2_USER%@%EC2_HOST%
    echo    cd %APP_DIR%
    echo    npm ci --production
    echo    pm2 start ecosystem.config.js
) else (
    echo ❌ Upload failed
)

pause 