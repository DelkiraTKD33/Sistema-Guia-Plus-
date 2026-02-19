// Middleware para manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            error: 'Error de validación',
            mensaje: 'Los datos proporcionados no son válidos',
            detalles: errors
        });
    }

    // Error de duplicado (MongoDB)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            error: 'Datos duplicados',
            mensaje: `El ${field} ya existe en el sistema`
        });
    }

    // Error de cast (ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'ID inválido',
            mensaje: 'El formato del ID proporcionado no es válido'
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido',
            mensaje: 'El token de autenticación no es válido'
        });
    }

    // Error genérico del servidor
    res.status(err.status || 500).json({
        error: 'Error del servidor',
        mensaje: process.env.NODE_ENV === 'production' 
            ? 'Ocurrió un error interno del servidor' 
            : err.message
    });
};

// Middleware para rutas no encontradas
const notFound = (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        mensaje: `La ruta ${req.originalUrl} no existe`
    });
};

module.exports = {
    errorHandler,
    notFound
};