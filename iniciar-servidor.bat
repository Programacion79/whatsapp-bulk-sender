@echo off
title WhatsApp Bulk Sender - Servidor Local
color 0A
cls

echo.
echo ==========================================
echo    WHATSAPP BULK SENDER v1.0
echo    Servidor Local - Modo Desarrollo
echo ==========================================
echo.

REM Verificar si Node.js está instalado
echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    echo    Descarga desde: https://nodejs.org
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js detectado

REM Verificar si npm está disponible
echo [2/6] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: npm no está disponible
    pause
    exit /b 1
)
echo ✅ npm detectado

REM Limpiar procesos anteriores
echo [3/6] Limpiando procesos anteriores...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM "WhatsApp Bulk Sender"* >nul 2>&1
echo ✅ Procesos limpiados

REM Limpiar cache de WhatsApp
echo [4/6] Limpiando cache de WhatsApp...
if exist .wwebjs_cache (
    rmdir /s /q .wwebjs_cache >nul 2>&1
    echo ✅ Cache eliminado
) else (
    echo ✅ No hay cache que limpiar
)

REM Verificar dependencias
echo [5/6] Verificando dependencias...
if not exist node_modules (
    echo ⚠️  Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)
echo ✅ Dependencias verificadas

REM Crear carpetas necesarias
echo [6/6] Preparando estructura...
if not exist uploads mkdir uploads >nul 2>&1
if not exist reports mkdir reports >nul 2>&1
if not exist logs mkdir logs >nul 2>&1
echo ✅ Estructura preparada

echo.
echo ==========================================
echo    INICIANDO SERVIDOR...
echo ==========================================
echo.
echo 🌐 URL Local: http://localhost:3000
echo 📱 Escanea el código QR con WhatsApp
echo 🔄 Presiona Ctrl+C para detener
echo.
echo ==========================================

REM Iniciar el servidor
npm start

REM Si el servidor se detiene
echo.
echo ==========================================
echo    SERVIDOR DETENIDO
echo ==========================================
echo.
echo ❓ ¿Qué deseas hacer?
echo.
echo [R] Reiniciar servidor
echo [L] Ver logs de errores
echo [Q] Salir
echo.
set /p choice="Selecciona una opción (R/L/Q): "

if /i "%choice%"=="R" goto inicio
if /i "%choice%"=="L" goto logs
if /i "%choice%"=="Q" goto salir

:logs
echo.
echo ==========================================
echo    LOGS DE ERRORES
echo ==========================================
echo.
if exist logs\error.log (
    type logs\error.log
) else (
    echo No hay logs de errores disponibles
)
echo.
pause
goto menu

:salir
echo.
echo ✅ Cerrando WhatsApp Bulk Sender...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Servidor cerrado correctamente
echo.
pause
exit

:inicio
cls
goto menu