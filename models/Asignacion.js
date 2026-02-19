const mongoose = require('mongoose');

const asignacionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    estudianteId: {
        type: String,
        required: true,
        ref: 'Estudiante'
    },
    estudianteNombre: {
        type: String,
        default: ''
    },
    tutorId: {
        type: String,
        required: true,
        ref: 'Tutor'
    },
    tutorNombre: {
        type: String,
        default: ''
    },
    materia: {
        type: String,
        default: ''
    },
    fechaAsignacion: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['Activa', 'Finalizada', 'En espera', 'Cancelada'],
        default: 'Activa'
    },
    progreso: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    observaciones: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Si el estado es "Finalizada", el progreso debe ser 100%
// Si el estado es "Cancelada", el progreso se mantiene como está
asignacionSchema.pre('save', function(next) {
    if (this.estado === 'Finalizada') {
        this.progreso = 100;
    }
    next();
});

asignacionSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update && update.estado === 'Finalizada') {
        update.progreso = 100;
    }
    next();
});

module.exports = mongoose.model('Asignacion', asignacionSchema);
