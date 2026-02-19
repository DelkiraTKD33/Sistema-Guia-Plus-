require('dotenv').config();
const mongoose = require('mongoose');
const Asignacion = require('./models/Asignacion');
const conectarDB = require('./config/database');

async function crearAsignacionesPrueba() {
    try {
        console.log('📝 CREANDO ASIGNACIONES DE PRUEBA\n');
        
        await conectarDB();

        const asignacionesPrueba = [
            {
                id: 'ASG001',
                estudianteId: 'EST001',
                estudianteNombre: 'María García',
                tutorId: 'TUT001',
                tutorNombre: 'Dr. Juan Pérez',
                fechaAsignacion: new Date('2025-01-15'),
                estado: 'Activa',
                progreso: 65,
                observaciones: 'Reforzar conceptos de cálculo diferencial e integral'
            },
            {
                id: 'ASG002',
                estudianteId: 'EST002',
                estudianteNombre: 'Carlos López',
                tutorId: 'TUT002',
                tutorNombre: 'Dra. Ana Martínez',
                fechaAsignacion: new Date('2025-01-10'),
                estado: 'Activa',
                progreso: 40,
                observaciones: 'Preparación para exámenes de anatomía'
            },
            {
                id: 'ASG003',
                estudianteId: 'EST003',
                estudianteNombre: 'Laura Sánchez',
                tutorId: 'TUT006',
                tutorNombre: 'Tutor de Prueba',
                fechaAsignacion: new Date('2025-01-20'),
                estado: 'En espera',
                progreso: 15,
                observaciones: 'Comprensión de principios constitucionales'
            }
        ];

        // Limpiar asignaciones existentes
        await Asignacion.deleteMany({});
        console.log('🧹 Asignaciones anteriores eliminadas');

        // Crear nuevas asignaciones
        for (const asigData of asignacionesPrueba) {
            const asignacion = new Asignacion(asigData);
            await asignacion.save();
            console.log(`✅ Asignación creada: ${asigData.id} - ${asigData.materia}`);
        }

        const total = await Asignacion.countDocuments();
        console.log(`\n📊 Total de asignaciones creadas: ${total}`);

        console.log('\n✅ Asignaciones de prueba creadas exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

crearAsignacionesPrueba();