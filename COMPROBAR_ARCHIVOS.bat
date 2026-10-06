@echo off
cd /d "%~dp0"
echo Carpeta actual: %CD%
echo.
for %%F in (package.json server.mjs index.html vercel.json) do (
  if exist "%%F" (
    echo [OK] %%F
  ) else (
    echo [FALTA] %%F
  )
)
echo.
pause
