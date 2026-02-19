const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    especialidad: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true
    },
    estudiantes: {
        type: Number,
        default: 0,
        min: 0
    },
    capacidad: {
        type: Number,
        default: 10,
        min: 1
    },
    calificacion: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    disponible: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
        default: function() {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.nombre)}&background=1e3a5f&color=fff`;
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tutor', tutorSchema);
