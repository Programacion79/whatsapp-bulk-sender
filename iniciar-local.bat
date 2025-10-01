@echo off
title WhatsApp Bulk Sender - LOCAL
color 0A

:inicio
cls
echo ==========================================
echo   WHATSAPP BULK SENDER - MODO LOCAL
echo ==========================================
echo.
echo [INFO] Servidor corriendo en: http://localhost:3000
echo [INFO] Presiona Ctrl+C para detener
echo.

echo [1/3] Limpiando procesos anteriores...
taskkill /F /IM node.exe 2>nul

echo [2/3] Limpiando cache de WhatsApp...
if exist .wwebjs_cache rmdir /s /q .wwebjs_cache 2>nul

echo [3/3] Iniciando servidor local...
echo.
echo ==========================================
echo   SERVIDOR INICIADO - http://localhost:3000
echo ==========================================
echo.

npm start

echo.
echo [ERROR] El servidor se ha detenido
echo Presiona cualquier tecla para reiniciar...
pause >nul
goto inicio