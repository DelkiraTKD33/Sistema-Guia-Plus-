const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
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
    carrera: {
        type: String,
        required: true
    },
    semestre: {
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
        default: ''
    },
    tutor: {
        type: String,
        default: 'Sin asignar'
    },
    observaciones: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: function() {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.nombre)}&background=3dd9b8&color=fff`;
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Estudiante', estudianteSchema);
