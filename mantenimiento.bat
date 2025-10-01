@echo off
title WhatsApp Bulk Sender - Mantenimiento
color 0E
cls

echo.
echo ==========================================
echo    MANTENIMIENTO DEL SISTEMA
echo ==========================================
echo.

:menu
echo ¿Qué deseas hacer?
echo.
echo [1] Limpiar cache de WhatsApp
echo [2] Reinstalar dependencias
echo [3] Ver logs del sistema
echo [4] Verificar estado del puerto 3000
echo [5] Backup de configuración
echo [6] Restaurar configuración
echo [7] Iniciar servidor
echo [0] Salir
echo.
set /p option="Selecciona una opción (0-7): "

if "%option%"=="1" goto limpiar_cache
if "%option%"=="2" goto reinstalar_deps
if "%option%"=="3" goto ver_logs
if "%option%"=="4" goto verificar_puerto
if "%option%"=="5" goto backup
if "%option%"=="6" goto restaurar
if "%option%"=="7" goto iniciar
if "%option%"=="0" goto salir
goto menu

:limpiar_cache
echo.
echo [LIMPIEZA] Eliminando cache de WhatsApp...
taskkill /F /IM node.exe >nul 2>&1
if exist .wwebjs_cache rmdir /s /q .wwebjs_cache
if exist .wwebjs_auth rmdir /s /q .wwebjs_auth
if exist session-data rmdir /s /q session-data
echo ✅ Cache eliminado
echo.
pause
goto menu

:reinstalar_deps
echo.
echo [REINSTALACIÓN] Reinstalando dependencias...
if exist node_modules rmdir /s /q node_modules
npm install
if %errorlevel% equ 0 (
    echo ✅ Dependencias reinstaladas correctamente
) else (
    echo ❌ Error al reinstalar dependencias
)
echo.
pause
goto menu

:ver_logs
echo.
echo [LOGS] Logs del sistema:
echo.
if exist logs\app.log (
    echo === LOGS DE APLICACIÓN ===
    type logs\app.log | more
) else (
    echo No hay logs de aplicación
)
echo.
if exist logs\error.log (
    echo === LOGS DE ERRORES ===
    type logs\error.log | more
) else (
    echo No hay logs de errores
)
echo.
pause
goto menu

:verificar_puerto
echo.
echo [PUERTO] Verificando puerto 3000...
netstat -an | find "3000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 3000 está en uso
    echo    Procesos usando el puerto:
    netstat -ano | find "3000"
) else (
    echo ✅ Puerto 3000 disponible
)
echo.
pause
goto menu

:backup
echo.
echo [BACKUP] Creando backup de configuración...
if not exist backups mkdir backups
set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
if exist package.json copy package.json backups\package_%timestamp%.json >nul
if exist server.js copy server.js backups\server_%timestamp%.js >nul
if exist .env copy .env backups\env_%timestamp%.txt >nul 2>&1
echo ✅ Backup creado en carpeta 'backups'
echo.
pause
goto menu

:restaurar
echo.
echo [RESTAURAR] Archivos de backup disponibles:
if exist backups (
    dir /b backups\*.json backups\*.js 2>nul
    echo.
    echo Copia manualmente el archivo que deseas restaurar
) else (
    echo No hay backups disponibles
)
echo.
pause
goto menu

:iniciar
echo.
echo [INICIO] Iniciando servidor...
call iniciar-servidor.bat
goto menu

:salir
echo.
echo ✅ Saliendo del mantenimiento...
exit