@echo off
REM Test script for validating items.json
REM This script runs the Python test and displays the results
REM
REM Usage:
REM   test.cmd          - Run validation with all checks
REM   test.cmd --no-version - Run validation ignoring version warnings
REM   test.cmd --no-url - Run validation ignoring url warnings
REM   test.cmd --no-download - Run validation ignoring download warnings

echo.
echo ================================================================================
echo Running Items.json Validation Test
echo ================================================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3 to run this test
    pause
    exit /b 1
)

REM Run the test script with arguments
python "%~dp0test_items.py" --no-version --no-url --no-download %*

REM Capture exit code
set TEST_EXIT_CODE=%errorlevel%

echo.
echo ================================================================================
echo Test completed
echo ================================================================================
echo.

REM Open log file if there were warnings or errors
if %TEST_EXIT_CODE% neq 0 (
    echo Opening log file...
    if exist "%~dp0..\tests\test.log" (
        start notepad "%~dp0..\tests\test.log"
    )
)

pause
exit /b %TEST_EXIT_CODE%
