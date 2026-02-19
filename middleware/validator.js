const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Error de validación',
            mensaje: 'Los datos proporcionados no son válidos',
            detalles: errors.array().map(err => ({
                campo: err.path,
                mensaje: err.msg,
                valor: err.value
            }))
        });
    }
    next();
};

// Validaciones para estudiantes
const validateEstudiante = [
    body('id')
        .notEmpty()
        .withMessage('El ID es requerido')
        .isLength({ min: 3, max: 20 })
        .withMessage('El ID debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z0-9-_]+$/)
        .withMessage('El ID solo puede contener letras, números, guiones y guiones bajos'),
    
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    
    body('telefono')
        .notEmpty()
        .withMessage('El teléfono es requerido')
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Formato de teléfono inválido'),
    
    body('carrera')
        .notEmpty()
        .withMessage('La carrera es requerida')
        .isLength({ min: 2, max: 100 })
        .withMessage('La carrera debe tener entre 2 y 100 caracteres'),
    
    body('semestre')
        .notEmpty()
        .withMessage('El semestre es requerido'),
    
    handleValidationErrors
];

// Validaciones para tutores
const validateTutor = [
    body('id')
        .notEmpty()
        .withMessage('El ID es requerido')
        .isLength({ min: 3, max: 20 })
        .withMessage('El ID debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z0-9-_]+$/)
        .withMessage('El ID solo puede contener letras, números, guiones y guiones bajos'),
    
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    
    body('telefono')
        .notEmpty()
        .withMessage('El teléfono es requerido')
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Formato de teléfono inválido'),
    
    body('especialidad')
        .notEmpty()
        .withMessage('La especialidad es requerida')
        .isLength({ min: 2, max: 100 })
        .withMessage('La especialidad debe tener entre 2 y 100 caracteres'),
    
    body('capacidad')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('La capacidad debe ser un número entre 1 y 50'),
    
    handleValidationErrors
];

// Validaciones para login
const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('El username es requerido')
        .isLength({ min: 3, max: 50 })
        .withMessage('El username debe tener entre 3 y 50 caracteres')
        .trim()
        .toLowerCase(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    
    handleValidationErrors
];

// Validación para parámetros ID
const validateId = [
    param('id')
        .notEmpty()
        .withMessage('El ID es requerido')
        .isLength({ min: 1, max: 50 })
        .withMessage('ID inválido'),
    
    handleValidationErrors
];

module.exports = {
    validateEstudiante,
    validateTutor,
    validateLogin,
    validateId,
    handleValidationErrors
};