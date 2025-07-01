@echo off
REM SumTube Bot Local Build Script for Windows
REM This script builds the application locally on Windows

echo 🚀 Starting SumTube Bot build process...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

echo ✅ NPM version:
npm --version

REM Check Node.js version (should be 20+)
for /f "tokens=1 delims=." %%i in ('node --version') do set major_version=%%i
set major_version=%major_version:v=%
if %major_version% LSS 20 (
    echo ❌ Node.js 20+ required for built-in .env support
    echo Current version: 
    node --version
    echo Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the application
echo 🔨 Building application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Built files are in the 'dist' directory
echo 📝 Next steps:
echo    1. Upload dist/ folder to your EC2 instance
echo    2. Copy package.json and ecosystem.config.js
echo    3. Run deployment on EC2

pause 