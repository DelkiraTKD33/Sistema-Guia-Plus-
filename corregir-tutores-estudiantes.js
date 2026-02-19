require('dotenv').config();
const mongoose = require('mongoose');
const Estudiante = require('./models/Estudiante');
const Tutor = require('./models/Tutor');
const conectarDB = require('./config/database');

async function corregirTutoresEstudiantes() {
    try {
        console.log('🔧 CORRIGIENDO ASIGNACIONES DE TUTORES\n');
        
        await conectarDB();

        // Obtener todos los tutores
        const tutores = await Tutor.find();
        console.log('👨‍🏫 Tutores disponibles:');
        tutores.forEach(tutor => {
            console.log(`   - ${tutor.nombre} (${tutor.id})`);
        });
        console.log('');

        // Obtener todos los estudiantes
        const estudiantes = await Estudiante.find();
        
        // Mapeo de correcciones
        const correcciones = [
            { estudianteId: 'EST001', tutorNombre: 'Dr. Juan Pérez Mendoza' },
            { estudianteId: 'EST002', tutorNombre: 'Dra. Ana Martínez Silva' },
            { estudianteId: 'EST003', tutorNombre: 'Prof. Miguel Ángel Torres' },
            { estudianteId: 'EST004', tutorNombre: 'Lic. Carmen Rodríguez López' },
            { estudianteId: 'EST005', tutorNombre: 'Dr. Roberto Silva Castro' },
            { estudianteId: 'EST006', tutorNombre: 'Ing. Patricia Jiménez Ruiz' }
        ];

        console.log('🔄 Aplicando correcciones:');
        for (const correccion of correcciones) {
            const estudiante = await Estudiante.findOne({ id: correccion.estudianteId });
            if (estudiante) {
                const tutorAnterior = estudiante.tutor;
                estudiante.tutor = correccion.tutorNombre;
                await estudiante.save();
                console.log(`✅ ${estudiante.nombre}: "${tutorAnterior}" → "${correccion.tutorNombre}"`);
            }
        }

        console.log('\n✅ Correcciones aplicadas exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

corregirTutoresEstudiantes();