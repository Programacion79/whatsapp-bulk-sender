@echo off
title WhatsApp Bulk Sender - Monitor del Sistema
color 0D

:monitor
cls
echo.
echo ==========================================
echo    MONITOR DEL SISTEMA
echo    %date% - %time%
echo ==========================================
echo.

REM Verificar si el servidor está corriendo
echo [ESTADO DEL SERVIDOR]
netstat -an | find "3000" >nul
if %errorlevel% equ 0 (
    echo ✅ Servidor ACTIVO en puerto 3000
    echo 🌐 URL: http://localhost:3000
) else (
    echo ❌ Servidor NO ACTIVO
)
echo.

REM Verificar procesos Node.js
echo [PROCESOS NODE.JS]
tasklist | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Procesos Node.js detectados:
    tasklist | find "node.exe"
) else (
    echo ❌ No hay procesos Node.js corriendo
)
echo.

REM Verificar uso de memoria
echo [USO DE MEMORIA]
for /f "tokens=2 delims=:" %%a in ('tasklist /fi "imagename eq node.exe" /fo list ^| find "Mem Usage"') do (
    echo 📊 Memoria Node.js: %%a
)
echo.

REM Verificar archivos importantes
echo [ARCHIVOS DEL SISTEMA]
if exist server.js (echo ✅ server.js) else (echo ❌ server.js FALTA)
if exist package.json (echo ✅ package.json) else (echo ❌ package.json FALTA)
if exist node_modules (echo ✅ node_modules) else (echo ❌ node_modules FALTA)
if exist .wwebjs_cache (echo ⚠️  Cache WhatsApp presente) else (echo ✅ No hay cache)
echo.

REM Verificar logs recientes
echo [LOGS RECIENTES]
if exist logs\app.log (
    echo 📄 Últimas líneas del log:
    powershell "Get-Content logs\app.log -Tail 3" 2>nul
) else (
    echo ℹ️  No hay logs disponibles
)
echo.

echo ==========================================
echo [R] Refrescar  [I] Iniciar  [S] Detener  [Q] Salir
echo ==========================================
echo.

REM Esperar 3 segundos o input del usuario
choice /t 3 /d r /c RISQ /n /m "Selecciona opción: "

if errorlevel 4 goto salir
if errorlevel 3 goto detener
if errorlevel 2 goto iniciar
if errorlevel 1 goto monitor

:iniciar
echo.
echo Iniciando servidor...
start "" iniciar-servidor.bat
timeout /t 2 >nul
goto monitor

:detener
echo.
echo Deteniendo servidor...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Servidor detenido
timeout /t 2 >nul
goto monitor

:salir
echo.
echo ✅ Cerrando monitor...
exit