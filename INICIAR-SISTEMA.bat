@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║        GuíaPlus - Sistema de Asignación de Tutores    ║
echo ║              con Autenticación y Roles                 ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo.

REM Verificar si MongoDB está instalado
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB NO está instalado en este sistema
    echo.
    echo 📋 Para usar el sistema de autenticación necesitas MongoDB:
    echo.
    echo    1. Descarga MongoDB Community Server desde:
    echo       https://www.mongodb.com/try/download/community
    echo.
    echo    2. Instala MongoDB y asegúrate de marcar:
    echo       - "Install MongoDB as a Service"
    echo       - "Install MongoDB Compass" ^(opcional^)
    echo.
    echo    3. Después de instalar, ejecuta este script nuevamente
    echo.
    echo 💡 Alternativamente, lee INSTALACION_MONGODB.md
    echo.
    pause
    exit /b 1
)

echo ✅ MongoDB encontrado
echo.

REM Verificar si el servicio MongoDB está corriendo
sc query MongoDB | find "RUNNING" >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔄 Intentando iniciar el servicio MongoDB...
    net start MongoDB >nul 2>&1
    if %errorlevel% neq 0 (
        echo.
        echo ⚠️  El servicio MongoDB no está configurado
        echo 🚀 Iniciando MongoDB manualmente...
        echo.
        start "MongoDB Server" /MIN mongod --dbpath "%CD%\data\db"
        timeout /t 3 /nobreak >nul
    ) else (
        echo ✅ Servicio MongoDB iniciado
    )
) else (
    echo ✅ MongoDB ya está corriendo
)

echo.
echo ════════════════════════════════════════════════════════
echo.

REM Verificar si los usuarios ya están creados
echo 🔍 Verificando usuarios de prueba...
echo.

REM Intentar crear usuarios (esto fallará silenciosamente si ya existen)
node init-users.js 2>nul
if %errorlevel% equ 0 (
    echo.
    echo ✅ Usuarios de prueba creados
    echo.
) else (
    echo.
    echo ℹ️  Los usuarios ya existen o hay un error de conexión
    echo.
)

echo ════════════════════════════════════════════════════════
echo.
echo 🚀 Iniciando servidor GuíaPlus...
echo.
echo 📋 Credenciales de acceso:
echo.
echo    ADMIN:        admin / admin123
echo    COORDINADOR:  coordinador / coord123
echo    TUTOR:        tutor / tutor123
echo    ESTUDIANTE:   estudiante / est123
echo.
echo ════════════════════════════════════════════════════════
echo.
echo 🌐 Abriendo navegador en http://localhost:3000/login
echo.

REM Esperar 2 segundos antes de abrir el navegador
timeout /t 2 /nobreak >nul

REM Abrir navegador
start http://localhost:3000/login

REM Iniciar servidor Node.js
npm start

pause
