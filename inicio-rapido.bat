@echo off
title WhatsApp Bulk Sender - Inicio Rápido
color 0B

echo.
echo ==========================================
echo    INICIO RÁPIDO - WHATSAPP BULK SENDER
echo ==========================================
echo.

REM Limpiar procesos
taskkill /F /IM node.exe >nul 2>&1

REM Limpiar cache
if exist .wwebjs_cache rmdir /s /q .wwebjs_cache >nul 2>&1

echo ✅ Sistema limpiado
echo 🚀 Iniciando servidor...
echo 🌐 URL: http://localhost:3000
echo.

npm start

pause