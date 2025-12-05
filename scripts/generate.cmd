@echo off
REM Generate dynamic content for README.md

python "%~dp0generate.py" --readme
REM python "%~dp0generate.py" --download
pause
