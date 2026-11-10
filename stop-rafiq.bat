
@echo off
title Rafiq - Shutdown
color 0C

echo.
echo ==========================================
echo              RAFIQ SHUTDOWN
echo ==========================================
echo.

echo [1/2] Stopping Java backend...
call :KillPort 8081

echo.
echo [2/2] Stopping React frontend...
call :KillPort 5173

echo.
echo ==========================================
echo             RAFIQ IS STOPPED
echo ==========================================
echo.
echo MySQL and XAMPP were left untouched.
echo.
echo Preparing the final goodbye...
timeout /t 2 /nobreak >nul

cls
echo.
echo        ,^_-._           __
echo         \  `-..____,.'  `.
echo          :`.         /    \`.
echo          :  )       :      : \
echo           ;'        '   ;  ^|  :
echo           )..      .. .:.`.;  :
echo          /::...  .:::...   ` ;
echo          ; _ '    __        /:\
echo          `:o^>   /\o_^>      ;:. `.
echo         `-`.__ ;   __..--- /:.   \
echo         === \_/   ;=====_.':.     ;
echo          ,/'`--'...`--....        ;
echo               ;                    ;
echo             .'                      ;
echo           .'                        ;
echo         .'     ..     ,      .       ;
echo        :       ::..  /      ;::.     ^|
echo       /      `.;::.  ^|       ;:..    ;
echo      :         ^|:.   :       ;:.    ;
echo      :         ::     ;:..   ^|.    ;
echo       :       :;      :::....^|     ;
echo       /\     ,/ \      ;:::::;     ;
echo     .:. \:..^|    :     ; '.--^|     ;
echo    ::.  :''  `-.,,;     ;'   ;     ;
echo .-'. _.'\      / `;      \,__:      \
echo `---'    `----'   ;      /    \,.,,,/
echo                    `----`
echo.
echo       Rafiq is officially tucked in.
echo       Thanks for stopping by - meow!
echo.
pause
exit /b

:KillPort
set "PORT=%~1"
set "FOUND="

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
    set "FOUND=1"
    taskkill /F /T /PID %%P >nul 2>&1
)

if not defined FOUND (
    echo No application is listening on port %PORT%.
) else (
    echo Port %PORT% process stopped.
)
exit /b

