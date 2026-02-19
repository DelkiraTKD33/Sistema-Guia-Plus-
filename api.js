// API configuration - use relative URL to match current server
const API_BASE_URL = '/api';

// Helper function for API calls with improved error handling
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Para incluir cookies de sesión
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        // Manejar diferentes tipos de respuesta
        if (response.status === 401) {
            // Redirigir al login si no está autenticado
            window.location.href = '/login';
            throw new Error('No autenticado');
        }

        if (response.status === 429) {
            throw new Error('Demasiadas peticiones. Intenta de nuevo más tarde.');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.mensaje || `Error ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    } catch (error) {
        console.error('API Error:', error);
        
        // Mostrar notificación de error al usuario
        if (typeof showNotification === 'function') {
            showNotification(error.message, 'error');
        }
        
        throw error;
    }
}

// Función para mostrar notificaciones (implementar en el frontend)
function showNotification(message, type = 'info') {
    // Esta función debe ser implementada en el frontend
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Estudiantes API
const estudiantesAPI = {
    obtenerTodos: async () => {
        return await apiCall('/estudiantes');
    },

    obtenerPorId: async (id) => {
        return await apiCall(`/estudiantes/${id}`);
    },

    crear: async (estudiante) => {
        return await apiCall('/estudiantes', 'POST', estudiante);
    },

    actualizar: async (id, estudiante) => {
        return await apiCall(`/estudiantes/${id}`, 'PUT', estudiante);
    },

    eliminar: async (id) => {
        return await apiCall(`/estudiantes/${id}`, 'DELETE');
    }
};

// Tutores API
const tutoresAPI = {
    obtenerTodos: async () => {
        return await apiCall('/tutores');
    },

    obtenerPorId: async (id) => {
        return await apiCall(`/tutores/${id}`);
    },

    crear: async (tutor) => {
        return await apiCall('/tutores', 'POST', tutor);
    },

    actualizar: async (id, tutor) => {
        return await apiCall(`/tutores/${id}`, 'PUT', tutor);
    },

    eliminar: async (id) => {
        return await apiCall(`/tutores/${id}`, 'DELETE');
    }
};

// Asignaciones API
const asignacionesAPI = {
    obtenerTodas: async () => {
        return await apiCall('/asignaciones');
    },

    obtenerPorId: async (id) => {
        return await apiCall(`/asignaciones/${id}`);
    },

    crear: async (asignacion) => {
        return await apiCall('/asignaciones', 'POST', asignacion);
    },

    actualizar: async (id, asignacion) => {
        return await apiCall(`/asignaciones/${id}`, 'PUT', asignacion);
    },

    eliminar: async (id) => {
        return await apiCall(`/asignaciones/${id}`, 'DELETE');
    }
};

// Usuarios API
const usuariosAPI = {
    obtenerTodos: async () => {
        return await apiCall('/usuarios');
    },

    obtenerPorId: async (id) => {
        return await apiCall(`/usuarios/${id}`);
    },

    crear: async (usuario) => {
        return await apiCall('/usuarios', 'POST', usuario);
    },

    actualizar: async (id, usuario) => {
        return await apiCall(`/usuarios/${id}`, 'PUT', usuario);
    },

    eliminar: async (id) => {
        return await apiCall(`/usuarios/${id}`, 'DELETE');
    }
};

// Reportes API
const reportesAPI = {
    obtenerResumen: async () => {
        return await apiCall('/reportes/resumen');
    },

    obtenerAsignacionesPorMes: async () => {
        return await apiCall('/reportes/asignaciones-por-mes');
    },

    obtenerDistribucionCarreras: async () => {
        return await apiCall('/reportes/distribucion-carreras');
    },

    obtenerDesempenoTutores: async () => {
        return await apiCall('/reportes/desempenio-tutores');
    },

    exportarReporte: async (tipo, formato = 'pdf') => {
        return await apiCall(`/reportes/exportar?tipo=${tipo}&formato=${formato}`);
    }
};
