@echo off
cd /d "%~dp0"
echo Iniciando la version actualizada del portfolio...
echo Carpeta: %CD%
echo URL: http://localhost:3000/?v=20260711-ui5
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo ERROR: Node.js no esta instalado o no esta en PATH.
  echo Descargalo desde https://nodejs.org/ y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000/?v=20260711-ui5'"
npm run dev
pause
