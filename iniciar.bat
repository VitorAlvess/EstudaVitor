@echo off
title EstudaVitor
echo.
echo  ==================================
echo   EstudaVitor - Iniciando servidor...
echo  ==================================
echo.
cd /d "%~dp0"
echo  Acesse: http://localhost:3737
echo  Para parar: feche esta janela
echo.
node server.js
pause
