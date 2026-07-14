@echo off
cd /d "%~dp0"
py PATCH_ALL_HTML.py
if errorlevel 1 python PATCH_ALL_HTML.py
