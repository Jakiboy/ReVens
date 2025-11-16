@echo off
REM Fix script for items.json
REM This script adds missing properties to all items

echo.
echo ================================================================================
echo Running Items.json Fix Script
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

REM Run the fix script
python "%~dp0fix_items.py"

REM Capture exit code
set FIX_EXIT_CODE=%errorlevel%

echo.
echo ================================================================================
echo Fix completed
echo ================================================================================
echo.

pause
exit /b %FIX_EXIT_CODE%
