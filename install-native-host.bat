@echo off
setlocal enabledelayedexpansion

:: Get script directory
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=!SCRIPT_DIR:~0,-1!"

:: Function to install for Chrome
:install_chrome
    :: Create target directory
    set "CHROME_DIR=%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts"
    if not exist "!CHROME_DIR!" mkdir "!CHROME_DIR!"
    
    :: Copy manifest file
    copy /Y "!SCRIPT_DIR!\com.simplevideodownloader.json" "!CHROME_DIR!\"
    
    :: Update manifest with absolute path
    powershell -Command "(Get-Content '!CHROME_DIR!\com.simplevideodownloader.json') -replace '\"path\": \"native-host.py\"', '\"path\": \"!SCRIPT_DIR:\=\\!\\native-host.py\"' | Set-Content '!CHROME_DIR!\com.simplevideodownloader.json'"
    
    echo Native messaging host installed for Chrome
    goto :eof

:: Function to install for Firefox
:install_firefox
    :: Create target directory
    set "FIREFOX_DIR=%APPDATA%\Mozilla\NativeMessagingHosts"
    if not exist "!FIREFOX_DIR!" mkdir "!FIREFOX_DIR!"
    
    :: Copy manifest file
    copy /Y "!SCRIPT_DIR!\com.simplevideodownloader.json" "!FIREFOX_DIR!\"
    
    :: Update manifest with absolute path
    powershell -Command "(Get-Content '!FIREFOX_DIR!\com.simplevideodownloader.json') -replace '\"path\": \"native-host.py\"', '\"path\": \"!SCRIPT_DIR:\=\\!\\native-host.py\"' | Set-Content '!FIREFOX_DIR!\com.simplevideodownloader.json'"
    
    echo Native messaging host installed for Firefox
    goto :eof

:: Function to uninstall
:uninstall
    :: Chrome
    del /F /Q "%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts\com.simplevideodownloader.json" 2>nul
    
    :: Firefox
    del /F /Q "%APPDATA%\Mozilla\NativeMessagingHosts\com.simplevideodownloader.json" 2>nul
    
    echo Native messaging host uninstalled
    goto :eof

:: Main script
if "%1"=="" (
    echo Usage: %0 {chrome^|firefox^|both^|uninstall}
    exit /b 1
)

if "%1"=="chrome" (
    call :install_chrome
) else if "%1"=="firefox" (
    call :install_firefox
) else if "%1"=="both" (
    call :install_chrome
    call :install_firefox
) else if "%1"=="uninstall" (
    call :uninstall
) else (
    echo Invalid argument: %1
    echo Usage: %0 {chrome^|firefox^|both^|uninstall}
    exit /b 1
)

exit /b 0