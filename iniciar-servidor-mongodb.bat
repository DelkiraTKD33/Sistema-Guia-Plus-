@echo off
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║        GuíaPlus - Sistema de Asignación de Tutores    ║
echo ║                  con MongoDB                           ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Verificando MongoDB...
echo.

REM Verificar si MongoDB está corriendo
sc query MongoDB | find "RUNNING" >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB no está corriendo. Intentando iniciar el servicio...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Error: No se pudo iniciar MongoDB.
        echo.
        echo Por favor:
        echo 1. Asegúrate de que MongoDB esté instalado
        echo 2. O ejecuta "mongod" manualmente en otra ventana
        echo.
        pause
        exit /b 1
    )
)

echo ✅ MongoDB está corriendo
echo.
echo Iniciando servidor Node.js...
echo.

cd /d "%~dp0"
node server.js

pause
