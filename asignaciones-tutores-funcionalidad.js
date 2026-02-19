// =====================================================
// GESTIÓN DE TUTORES Y ASIGNACIONES - Funciones Completas
// =====================================================

let tutoresActuales = [];
let asignacionesActuales = [];

// ========== TUTORES ==========

/**
 * Cargar tutores desde API
 */
async function cargarTutoresDesdeAPI() {
    try {
        tutoresActuales = await tutoresAPI.obtenerTodos();
        renderizarTarjetasTutores(tutoresActuales);
        return tutoresActuales;
    } catch (error) {
        console.error('Error cargando tutores:', error);
        mostrarToast('Error al cargar tutores', 'error');
        return [];
    }
}

/**
 * Renderizar tarjetas de tutores
 */
function renderizarTarjetasTutores(tutores) {
    const container = document.querySelector('.tutores-grid');
    if (!container) return;

    if (tutores.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p>No hay tutores registrados</p></div>';
        return;
    }

    container.innerHTML = tutores.map(tutor => {
        const disponible = tutor.estudiantes < tutor.capacidad;
        const statusClass = disponible ? 'active' : 'busy';
        const statusText = disponible ? 'Disponible' : 'Ocupado';
        
        return `
            <div class="tutor-card" data-tutor-id="${tutor.id}">
                <div class="tutor-card-header">
                    <img src="${tutor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.nombre)}`}" 
                         alt="Tutor" class="tutor-avatar">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="tutor-card-body">
                    <h3>${tutor.nombre}</h3>
                    <p class="specialty">${tutor.especialidad}</p>
                    <div class="tutor-stats">
                        <div class="stat">
                            <i class="fas fa-users"></i>
                            <span>${tutor.estudiantes}/${tutor.capacidad} estudiantes</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-envelope"></i>
                            <span>${tutor.email}</span>
                        </div>
                    </div>
                    <div class="rating">
                        ${generarEstrellas(tutor.calificacion)}
                        <span>${(tutor.calificacion || 0).toFixed(1)}</span>
                    </div>
                </div>
                <div class="tutor-card-footer">
                    <button class="btn-secondary" onclick="mostrarPerfilTutor('${tutor.id}')">Ver Perfil</button>
                    <button class="btn-primary ${!disponible ? 'disabled' : ''}" 
                            onclick="abrirAsignarAEstudiante('${tutor.id}')"
                            ${!disponible ? 'disabled' : ''}>
                        ${disponible ? 'Asignar Estudiante' : 'Sin Capacidad'}
                    </button>
                    <button class="btn-icon" onclick="editarTutor('${tutor.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" onclick="confirmarEliminarTutor('${tutor.id}', '${tutor.nombre}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Generar estrellas para calificación
 */
function generarEstrellas(calificacion) {
    const estrellas = Math.floor(calificacion || 0);
    const media = (calificacion || 0) % 1 !== 0;
    let html = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < estrellas) {
            html += '<i class="fas fa-star"></i>';
        } else if (i === estrellas && media) {
            html += '<i class="fas fa-star-half-alt"></i>';
        } else {
            html += '<i class="far fa-star"></i>';
        }
    }
    return html;
}

/**
 * Abrir modal para crear nuevo tutor
 */
function abrirCrearTutor() {
    limpiarFormularioTutor();
    document.getElementById('modalTutorTitulo').textContent = 'Agregar Nuevo Tutor';
    document.getElementById('tutorId').value = '';
    openModal('modalTutor');
}

/**
 * Editar tutor existente
 */
async function editarTutor(tutorId) {
    try {
        const tutor = await tutoresAPI.obtenerPorId(tutorId);
        document.getElementById('modalTutorTitulo').textContent = 'Editar Tutor';
        document.getElementById('tutorId').value = tutor.id;
        document.getElementById('tutorNombre').value = tutor.nombre;
        document.getElementById('tutorEspecialidad').value = tutor.especialidad;
        document.getElementById('tutorEmail').value = tutor.email;
        document.getElementById('tutorTelefono').value = tutor.telefono || '';
        document.getElementById('tutorCapacidad').value = tutor.capacidad || 10;
        openModal('modalTutor');
    } catch (error) {
        mostrarToast('Error al cargar tutor', 'error');
    }
}

/**
 * Guardar tutor (crear o actualizar)
 */
async function guardarTutor() {
    try {
        const tutorId = document.getElementById('tutorId').value;
        const tutorData = {
            nombre: document.getElementById('tutorNombre').value.trim(),
            especialidad: document.getElementById('tutorEspecialidad').value.trim(),
            email: document.getElementById('tutorEmail').value.trim().toLowerCase(),
            telefono: document.getElementById('tutorTelefono').value.trim(),
            capacidad: parseInt(document.getElementById('tutorCapacidad').value) || 10
        };

        // Validaciones
        if (!tutorData.nombre) {
            mostrarToast('El nombre es requerido', 'warning');
            return;
        }
        if (!tutorData.especialidad) {
            mostrarToast('La especialidad es requerida', 'warning');
            return;
        }
        if (!tutorData.email || !tutorData.email.includes('@')) {
            mostrarToast('Email inválido', 'warning');
            return;
        }
        if (tutorData.capacidad < 1) {
            mostrarToast('La capacidad debe ser mayor a 0', 'warning');
            return;
        }

        if (tutorId) {
            // Actualizar
            await tutoresAPI.actualizar(tutorId, tutorData);
            mostrarToast('Tutor actualizado exitosamente', 'success');
        } else {
            // Crear
            tutorData.id = generarId('TUT');
            await tutoresAPI.crear(tutorData);
            mostrarToast('Tutor creado exitosamente', 'success');
        }

        closeModal('modalTutor');
        await cargarTutoresDesdeAPI();
    } catch (error) {
        mostrarToast(error.message || 'Error al guardar tutor', 'error');
    }
}

/**
 * Confirmar eliminación de tutor
 */
async function confirmarEliminarTutor(tutorId, nombre) {
    const confirmado = await mostrarConfirmacion(
        'Eliminar Tutor',
        `¿Estás seguro de que deseas eliminar al tutor <strong>"${nombre}"</strong>? Esta acción no se puede deshacer.`,
        { tipo: 'danger', textoConfirmar: 'Eliminar', clasePrimaria: 'danger' }
    );
    if (confirmado) eliminarTutor(tutorId);
}

/**
 * Eliminar tutor
 */
async function eliminarTutor(tutorId) {
    try {
        await tutoresAPI.eliminar(tutorId);
        mostrarToast('Tutor eliminado exitosamente', 'success');
        await cargarTutoresDesdeAPI();
    } catch (error) {
        mostrarToast('Error al eliminar tutor', 'error');
    }
}

/**
 * Mostrar perfil de tutor
 */
async function mostrarPerfilTutor(tutorId) {
    try {
        const tutor = await tutoresAPI.obtenerPorId(tutorId);
        const estudiantesDelTutor = asignacionesActuales.filter(a => a.tutorId === tutorId && a.estado === 'Activa');

        const contenido = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e9ecef;">
                <img src="${tutor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.nombre)}&background=1e3a5f&color=fff`}"
                     alt="${tutor.nombre}" style="width: 60px; height: 60px; border-radius: 50%;">
                <div>
                    <h3 style="margin: 0; color: #1e3a5f;">${tutor.nombre}</h3>
                    <p style="margin: 4px 0 0; color: #3dd9b8; font-weight: 500;">${tutor.especialidad}</p>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Email</small>
                    <p style="margin: 4px 0 0; font-weight: 500;">${tutor.email}</p>
                </div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Teléfono</small>
                    <p style="margin: 4px 0 0; font-weight: 500;">${tutor.telefono || 'No registrado'}</p>
                </div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Calificación</small>
                    <p style="margin: 4px 0 0; font-weight: 500;">${generarEstrellas(tutor.calificacion)} ${(tutor.calificacion || 0).toFixed(1)}/5.0</p>
                </div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Capacidad</small>
                    <p style="margin: 4px 0 0; font-weight: 500;">${tutor.estudiantes}/${tutor.capacidad} estudiantes</p>
                </div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Disponible</small>
                    <p style="margin: 4px 0 0; font-weight: 500;">${tutor.disponible !== false ? '<span style="color:#2ecc71;">Sí</span>' : '<span style="color:#e74c3c;">No</span>'}</p>
                </div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Estudiantes Activos</small>
                    <p style="margin: 4px 0 0; font-weight: 500;">${estudiantesDelTutor.length}</p>
                </div>
            </div>
        `;
        mostrarModalInfo('Perfil del Tutor', contenido);
    } catch (error) {
        mostrarToast('Error al cargar perfil del tutor', 'error');
    }
}

/**
 * Limpiar formulario de tutor
 */
function limpiarFormularioTutor() {
    document.getElementById('tutorId').value = '';
    document.getElementById('tutorNombre').value = '';
    document.getElementById('tutorEspecialidad').value = '';
    document.getElementById('tutorEmail').value = '';
    document.getElementById('tutorTelefono').value = '';
    document.getElementById('tutorCapacidad').value = '10';
}

// ========== ASIGNACIONES ==========

/**
 * Cargar asignaciones desde API
 */
async function cargarAsignacionesDesdeAPI() {
    try {
        asignacionesActuales = await asignacionesAPI.obtenerTodas();
        renderizarTablaAsignaciones(asignacionesActuales);
        return asignacionesActuales;
    } catch (error) {
        console.error('Error cargando asignaciones:', error);
        mostrarToast('Error al cargar asignaciones', 'error');
        return [];
    }
}

/**
 * Renderizar tabla de asignaciones
 */
function renderizarTablaAsignaciones(asignaciones) {
    const tbody = document.getElementById('asignacionesTableBody');
    if (!tbody) return;

    if (asignaciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;"><i class="fas fa-inbox"></i> No hay asignaciones</td></tr>';
        return;
    }

    tbody.innerHTML = asignaciones.map(asignacion => {
        const statusClass = asignacion.estado === 'Activa' ? 'active' : asignacion.estado === 'Finalizada' ? 'completed' : 'pending';
        // Si está finalizada, el progreso siempre es 100%
        const progresoMostrar = asignacion.estado === 'Finalizada' ? 100 : (asignacion.progreso || 0);

        return `
            <tr>
                <td><strong>${asignacion.id}</strong></td>
                <td>
                    <div class="user-cell">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(asignacion.estudianteNombre)}&background=3dd9b8&color=fff"
                             alt="Estudiante">
                        <span>${asignacion.estudianteNombre}</span>
                    </div>
                </td>
                <td>
                    <div class="user-cell">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(asignacion.tutorNombre)}&background=1e3a5f&color=fff"
                             alt="Tutor">
                        <span>${asignacion.tutorNombre}</span>
                    </div>
                </td>
                <td>${asignacion.observaciones || '-'}</td>
                <td>${new Date(asignacion.fechaAsignacion).toLocaleDateString('es-ES')}</td>
                <td><span class="status-badge ${statusClass}">${asignacion.estado}</span></td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progresoMostrar}%"></div>
                    </div>
                    <span class="progress-text">${progresoMostrar}%</span>
                </td>
                <td>
                    <button class="btn-icon" onclick="mostrarDetallesAsignacion('${asignacion.id}')" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editarAsignacion('${asignacion.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" onclick="confirmarEliminarAsignacion('${asignacion.id}')" title="Finalizar">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Abrir modal para crear nueva asignación
 */
async function abrirCrearAsignacion() {
    try {
        const estudiantes = await estudiantesAPI.obtenerTodos();
        const tutores = await tutoresAPI.obtenerTodos();

        const selectEstudiante = document.getElementById('selectEstudianteAsignacion');
        const selectTutor = document.getElementById('selectTutorAsignacion');

        if (selectEstudiante) {
            selectEstudiante.innerHTML = '<option value="">-- Seleccionar estudiante --</option>' +
                estudiantes.map(e => `<option value="${e.id}">${e.nombre} - ${e.id}</option>`).join('');
        }

        if (selectTutor) {
            selectTutor.innerHTML = '<option value="">-- Seleccionar tutor --</option>' +
                tutores.filter(t => t.estudiantes < t.capacidad).map(t => `<option value="${t.id}">${t.nombre} - ${t.especialidad}</option>`).join('');
            selectTutor.disabled = false;
        }

        limpiarFormularioAsignacion();
        document.getElementById('asignacionId').value = '';
        openModal('modalAsignacion');
    } catch (error) {
        console.error('Error al abrir formulario de asignación:', error);
        mostrarToast('Error al abrir formulario de asignación', 'error');
    }
}

/**
 * Abrir modal para asignar a estudiante desde tutor disponible
 */
async function abrirAsignarAEstudiante(tutorId) {
    try {
        const tutor = await tutoresAPI.obtenerPorId(tutorId);
        const estudiantes = await estudiantesAPI.obtenerTodos();

        const selectEstudiante = document.getElementById('selectEstudianteAsignacion');
        const selectTutor = document.getElementById('selectTutorAsignacion');

        if (selectEstudiante) {
            selectEstudiante.innerHTML = '<option value="">-- Seleccionar estudiante --</option>' +
                estudiantes
                    .filter(e => !e.tutor || e.tutor === 'Sin asignar')
                    .map(e => `<option value="${e.id}">${e.nombre} - ${e.id}</option>`)
                    .join('');
        }

        limpiarFormularioAsignacion();
        document.getElementById('asignacionId').value = '';

        // Preseleccionar tutor y deshabilitar el select
        if (selectTutor) {
            selectTutor.innerHTML = `<option value="${tutor.id}">${tutor.nombre} - ${tutor.especialidad}</option>`;
            selectTutor.value = tutorId;
            selectTutor.disabled = true;
        }

        openModal('modalAsignacion');
    } catch (error) {
        console.error('Error al cargar formulario de asignación:', error);
        mostrarToast('Error al cargar el formulario', 'error');
    }
}

/**
 * Guardar asignación (crear o actualizar)
 */
async function guardarAsignacion() {
    try {
        const asignacionId = document.getElementById('asignacionId').value;
        const estudianteId = document.getElementById('selectEstudianteAsignacion')?.value;
        const tutorId = document.getElementById('selectTutorAsignacion')?.value;
        const materia = document.getElementById('inputMateriaAsignacion')?.value?.trim() || '';
        const fechaInicio = document.getElementById('inputFechaAsignacion')?.value || '';
        const estado = document.getElementById('inputEstadoAsignacion')?.value || 'Activa';
        const progreso = parseInt(document.getElementById('inputProgresoAsignacion')?.value) || 0;

        if (!estudianteId) {
            mostrarToast('Selecciona un estudiante', 'warning');
            return;
        }
        if (!tutorId) {
            mostrarToast('Selecciona un tutor', 'warning');
            return;
        }

        const estudiante = await estudiantesAPI.obtenerPorId(estudianteId);
        const tutor = await tutoresAPI.obtenerPorId(tutorId);

        if (!asignacionId) {
            const asignacionesTutor = asignacionesActuales.filter(a =>
                a.tutorId === tutorId && a.estado === 'Activa'
            );
            if (asignacionesTutor.length >= tutor.capacidad) {
                mostrarToast('El tutor no tiene capacidad disponible', 'warning');
                return;
            }
        }

        // Si el estado es "Finalizada", forzar progreso a 100%
        const progresoFinal = estado === 'Finalizada' ? 100 : progreso;

        const asignacionData = {
            estudianteId: estudiante.id,
            estudianteNombre: estudiante.nombre,
            tutorId: tutor.id,
            tutorNombre: tutor.nombre,
            materia: materia,
            estado: estado,
            progreso: progresoFinal,
            observaciones: materia
        };

        if (fechaInicio) {
            asignacionData.fechaAsignacion = new Date(fechaInicio);
        }

        if (asignacionId) {
            await asignacionesAPI.actualizar(asignacionId, asignacionData);
            mostrarToast('Asignación actualizada exitosamente', 'success');
        } else {
            asignacionData.id = generarId('ASG');
            await asignacionesAPI.crear(asignacionData);
            mostrarToast('Asignación creada exitosamente', 'success');
        }

        // Rehabilitar el select de tutor por si estaba deshabilitado
        const selectTutor = document.getElementById('selectTutorAsignacion');
        if (selectTutor) selectTutor.disabled = false;

        closeModal('modalAsignacion');
        await cargarAsignacionesDesdeAPI();
        await cargarTutoresDesdeAPI();
    } catch (error) {
        mostrarToast(error.message || 'Error al guardar asignación', 'error');
    }
}

/**
 * Editar asignación
 */
async function editarAsignacion(asignacionId) {
    try {
        const asignacion = await asignacionesAPI.obtenerPorId(asignacionId);
        const estudiantes = await estudiantesAPI.obtenerTodos();
        const tutores = await tutoresAPI.obtenerTodos();

        const selectEstudiante = document.getElementById('selectEstudianteAsignacion');
        const selectTutor = document.getElementById('selectTutorAsignacion');

        if (selectEstudiante) {
            selectEstudiante.innerHTML = '<option value="">-- Seleccionar estudiante --</option>' +
                estudiantes.map(e => `<option value="${e.id}">${e.nombre} - ${e.id}</option>`).join('');
            selectEstudiante.value = asignacion.estudianteId;
        }

        if (selectTutor) {
            selectTutor.innerHTML = '<option value="">-- Seleccionar tutor --</option>' +
                tutores.map(t => `<option value="${t.id}">${t.nombre} - ${t.especialidad}</option>`).join('');
            selectTutor.value = asignacion.tutorId;
            selectTutor.disabled = false;
        }

        document.getElementById('asignacionId').value = asignacion.id;
        const materiaInput = document.getElementById('inputMateriaAsignacion');
        if (materiaInput) materiaInput.value = asignacion.materia || asignacion.observaciones || '';
        const estadoSelect = document.getElementById('inputEstadoAsignacion');
        if (estadoSelect) estadoSelect.value = asignacion.estado || 'Activa';
        const progresoInput = document.getElementById('inputProgresoAsignacion');
        if (progresoInput) progresoInput.value = asignacion.progreso || 0;

        openModal('modalAsignacion');
    } catch (error) {
        mostrarToast('Error al cargar asignación', 'error');
    }
}

/**
 * Mostrar detalles de asignación
 */
async function mostrarDetallesAsignacion(asignacionId) {
    try {
        const asignacion = await asignacionesAPI.obtenerPorId(asignacionId);
        const statusColor = asignacion.estado === 'Activa' ? '#2ecc71' : asignacion.estado === 'Finalizada' ? '#3498db' : '#f39c12';
        // Si está finalizada, el progreso siempre es 100%
        const progresoDetalle = asignacion.estado === 'Finalizada' ? 100 : (asignacion.progreso || 0);

        const contenido = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e9ecef;">
                <span style="font-size: 13px; color: #6c757d;">ID: <strong>${asignacion.id}</strong></span>
                <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${asignacion.estado}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Estudiante</small>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(asignacion.estudianteNombre)}&background=3dd9b8&color=fff&size=32" style="width:32px;height:32px;border-radius:50%;">
                        <p style="margin: 0; font-weight: 500;">${asignacion.estudianteNombre}</p>
                    </div>
                </div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Tutor</small>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(asignacion.tutorNombre)}&background=1e3a5f&color=fff&size=32" style="width:32px;height:32px;border-radius:50%;">
                        <p style="margin: 0; font-weight: 500;">${asignacion.tutorNombre}</p>
                    </div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Fecha de Asignación</small>
                    <p style="margin: 4px 0 0; font-weight: 500;">${new Date(asignacion.fechaAsignacion).toLocaleDateString('es-ES')}</p>
                </div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    <small style="color: #6c757d;">Materia</small>
                    <p style="margin: 4px 0 0; font-weight: 500;">${asignacion.materia || asignacion.observaciones || 'No especificada'}</p>
                </div>
            </div>
            <div style="margin-top: 12px; background: #f8f9fa; padding: 12px; border-radius: 8px;">
                <small style="color: #6c757d;">Progreso</small>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
                    <div style="flex: 1; background: #e9ecef; height: 10px; border-radius: 10px; overflow: hidden;">
                        <div style="width: ${progresoDetalle}%; background: #3dd9b8; height: 100%; border-radius: 10px;"></div>
                    </div>
                    <span style="font-weight: 600; color: #1e3a5f;">${progresoDetalle}%</span>
                </div>
            </div>
            ${asignacion.observaciones ? `
            <div style="margin-top: 12px; background: #f8f9fa; padding: 12px; border-radius: 8px;">
                <small style="color: #6c757d;">Observaciones</small>
                <p style="margin: 4px 0 0;">${asignacion.observaciones}</p>
            </div>` : ''}
        `;
        mostrarModalInfo('Detalles de la Asignación', contenido);
    } catch (error) {
        mostrarToast('Error al cargar detalles', 'error');
    }
}

/**
 * Confirmar eliminación de asignación
 */
async function confirmarEliminarAsignacion(asignacionId) {
    const confirmado = await mostrarConfirmacion(
        'Finalizar Asignación',
        '¿Estás seguro de que deseas finalizar esta asignación? El estudiante será desvinculado del tutor.',
        { tipo: 'warning', textoConfirmar: 'Finalizar' }
    );
    if (confirmado) eliminarAsignacion(asignacionId);
}

/**
 * Eliminar/Finalizar asignación
 */
async function eliminarAsignacion(asignacionId) {
    try {
        await asignacionesAPI.eliminar(asignacionId);
        mostrarToast('Asignación finalizada exitosamente', 'success');
        await cargarAsignacionesDesdeAPI();
        await cargarTutoresDesdeAPI(); // Actualizar contadores
    } catch (error) {
        mostrarToast('Error al finalizar asignación', 'error');
    }
}

/**
 * Limpiar formulario de asignación
 */
function limpiarFormularioAsignacion() {
    document.getElementById('asignacionId').value = '';
    const selectEstudiante = document.getElementById('selectEstudianteAsignacion');
    const selectTutor = document.getElementById('selectTutorAsignacion');
    const materiaInput = document.getElementById('inputMateriaAsignacion');
    const fechaInput = document.getElementById('inputFechaAsignacion');
    const estadoSelect = document.getElementById('inputEstadoAsignacion');
    const progresoInput = document.getElementById('inputProgresoAsignacion');

    if (selectEstudiante) selectEstudiante.value = '';
    if (selectTutor) { selectTutor.value = ''; selectTutor.disabled = false; }
    if (materiaInput) materiaInput.value = '';
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    if (estadoSelect) estadoSelect.value = 'Activa';
    if (progresoInput) progresoInput.value = '0';
}

/**
 * Cargar datos al mostrar secciones
 */
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos cuando se muestran las secciones
    const observerConfig = { attributes: true, attributeFilter: ['class'] };
    
    const tutoresSection = document.getElementById('tutores');
    const asignacionesSection = document.getElementById('asignaciones');
    
    if (tutoresSection) {
        const observer1 = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                if (m.target.classList.contains('active')) {
                    cargarTutoresDesdeAPI();
                }
            });
        });
        observer1.observe(tutoresSection, observerConfig);
    }
    
    if (asignacionesSection) {
        const observer2 = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                if (m.target.classList.contains('active')) {
                    cargarAsignacionesDesdeAPI();
                }
            });
        });
        observer2.observe(asignacionesSection, observerConfig);
    }
});
