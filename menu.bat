@echo off
title WhatsApp Bulk Sender - Menu Principal
color 0F
mode con: cols=80 lines=30

:menu
cls
echo.
echo     ╔══════════════════════════════════════════════════════════════╗
echo     ║                                                              ║
echo     ║           📱 WHATSAPP BULK SENDER v1.0                      ║
echo     ║                 Menu Principal de Control                    ║
echo     ║                                                              ║
echo     ╚══════════════════════════════════════════════════════════════╝
echo.
echo     ┌─────────────────── OPCIONES DISPONIBLES ───────────────────┐
echo     │                                                            │
echo     │  [1] 🚀 Iniciar Servidor (Completo)                       │
echo     │  [2] ⚡ Inicio Rápido                                      │
echo     │  [3] 🔄 Auto-Reinicio                                     │
echo     │  [4] 📊 Monitor del Sistema                                │
echo     │  [5] 🔧 Mantenimiento                                     │
echo     │                                                            │
echo     │  [6] 🌐 Abrir en Navegador                                 │
echo     │  [7] 📁 Abrir Carpeta de Proyecto                          │
echo     │  [8] 📋 Ver Estado Actual                                  │
echo     │                                                            │
echo     │  [9] ℹ️  Ayuda e Información                               │
echo     │  [0] ❌ Salir                                              │
echo     │                                                            │
echo     └────────────────────────────────────────────────────────────┘
echo.

REM Mostrar estado actual
netstat -an | find "3000" >nul
if %errorlevel% equ 0 (
    echo     💡 Estado: SERVIDOR ACTIVO en http://localhost:3000
) else (
    echo     💡 Estado: Servidor detenido
)
echo.

set /p choice="     👉 Selecciona una opción (0-9): "

if "%choice%"=="1" goto servidor_completo
if "%choice%"=="2" goto inicio_rapido
if "%choice%"=="3" goto auto_reinicio
if "%choice%"=="4" goto monitor
if "%choice%"=="5" goto mantenimiento
if "%choice%"=="6" goto abrir_navegador
if "%choice%"=="7" goto abrir_carpeta
if "%choice%"=="8" goto ver_estado
if "%choice%"=="9" goto ayuda
if "%choice%"=="0" goto salir

echo.
echo     ❌ Opción no válida. Intenta de nuevo.
timeout /t 2 >nul
goto menu

:servidor_completo
echo.
echo     🚀 Iniciando servidor completo...
call iniciar-servidor.bat
goto menu

:inicio_rapido
echo.
echo     ⚡ Inicio rápido...
call inicio-rapido.bat
goto menu

:auto_reinicio
echo.
echo     🔄 Iniciando auto-reinicio...
call auto-reinicio.bat
goto menu

:monitor
echo.
echo     📊 Abriendo monitor...
call monitor.bat
goto menu

:mantenimiento
echo.
echo     🔧 Abriendo mantenimiento...
call mantenimiento.bat
goto menu

:abrir_navegador
echo.
echo     🌐 Abriendo navegador...
start http://localhost:3000
echo     ✅ Navegador abierto
timeout /t 2 >nul
goto menu

:abrir_carpeta
echo.
echo     📁 Abriendo carpeta del proyecto...
start .
echo     ✅ Carpeta abierta
timeout /t 2 >nul
goto menu

:ver_estado
cls
echo.
echo     ╔══════════════════════════════════════════════════════════════╗
echo     ║                    ESTADO DEL SISTEMA                       ║
echo     ╚══════════════════════════════════════════════════════════════╝
echo.

REM Estado del servidor
echo     [SERVIDOR]
netstat -an | find "3000" >nul
if %errorlevel% equ 0 (
    echo     ✅ Activo en puerto 3000
    echo     🌐 URL: http://localhost:3000
) else (
    echo     ❌ Inactivo
)

REM Procesos Node.js
echo.
echo     [PROCESOS]
tasklist | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo     ✅ Node.js corriendo
) else (
    echo     ❌ Node.js no detectado
)

REM Archivos importantes
echo.
echo     [ARCHIVOS]
if exist server.js (echo     ✅ server.js) else (echo     ❌ server.js)
if exist package.json (echo     ✅ package.json) else (echo     ❌ package.json)
if exist node_modules (echo     ✅ node_modules) else (echo     ❌ node_modules)

REM Cache
echo.
echo     [CACHE]
if exist .wwebjs_cache (echo     ⚠️  Cache presente) else (echo     ✅ Cache limpio)

echo.
echo     ════════════════════════════════════════════════════════════════
pause
goto menu

:ayuda
cls
echo.
echo     ╔══════════════════════════════════════════════════════════════╗
echo     ║                    AYUDA E INFORMACIÓN                       ║
echo     ╚══════════════════════════════════════════════════════════════╝
echo.
echo     📖 DESCRIPCIÓN:
echo        WhatsApp Bulk Sender es una aplicación para envío masivo
echo        de mensajes de WhatsApp con interfaz web profesional.
echo.
echo     🚀 SCRIPTS DISPONIBLES:
echo        • iniciar-servidor.bat - Inicio completo con verificaciones
echo        • inicio-rapido.bat    - Inicio rápido sin verificaciones
echo        • auto-reinicio.bat    - Reinicio automático si falla
echo        • monitor.bat          - Monitoreo en tiempo real
echo        • mantenimiento.bat    - Herramientas de mantenimiento
echo.
echo     🌐 URLs IMPORTANTES:
echo        • Local: http://localhost:3000
echo        • GitHub: https://github.com/Programacion79/whatsapp-bulk-sender
echo.
echo     📱 FUNCIONALIDADES:
echo        • Envío masivo hasta 50 contactos
echo        • 6 plantillas profesionales
echo        • Importación CSV/Excel
echo        • Progreso en tiempo real
echo        • Reconexión automática
echo.
echo     ⚠️  IMPORTANTE:
echo        • Usar números con consentimiento
echo        • Respetar límites de WhatsApp
echo        • No enviar spam
echo.
echo     ════════════════════════════════════════════════════════════════
pause
goto menu

:salir
cls
echo.
echo     ╔══════════════════════════════════════════════════════════════╗
echo     ║                         CERRANDO                            ║
echo     ╚══════════════════════════════════════════════════════════════╝
echo.
echo     🔄 Deteniendo procesos...
taskkill /F /IM node.exe >nul 2>&1

echo     ✅ Procesos detenidos
echo     👋 ¡Gracias por usar WhatsApp Bulk Sender!
echo.
timeout /t 3 >nul
exit