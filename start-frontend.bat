@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM Node.js 설치 확인
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js가 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo   1. https://nodejs.org/ 에서 LTS 버전 다운로드
    echo   2. 또는 winget install OpenJS.NodeJS.LTS
    echo.
    pause
    exit /b 1
)

if not exist "frontend" (
    echo frontend 폴더를 찾을 수 없습니다.
    pause
    exit /b 1
)
cd /d "%~dp0frontend"

REM node_modules가 없거나 vite가 없으면 의존성 설치
if not exist "node_modules" (
    echo node_modules가 없습니다. 의존성을 설치합니다...
    npm install
)

REM vite 실행 확인, 없으면 재설치
call npx vite --version >nul 2>&1
if errorlevel 1 (
    echo vite가 설치되지 않았습니다. 의존성을 재설치합니다...
    if exist "node_modules" rmdir /s /q node_modules
    npm install
)

npm run dev
