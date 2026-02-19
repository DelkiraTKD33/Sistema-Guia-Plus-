const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    telefono: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        enum: ['admin', 'coordinador', 'tutor', 'estudiante'],
        default: 'estudiante'
    },
    activo: {
        type: Boolean,
        default: true
    },
    ultimoAcceso: {
        type: Date
    },
    // Campos específicos por rol
    permisos: {
        type: [String],
        default: function() {
            return this.obtenerPermisosPorRol(this.rol);
        }
    },
    // Para tutores
    especialidad: {
        type: String,
        required: function() { 
            return this.rol === 'tutor' && this.isNew; 
        }
    },
    capacidadEstudiantes: {
        type: Number,
        default: function() { return this.rol === 'tutor' ? 10 : 0; }
    },
    // Para estudiantes
    carrera: {
        type: String,
        required: function() { 
            return this.rol === 'estudiante' && this.isNew; 
        }
    },
    semestre: {
        type: String,
        required: function() { 
            return this.rol === 'estudiante' && this.isNew; 
        }
    },
    // Configuración de notificaciones
    notificaciones: {
        email: { type: Boolean, default: true },
        sistema: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});

// Definir permisos por rol
usuarioSchema.statics.PERMISOS = {
    // Gestión de usuarios
    'usuarios.crear': 'Crear usuarios',
    'usuarios.leer': 'Ver usuarios',
    'usuarios.actualizar': 'Actualizar usuarios',
    'usuarios.eliminar': 'Eliminar usuarios',
    
    // Gestión de estudiantes
    'estudiantes.crear': 'Crear estudiantes',
    'estudiantes.leer': 'Ver estudiantes',
    'estudiantes.actualizar': 'Actualizar estudiantes',
    'estudiantes.eliminar': 'Eliminar estudiantes',
    'estudiantes.asignar': 'Asignar tutores a estudiantes',
    
    // Gestión de tutores
    'tutores.crear': 'Crear tutores',
    'tutores.leer': 'Ver tutores',
    'tutores.actualizar': 'Actualizar tutores',
    'tutores.eliminar': 'Eliminar tutores',
    
    // Gestión de asignaciones
    'asignaciones.crear': 'Crear asignaciones',
    'asignaciones.leer': 'Ver asignaciones',
    'asignaciones.actualizar': 'Actualizar asignaciones',
    'asignaciones.eliminar': 'Eliminar asignaciones',
    
    // Reportes y estadísticas
    'reportes.ver': 'Ver reportes',
    'reportes.exportar': 'Exportar reportes',
    
    // Configuración del sistema
    'sistema.configurar': 'Configurar sistema',
    'sistema.logs': 'Ver logs del sistema'
};

// Permisos por rol
usuarioSchema.statics.PERMISOS_POR_ROL = {
    admin: [
        'usuarios.crear', 'usuarios.leer', 'usuarios.actualizar', 'usuarios.eliminar',
        'estudiantes.crear', 'estudiantes.leer', 'estudiantes.actualizar', 'estudiantes.eliminar', 'estudiantes.asignar',
        'tutores.crear', 'tutores.leer', 'tutores.actualizar', 'tutores.eliminar',
        'asignaciones.crear', 'asignaciones.leer', 'asignaciones.actualizar', 'asignaciones.eliminar',
        'reportes.ver', 'reportes.exportar',
        'sistema.configurar', 'sistema.logs'
    ],
    coordinador: [
        'estudiantes.crear', 'estudiantes.leer', 'estudiantes.actualizar', 'estudiantes.asignar',
        'tutores.leer', 'tutores.actualizar',
        'asignaciones.crear', 'asignaciones.leer', 'asignaciones.actualizar', 'asignaciones.eliminar',
        'reportes.ver', 'reportes.exportar'
    ],
    tutor: [
        'estudiantes.leer',
        'asignaciones.leer', 'asignaciones.actualizar',
        'reportes.ver'
    ],
    estudiante: [
        'asignaciones.leer'
    ]
};

// Método para obtener permisos por rol
usuarioSchema.methods.obtenerPermisosPorRol = function(rol) {
    return this.constructor.PERMISOS_POR_ROL[rol] || [];
};

// Método para verificar si tiene un permiso específico
usuarioSchema.methods.tienePermiso = function(permiso) {
    return this.permisos.includes(permiso);
};

// Método para verificar múltiples permisos
usuarioSchema.methods.tienePermisos = function(permisos) {
    return permisos.every(permiso => this.permisos.includes(permiso));
};

// Método para verificar si puede acceder a un recurso
usuarioSchema.methods.puedeAcceder = function(recurso, accion) {
    const permiso = `${recurso}.${accion}`;
    return this.tienePermiso(permiso);
};

// Encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        // Actualizar permisos si cambió el rol
        if (this.isModified('rol')) {
            this.permisos = this.obtenerPermisosPorRol(this.rol);
        }
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para obtener datos públicos del usuario
usuarioSchema.methods.obtenerDatosPublicos = function() {
    return {
        id: this._id,
        username: this.username,
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        rol: this.rol,
        activo: this.activo,
        ultimoAcceso: this.ultimoAcceso,
        permisos: this.permisos,
        especialidad: this.especialidad,
        capacidadEstudiantes: this.capacidadEstudiantes,
        carrera: this.carrera,
        semestre: this.semestre
    };
};

// Método para obtener información del rol
usuarioSchema.methods.obtenerInfoRol = function() {
    const rolesInfo = {
        admin: {
            nombre: 'Administrador',
            descripcion: 'Acceso completo al sistema',
            color: '#e74c3c'
        },
        coordinador: {
            nombre: 'Coordinador Académico',
            descripcion: 'Gestión de estudiantes y asignaciones',
            color: '#f39c12'
        },
        tutor: {
            nombre: 'Tutor',
            descripcion: 'Seguimiento de estudiantes asignados',
            color: '#3498db'
        },
        estudiante: {
            nombre: 'Estudiante',
            descripcion: 'Consulta de asignaciones y progreso',
            color: '#2ecc71'
        }
    };
    
    return rolesInfo[this.rol] || rolesInfo.estudiante;
};

module.exports = mongoose.model('Usuario', usuarioSchema);
