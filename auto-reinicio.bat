@echo off
title WhatsApp Bulk Sender - Auto Reinicio
color 0C

echo.
echo ==========================================
echo    AUTO-REINICIO AUTOMÁTICO
echo ==========================================
echo.
echo Este script reiniciará automáticamente
echo el servidor si se cae o tiene errores.
echo.
echo Presiona Ctrl+C para detener
echo.

set /a intentos=1

:loop
echo.
echo ==========================================
echo    INTENTO #%intentos% - %date% %time%
echo ==========================================

REM Limpiar procesos anteriores
taskkill /F /IM node.exe >nul 2>&1

REM Limpiar cache si es necesario
if %intentos% gtr 1 (
    echo Limpiando cache debido a reinicio...
    if exist .wwebjs_cache rmdir /s /q .wwebjs_cache >nul 2>&1
)

echo Iniciando servidor (Intento #%intentos%)...
npm start

REM Si llegamos aquí, el servidor se cerró
echo.
echo ⚠️  Servidor detenido - Intento #%intentos%
echo.

REM Incrementar contador
set /a intentos+=1

REM Esperar antes de reiniciar
echo Esperando 5 segundos antes de reiniciar...
timeout /t 5 /nobreak >nul

REM Reiniciar
goto loop