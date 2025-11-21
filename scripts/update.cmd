@echo off
REM Update script for items.json
REM This script adds missing items found in Bin directory to items.json

echo.
echo ================================================================================
echo Running Items.json Update Script
echo ================================================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3 to run this script
    pause
    exit /b 1
)

REM Run the update script
python "%~dp0update_items.py"

REM Capture exit code
set UPDATE_EXIT_CODE=%errorlevel%

echo.
echo ================================================================================
echo Update completed
echo ================================================================================
echo.

pause
exit /b %UPDATE_EXIT_CODE%
