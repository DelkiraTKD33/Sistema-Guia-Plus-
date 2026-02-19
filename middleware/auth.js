// Middleware para verificar si el usuario está autenticado
const verificarAutenticacion = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next();
    }

    // Si es una petición AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({
            error: 'No autenticado',
            mensaje: 'Debes iniciar sesión para acceder a este recurso'
        });
    }

    // Si es una petición normal
    return res.redirect('/login');
};

// Middleware para verificar roles específicos
const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.session || !req.session.usuario) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(401).json({
                    error: 'No autenticado',
                    mensaje: 'Debes iniciar sesión'
                });
            }
            return res.redirect('/login');
        }

        if (!rolesPermitidos.includes(req.session.usuario.rol)) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(403).json({
                    error: 'Acceso denegado',
                    mensaje: 'No tienes permisos para acceder a este recurso'
                });
            }
            return res.status(403).send('Acceso denegado');
        }

        next();
    };
};

// Middleware para verificar permisos específicos
const verificarPermiso = (permiso) => {
    return (req, res, next) => {
        if (!req.session || !req.session.usuario) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(401).json({
                    error: 'No autenticado',
                    mensaje: 'Debes iniciar sesión'
                });
            }
            return res.redirect('/login');
        }

        const usuario = req.session.usuario;
        if (!usuario.permisos || !usuario.permisos.includes(permiso)) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(403).json({
                    error: 'Acceso denegado',
                    mensaje: `No tienes el permiso necesario: ${permiso}`
                });
            }
            return res.status(403).send('Acceso denegado');
        }

        next();
    };
};

// Middleware para verificar múltiples permisos (requiere TODOS)
const verificarPermisos = (...permisos) => {
    return (req, res, next) => {
        if (!req.session || !req.session.usuario) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(401).json({
                    error: 'No autenticado',
                    mensaje: 'Debes iniciar sesión'
                });
            }
            return res.redirect('/login');
        }

        const usuario = req.session.usuario;
        const tienePermisos = permisos.every(permiso => 
            usuario.permisos && usuario.permisos.includes(permiso)
        );

        if (!tienePermisos) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(403).json({
                    error: 'Acceso denegado',
                    mensaje: `No tienes los permisos necesarios: ${permisos.join(', ')}`
                });
            }
            return res.status(403).send('Acceso denegado');
        }

        next();
    };
};

// Middleware para verificar si puede acceder a un recurso específico
const verificarAccesoRecurso = (recurso, accion) => {
    return verificarPermiso(`${recurso}.${accion}`);
};

// Middleware para verificar si es admin
const verificarAdmin = verificarRol('admin');

// Middleware para verificar si es admin o coordinador
const verificarAdminOCoordinador = verificarRol('admin', 'coordinador');

// Middleware para verificar si es tutor
const verificarTutor = verificarRol('tutor');

// Middleware para verificar si es estudiante
const verificarEstudiante = verificarRol('estudiante');

// Middleware para verificar acceso a estudiantes (admin, coordinador, tutor)
const verificarAccesoEstudiantes = verificarRol('admin', 'coordinador', 'tutor');

// Middleware para verificar acceso a tutores (admin, coordinador)
const verificarAccesoTutores = verificarRol('admin', 'coordinador');

// Middleware para verificar si puede gestionar asignaciones
const verificarGestionAsignaciones = verificarRol('admin', 'coordinador');

// Middleware para verificar si puede ver reportes
const verificarAccesoReportes = verificarRol('admin', 'coordinador', 'tutor');

// Función helper para verificar permisos en controladores
const tienePermiso = (usuario, permiso) => {
    return usuario && usuario.permisos && usuario.permisos.includes(permiso);
};

// Función helper para verificar rol
const tieneRol = (usuario, ...roles) => {
    return usuario && roles.includes(usuario.rol);
};

module.exports = {
    verificarAutenticacion,
    verificarRol,
    verificarPermiso,
    verificarPermisos,
    verificarAccesoRecurso,
    verificarAdmin,
    verificarAdminOCoordinador,
    verificarTutor,
    verificarEstudiante,
    verificarAccesoEstudiantes,
    verificarAccesoTutores,
    verificarGestionAsignaciones,
    verificarAccesoReportes,
    tienePermiso,
    tieneRol
};
