const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Rate limiting para login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos de login por IP
    message: {
        error: 'Demasiados intentos de login',
        mensaje: 'Has excedido el límite de intentos. Intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting general para API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: {
        error: 'Demasiadas peticiones',
        mensaje: 'Has excedido el límite de peticiones. Intenta de nuevo más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Configuración de Helmet para seguridad
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://ui-avatars.com"],
            scriptSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false
});

module.exports = {
    loginLimiter,
    apiLimiter,
    helmetConfig
};