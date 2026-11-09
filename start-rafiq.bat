
```bat
@echo off
setlocal EnableExtensions
chcp 65001 >nul
title Rafiq Launcher
color 0E

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"
set "JAR=%BACKEND_DIR%\target\shelter-1.0-SNAPSHOT.jar"
set "RAFIQ_BAT=%~f0"
set "LOG_DIR=%ROOT%logs"

set "BACKEND_LOG=%LOG_DIR%\backend-output.log"
set "BACKEND_ERR=%LOG_DIR%\backend-error.log"
set "FRONTEND_LOG=%LOG_DIR%\frontend-output.log"
set "FRONTEND_ERR=%LOG_DIR%\frontend-error.log"

echo.
echo =====================================
echo            R A F I Q
echo =====================================
echo.

rem ---- Preflight checks -------------------------------------------------
if not exist "%JAR%" (
    echo [ERROR] Backend JAR was not found:
    echo         %JAR%
    echo.
    echo         Build it first using:
    echo         cd backend
    echo         mvn package
    echo.
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
    echo [ERROR] Frontend package.json was not found.
    echo.
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%\node_modules" (
    echo [WARN] frontend\node_modules is missing.
    echo        Run npm install inside frontend first.
    echo.
    pause
    exit /b 1
)

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

rem ---- MySQL preflight --------------------------------------------------
echo Checking MySQL...

powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-NetConnection -ComputerName 'localhost' -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue) { exit 0 } else { exit 1 }"

if errorlevel 1 (
    echo [ERROR] MySQL is not running on localhost:3306.
    echo         Start MySQL in XAMPP, then try again.
    echo.
    pause
    exit /b 1
)

echo [OK] MySQL is running.
echo.

rem ---- Start backend invisibly -----------------------------------------
echo Starting Rafiq backend...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=Start-Process -FilePath $env:ComSpec -ArgumentList '/c java -jar target\shelter-1.0-SNAPSHOT.jar' -WorkingDirectory $env:BACKEND_DIR -WindowStyle Hidden -RedirectStandardOutput $env:BACKEND_LOG -RedirectStandardError $env:BACKEND_ERR -PassThru; Write-Output ('Backend process started: ' + $p.Id)"

if errorlevel 1 (
    echo [ERROR] Could not start the backend process.
    pause
    exit /b 1
)

rem ---- Start frontend invisibly ----------------------------------------
echo Starting Rafiq frontend...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=Start-Process -FilePath $env:ComSpec -ArgumentList '/c npm run dev' -WorkingDirectory $env:FRONTEND_DIR -WindowStyle Hidden -RedirectStandardOutput $env:FRONTEND_LOG -RedirectStandardError $env:FRONTEND_ERR -PassThru; Write-Output ('Frontend process started: ' + $p.Id)"

if errorlevel 1 (
    echo [ERROR] Could not start the frontend process.
    pause
    exit /b 1
)

rem ---- Backend readiness check -----------------------------------------
echo.
echo Waiting for backend on localhost:8081...

call :wait_port 8081 30

if errorlevel 1 (
    set "BACKEND_OK=0"
    echo [ERROR] Backend did not become ready.
    echo         See logs\backend-output.log
    echo         See logs\backend-error.log
) else (
    set "BACKEND_OK=1"
    echo [OK] Backend is ready.
)

rem ---- Frontend readiness check ----------------------------------------
echo.
echo Waiting for frontend on localhost:5173...

call :wait_port 5173 30

if errorlevel 1 (
    set "FRONTEND_OK=0"
    echo [ERROR] Frontend did not become ready.
    echo         See logs\frontend-output.log
    echo         See logs\frontend-error.log
) else (
    set "FRONTEND_OK=1"
    echo [OK] Frontend is ready.
)

rem ---- Determine final status ------------------------------------------
set "READY=0"

if "%BACKEND_OK%"=="1" if "%FRONTEND_OK%"=="1" set "READY=1"

if "%READY%"=="1" (
    echo.
    echo [OK] Rafiq is running.
    echo      Open http://localhost:5173 manually.
) else (
    echo.
    echo [WARN] Rafiq is not fully ready.
)

rem ---- Display artwork --------------------------------------------------
call :show_art

if not "%READY%"=="1" goto :not_ready

echo.
echo   =====================================
echo          [OK] Backend  : localhost:8081
echo          [OK] Frontend : localhost:5173
echo   =====================================
echo.
echo       RAFIQ ^| قيفر — READY FOR USE!
echo.
echo       =====================================
echo                  VISIT RAFIQ
echo           http://localhost:5173
echo       =====================================
echo.
echo   Logs are saved in the logs folder.
echo.
pause
exit /b 0

:not_ready
echo.
echo   =====================================
echo          [!] RAFIQ IS NOT READY
echo   =====================================
echo.
echo   Check the logs folder for details:
echo   backend-output.log / backend-error.log
echo   frontend-output.log / frontend-error.log
echo.
pause
exit /b 1

:wait_port
powershell -NoProfile -ExecutionPolicy Bypass -Command "$port=%1; $deadline=(Get-Date).AddSeconds(%2); while ((Get-Date) -lt $deadline) { if (Test-NetConnection -ComputerName 'localhost' -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue) { exit 0 }; Start-Sleep -Milliseconds 500 }; exit 1"
exit /b %errorlevel%

:show_art
powershell -NoProfile -ExecutionPolicy Bypass -Command "$c=Get-Content -LiteralPath $env:RAFIQ_BAT -Raw -Encoding UTF8; $art=[regex]::Match($c,'(?s)::ART_START\r?\n(.*?)\r?\n::ART_END').Groups[1].Value; [Console]::OutputEncoding=[Text.Encoding]::UTF8; Write-Output $art"
exit /b 0

::ART_START
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⣀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⣤⣄⣀⠀⡀⢀⣴⣾⠿⠿⠛⠛⠛⠛⠳⢶⣄⡀⠀⠀⠀⢀⠀⠀⠀
⢀⣾⠛⠙⠻⠶⠷⠞⠛⠉⠀⠀⠀⠀⠀⠀⠀⠈⠙⠳⣤⠴⠶⠺⣦⠀⠀
⢸⡏⠀⢀⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡀⣤⡀⠈⠃⠀
⠻⠀⣠⡿⣧⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡾⢷⣦⡀⡗
⢟⣴⠋⢠⣾⠁⠀⠀⠀⣀⣀⡀⠀⠀⠀⠀⠀⣠⣀⡀⠀⢸⠇⠀⠈⠙⠛
⠈⠉⠀⠈⡿⠀⠀⠀⣴⠿⠛⠁⠀⢀⣀⣀⠀⠉⠻⣷⡄⣸⠀⠀⠀⠀⠀
⠀⣠⡴⠾⣿⡀⢠⡄⠀⠀⠀⠀⢸⣿⣿⣿⡿⠀⠀⠀⢾⡿⠶⠶⢤⡄⠀
⠼⠻⡄⣦⡈⠳⣾⡅⠀⠀⠀⠀⠀⠈⣹⡏⠀⠀⠀⠀⢨⡇⠀⣰⡄⠹⠀
⠀⠀⠻⠿⠟⠛⠋⠻⣦⣄⣀⣠⣠⣴⠟⢷⣤⣀⣠⡤⠿⠵⠶⠟⠷⠞⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠋⠛⠿⠒⠚⠛⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀
::ART_END
```
