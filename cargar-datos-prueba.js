#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

const Usuario = require('./models/Usuario');
const Estudiante = require('./models/Estudiante');
const Tutor = require('./models/Tutor');
const Asignacion = require('./models/Asignacion');

// Conexión a BD
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guiaplus', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        process.exit(1);
    }
};

// Limpiar datos existentes
const limpiarDB = async () => {
    try {
        console.log('\n🗑️  Limpiando datos existentes...');
        await Usuario.deleteMany({});
        await Estudiante.deleteMany({});
        await Tutor.deleteMany({});
        await Asignacion.deleteMany({});
        console.log('✅ Datos limpios');
    } catch (error) {
        console.error('❌ Error al limpiar:', error.message);
    }
};

// Crear usuarios de prueba
const crearUsuarios = async () => {
    try {
        console.log('\n👥 Creando usuarios de prueba...');
        
        const usuarios = [
            // Administrador
            {
                username: 'admin',
                password: 'Admin123!',
                nombre: 'Administrador General',
                email: 'admin@guiaplus.edu',
                telefono: '555-0001',
                rol: 'admin',
                activo: true
            },
            // Coordinadores
            {
                username: 'coordinador1',
                password: 'Coord123!',
                nombre: 'Dr. Carlos Coordinador',
                email: 'carlos.coordinador@guiaplus.edu',
                telefono: '555-0002',
                rol: 'coordinador',
                activo: true
            },
            {
                username: 'coordinador2',
                password: 'Coord123!',
                nombre: 'Dra. María Coordinadora',
                email: 'maria.coordinadora@guiaplus.edu',
                telefono: '555-0003',
                rol: 'coordinador',
                activo: true
            },
            // Tutores
            {
                username: 'tutor_juan',
                password: 'Tutor123!',
                nombre: 'Dr. Juan Pérez',
                email: 'juan.perez@guiaplus.edu',
                telefono: '555-0010',
                rol: 'tutor',
                especialidad: 'Matemáticas y Cálculo',
                capacidadEstudiantes: 15,
                activo: true
            },
            {
                username: 'tutor_ana',
                password: 'Tutor123!',
                nombre: 'Dra. Ana Martínez',
                email: 'ana.martinez@guiaplus.edu',
                telefono: '555-0011',
                rol: 'tutor',
                especialidad: 'Física y Termodinámica',
                capacidadEstudiantes: 12,
                activo: true
            },
            {
                username: 'tutor_roberto',
                password: 'Tutor123!',
                nombre: 'Prof. Roberto Silva',
                email: 'roberto.silva@guiaplus.edu',
                telefono: '555-0012',
                rol: 'tutor',
                especialidad: 'Química Orgánica',
                capacidadEstudiantes: 18,
                activo: true
            },
            {
                username: 'tutor_carmen',
                password: 'Tutor123!',
                nombre: 'Lic. Carmen Rodríguez',
                email: 'carmen.rodriguez@guiaplus.edu',
                telefono: '555-0013',
                rol: 'tutor',
                especialidad: 'Literatura y Redacción',
                capacidadEstudiantes: 20,
                activo: true
            },
            // Estudiantes
            {
                username: 'estudiante_maria',
                password: 'Est123!',
                nombre: 'María García López',
                email: 'maria.garcia@estudiantes.edu',
                telefono: '555-0020',
                rol: 'estudiante',
                carrera: 'Ingeniería de Sistemas',
                semestre: '3er Semestre',
                activo: true
            },
            {
                username: 'estudiante_carlos',
                password: 'Est123!',
                nombre: 'Carlos López Sánchez',
                email: 'carlos.lopez@estudiantes.edu',
                telefono: '555-0021',
                rol: 'estudiante',
                carrera: 'Medicina',
                semestre: '2do Semestre',
                activo: true
            },
            {
                username: 'estudiante_laura',
                password: 'Est123!',
                nombre: 'Laura Sánchez Gómez',
                email: 'laura.sanchez@estudiantes.edu',
                telefono: '555-0022',
                rol: 'estudiante',
                carrera: 'Derecho',
                semestre: '1er Semestre',
                activo: true
            },
            {
                username: 'estudiante_pedro',
                password: 'Est123!',
                nombre: 'Pedro Ramírez Flores',
                email: 'pedro.ramirez@estudiantes.edu',
                telefono: '555-0023',
                rol: 'estudiante',
                carrera: 'Administración',
                semestre: '4to Semestre',
                activo: true
            },
            {
                username: 'estudiante_julia',
                password: 'Est123!',
                nombre: 'Julia Morales Pérez',
                email: 'julia.morales@estudiantes.edu',
                telefono: '555-0024',
                rol: 'estudiante',
                carrera: 'Ingeniería de Sistemas',
                semestre: '2do Semestre',
                activo: true
            },
            {
                username: 'estudiante_diego',
                password: 'Est123!',
                nombre: 'Diego Fuentes Torres',
                email: 'diego.fuentes@estudiantes.edu',
                telefono: '555-0025',
                rol: 'estudiante',
                carrera: 'Medicina',
                semestre: '3er Semestre',
                activo: true
            }
        ];

        const usuariosCreados = [];
        for (const userData of usuarios) {
            const usuario = new Usuario(userData);
            await usuario.save();
            usuariosCreados.push(usuario);
            console.log(`  ✅ ${userData.nombre} (${userData.rol})`);
        }

        return usuariosCreados;
    } catch (error) {
        console.error('❌ Error al crear usuarios:', error.message);
        throw error;
    }
};

// Crear tutores
const crearTutores = async () => {
    try {
        console.log('\n👨‍🏫 Creando tutores de prueba...');
        
        const tutores = [
            {
                id: 'TUT001',
                nombre: 'Dr. Juan Pérez',
                email: 'juan.perez@guiaplus.edu',
                telefono: '555-0010',
                especialidad: 'Matemáticas y Cálculo',
                estudiantes: 0,
                capacidad: 15,
                calificacion: 4.8,
                disponible: true
            },
            {
                id: 'TUT002',
                nombre: 'Dra. Ana Martínez',
                email: 'ana.martinez@guiaplus.edu',
                telefono: '555-0011',
                especialidad: 'Física y Termodinámica',
                estudiantes: 0,
                capacidad: 12,
                calificacion: 4.5,
                disponible: true
            },
            {
                id: 'TUT003',
                nombre: 'Prof. Roberto Silva',
                email: 'roberto.silva@guiaplus.edu',
                telefono: '555-0012',
                especialidad: 'Química Orgánica',
                estudiantes: 0,
                capacidad: 18,
                calificacion: 4.7,
                disponible: true
            },
            {
                id: 'TUT004',
                nombre: 'Lic. Carmen Rodríguez',
                email: 'carmen.rodriguez@guiaplus.edu',
                telefono: '555-0013',
                especialidad: 'Literatura y Redacción',
                estudiantes: 0,
                capacidad: 20,
                calificacion: 4.9,
                disponible: true
            }
        ];

        const tutoresCreados = [];
        for (const tutorData of tutores) {
            const tutor = new Tutor(tutorData);
            await tutor.save();
            tutoresCreados.push(tutor);
            console.log(`  ✅ ${tutorData.nombre}`);
        }

        return tutoresCreados;
    } catch (error) {
        console.error('❌ Error al crear tutores:', error.message);
        throw error;
    }
};

// Crear estudiantes
const crearEstudiantes = async () => {
    try {
        console.log('\n📚 Creando estudiantes de prueba...');
        
        const estudiantes = [
            {
                id: 'EST001',
                nombre: 'María García López',
                carrera: 'Ingeniería de Sistemas',
                semestre: '3er Semestre',
                email: 'maria.garcia@estudiantes.edu',
                telefono: '555-0020',
                tutor: 'Sin asignar'
            },
            {
                id: 'EST002',
                nombre: 'Carlos López Sánchez',
                carrera: 'Medicina',
                semestre: '2do Semestre',
                email: 'carlos.lopez@estudiantes.edu',
                telefono: '555-0021',
                tutor: 'Sin asignar'
            },
            {
                id: 'EST003',
                nombre: 'Laura Sánchez Gómez',
                carrera: 'Derecho',
                semestre: '1er Semestre',
                email: 'laura.sanchez@estudiantes.edu',
                telefono: '555-0022',
                tutor: 'Sin asignar'
            },
            {
                id: 'EST004',
                nombre: 'Pedro Ramírez Flores',
                carrera: 'Administración',
                semestre: '4to Semestre',
                email: 'pedro.ramirez@estudiantes.edu',
                telefono: '555-0023',
                tutor: 'Sin asignar'
            },
            {
                id: 'EST005',
                nombre: 'Julia Morales Pérez',
                carrera: 'Ingeniería de Sistemas',
                semestre: '2do Semestre',
                email: 'julia.morales@estudiantes.edu',
                telefono: '555-0024',
                tutor: 'Sin asignar'
            },
            {
                id: 'EST006',
                nombre: 'Diego Fuentes Torres',
                carrera: 'Medicina',
                semestre: '3er Semestre',
                email: 'diego.fuentes@estudiantes.edu',
                telefono: '555-0025',
                tutor: 'Sin asignar'
            }
        ];

        const estudiantesCreados = [];
        for (const estData of estudiantes) {
            const estudiante = new Estudiante(estData);
            await estudiante.save();
            estudiantesCreados.push(estudiante);
            console.log(`  ✅ ${estData.nombre}`);
        }

        return estudiantesCreados;
    } catch (error) {
        console.error('❌ Error al crear estudiantes:', error.message);
        throw error;
    }
};

// Crear asignaciones
const crearAsignaciones = async () => {
    try {
        console.log('\n🔗 Creando asignaciones de prueba...');
        
        const asignaciones = [
            {
                id: 'ASG001',
                estudianteId: 'EST001',
                estudianteNombre: 'María García López',
                tutorId: 'TUT001',
                tutorNombre: 'Dr. Juan Pérez',
                estado: 'Activa',
                progreso: 65,
                observaciones: 'Matemáticas Avanzadas'
            },
            {
                id: 'ASG002',
                estudianteId: 'EST002',
                estudianteNombre: 'Carlos López Sánchez',
                tutorId: 'TUT002',
                tutorNombre: 'Dra. Ana Martínez',
                estado: 'Activa',
                progreso: 45,
                observaciones: 'Física General'
            },
            {
                id: 'ASG003',
                estudianteId: 'EST005',
                estudianteNombre: 'Julia Morales Pérez',
                tutorId: 'TUT001',
                tutorNombre: 'Dr. Juan Pérez',
                estado: 'Activa',
                progreso: 30,
                observaciones: 'Cálculo I'
            },
            {
                id: 'ASG004',
                estudianteId: 'EST006',
                estudianteNombre: 'Diego Fuentes Torres',
                tutorId: 'TUT003',
                tutorNombre: 'Prof. Roberto Silva',
                estado: 'En espera',
                progreso: 0,
                observaciones: 'Preparación para Química II'
            }
        ];

        const asignacionesCreadas = [];
        for (const asgData of asignaciones) {
            const asignacion = new Asignacion(asgData);
            await asignacion.save();
            asignacionesCreadas.push(asignacion);
            console.log(`  ✅ ${asgData.estudianteNombre} → ${asgData.tutorNombre}`);
        }

        return asignacionesCreadas;
    } catch (error) {
        console.error('❌ Error al crear asignaciones:', error.message);
        throw error;
    }
};

// Actualizar contadores de tutores
const actualizarContadores = async () => {
    try {
        console.log('\n📊 Actualizando contadores...');
        
        const tutores = await Tutor.find();
        for (const tutor of tutores) {
            const asignaciones = await Asignacion.countDocuments({
                tutorId: tutor.id,
                estado: 'Activa'
            });
            tutor.estudiantes = asignaciones;
            await tutor.save();
            console.log(`  ✅ ${tutor.nombre}: ${asignaciones} estudiantes`);
        }
    } catch (error) {
        console.error('❌ Error al actualizar contadores:', error.message);
    }
};

// Mostrar resumen
const mostrarResumen = async () => {
    try {
        console.log('\n📋 RESUMEN DE DATOS CARGADOS:');
        console.log('═══════════════════════════════════════');
        
        const usuarios = await Usuario.countDocuments();
        const estudiantes = await Estudiante.countDocuments();
        const tutores = await Tutor.countDocuments();
        const asignaciones = await Asignacion.countDocuments();
        
        console.log(`  Usuarios: ${usuarios}`);
        console.log(`  Estudiantes: ${estudiantes}`);
        console.log(`  Tutores: ${tutores}`);
        console.log(`  Asignaciones: ${asignaciones}`);
        console.log('═══════════════════════════════════════');
        
        console.log('\n🔐 CREDENCIALES DE PRUEBA:');
        console.log('═══════════════════════════════════════');
        console.log('  Administrador:');
        console.log('    Username: admin');
        console.log('    Password: Admin123!');
        console.log('\n  Coordinador:');
        console.log('    Username: coordinador1');
        console.log('    Password: Coord123!');
        console.log('\n  Tutor:');
        console.log('    Username: tutor_juan');
        console.log('    Password: Tutor123!');
        console.log('\n  Estudiante:');
        console.log('    Username: estudiante_maria');
        console.log('    Password: Est123!');
        console.log('═══════════════════════════════════════');
    } catch (error) {
        console.error('❌ Error al mostrar resumen:', error.message);
    }
};

// Función principal
const main = async () => {
    try {
        console.log('\n');
        console.log('╔═══════════════════════════════════════════════════╗');
        console.log('║     CARGA DE DATOS DE PRUEBA - GUIAPLUS          ║');
        console.log('╚═══════════════════════════════════════════════════╝');
        
        await conectarDB();
        await limpiarDB();
        await crearUsuarios();
        await crearTutores();
        await crearEstudiantes();
        await crearAsignaciones();
        await actualizarContadores();
        await mostrarResumen();
        
        console.log('\n✅ DATOS DE PRUEBA CARGADOS EXITOSAMENTE\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error fatal:', error.message);
        process.exit(1);
    }
};

main();
