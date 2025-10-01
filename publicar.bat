@echo off
echo ==========================================
echo   WHATSAPP BULK SENDER - PUBLICACION
echo ==========================================
echo.

echo [1/4] Verificando Git...
git status
if %errorlevel% neq 0 (
    echo ERROR: No se pudo verificar Git
    pause
    exit /b 1
)

echo.
echo [2/4] Guardando cambios en GitHub...
git add .
git commit -m "Actualizacion automatica - %date% %time%"
git push origin main

echo.
echo [3/4] Tu codigo esta actualizado en GitHub
echo URL: https://github.com/Programacion79/whatsapp-bulk-sender
echo.

echo [4/4] OPCIONES DE PUBLICACION:
echo.
echo A) RAILWAY (Recomendado - Facil)
echo    1. Ve a: https://railway.app
echo    2. Login con GitHub
echo    3. New Project
echo    4. Deploy from GitHub repo
echo    5. Selecciona: Programacion79/whatsapp-bulk-sender
echo    6. Deploy automatico!
echo.
echo B) RENDER (Gratis)
echo    1. Ve a: https://render.com
echo    2. New Web Service
echo    3. Connect GitHub: Programacion79/whatsapp-bulk-sender
echo    4. Deploy gratis!
echo.
echo C) HEROKU (Tradicional)
echo    1. Instala Heroku CLI
echo    2. heroku login
echo    3. heroku create tu-app-name
echo    4. git push heroku main
echo.

echo ==========================================
echo   INSTRUCCIONES COMPLETAS EN:
echo   DESPLIEGUE.md
echo ==========================================
pause