const fs = require('fs');
const path = require('path');

// Archivos esenciales que NO se deben eliminar
const archivosEsenciales = [
    // Principales
    'server.js', 'package.json', 'package-lock.json', '.env', '.gitignore', '.prettierrc', 'eslint.config.js',
    
    // Frontend
    'index.html', 'login.html', 'styles.css', 'script.js', 'api.js',
    
    // Funcionalidad específica
    'asignaciones-tutores-funcionalidad.js', 'usuarios-funcionalidad.js', 'reportes-nuevas.js', 'tutores-funcionalidad.js',
    
    // Scripts de utilidad
    'cargar-datos-prueba.js', 'verificar-roles.js', 'crear-asignaciones-prueba.js', 'corregir-tutores-estudiantes.js',
    
    // Documentación final
    'README.md', 'CORRECCIONES_APLICADAS_FINAL.md', 'ARCHIVOS_ESENCIALES.txt',
    
    // Archivos de inicio
    'INICIAR-SISTEMA.bat', 'iniciar-servidor-mongodb.bat',
    
    // Este script
    'limpiar-archivos.js'
];

// Directorios esenciales que NO se deben eliminar
const directoriosEsenciales = [
    'routes', 'models', 'middleware', 'config', 'assets', 'node_modules', '.vscode'
];

function limpiarArchivos() {
    console.log('🧹 INICIANDO LIMPIEZA DE ARCHIVOS INNECESARIOS\n');
    
    let archivosEliminados = 0;
    let errores = 0;
    
    try {
        // Leer todos los archivos del directorio actual
        const archivos = fs.readdirSync('.');
        
        console.log(`📁 Total de archivos encontrados: ${archivos.length}\n`);
        
        archivos.forEach(archivo => {
            const rutaCompleta = path.join('.', archivo);
            const stats = fs.statSync(rutaCompleta);
            
            // Solo procesar archivos (no directorios)
            if (stats.isFile()) {
                // Verificar si el archivo NO está en la lista de esenciales
                if (!archivosEsenciales.includes(archivo)) {
                    try {
                        fs.unlinkSync(rutaCompleta);
                        console.log(`🗑️  Eliminado: ${archivo}`);
                        archivosEliminados++;
                    } catch (error) {
                        console.log(`❌ Error al eliminar ${archivo}: ${error.message}`);
                        errores++;
                    }
                } else {
                    console.log(`✅ Mantenido: ${archivo}`);
                }
            } else if (stats.isDirectory()) {
                if (directoriosEsenciales.includes(archivo)) {
                    console.log(`📁 Directorio mantenido: ${archivo}`);
                } else {
                    console.log(`📁 Directorio encontrado: ${archivo} (no procesado)`);
                }
            }
        });
        
        console.log(`\n📊 RESUMEN DE LIMPIEZA:`);
        console.log(`   ✅ Archivos eliminados: ${archivosEliminados}`);
        console.log(`   ❌ Errores: ${errores}`);
        console.log(`   📁 Archivos esenciales mantenidos: ${archivosEsenciales.length}`);
        
        console.log('\n✅ LIMPIEZA COMPLETADA');
        console.log('\n🎯 ARCHIVOS RESTANTES (ESENCIALES):');
        
        // Mostrar archivos restantes
        const archivosRestantes = fs.readdirSync('.').filter(archivo => {
            return fs.statSync(archivo).isFile();
        });
        
        archivosRestantes.forEach(archivo => {
            console.log(`   📄 ${archivo}`);
        });
        
        console.log(`\n📊 Total de archivos restantes: ${archivosRestantes.length}`);
        
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error.message);
    }
}

// Ejecutar limpieza
limpiarArchivos();