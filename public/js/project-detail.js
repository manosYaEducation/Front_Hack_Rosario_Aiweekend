const API_BASE = CONFIG.API_BASE;

document.addEventListener('DOMContentLoaded', () => {
    const projectDetailContent = document.getElementById('projectDetailContent');
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    let project = null; // Variable para almacenar los datos del proyecto

    if (projectId) {
        fetchProjectDetails(projectId);
    } else {
        projectDetailContent.innerHTML = '<p>No se especificó ningún ID de proyecto.</p>';
    }

    async function fetchProjectDetails(id) {
        try {
            const response = await fetch(`${API_BASE}project/get?id=${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.success) {
                if (data.project) {
                    project = data.project; // Almacenar los datos del proyecto
                    renderProjectDetails(data.project);
                } else {
                    projectDetailContent.innerHTML = '<p>No se encontraron detalles del proyecto.</p>';
                }
            } else {
                projectDetailContent.innerHTML = '<p>Error al cargar detalles del proyecto: ' + data.message + '</p>';
            }
        } catch (error) {
            console.error('Error fetching project detail:', error);
            projectDetailContent.innerHTML = '<p>No se pudieron cargar los detalles del proyecto. Inténtalo de nuevo más tarde.</p>';
        }
    }

    // Función para truncar el título solo en móviles
    function truncateTitleForMobile(title, maxLength = 154) {
        const isMobile = window.innerWidth < 768;
        if (isMobile && title && title.length > maxLength) {
            return title.substring(0, maxLength) + '...';
        }
        return title;
    }

    function renderProjectDetails(project) {
        if (!project) {
            console.error("Project data is undefined or null.");
            return;
        }

        const truncatedTitle = truncateTitleForMobile(project.title);
        document.querySelector('.project-detail-title').textContent = truncatedTitle;

 projectDetailContent.innerHTML = `
            <!-- Sección de Miembros -->
            <div id="membersSection" class="members-section">
                <div class="members-header">
                    <h3>Integrantes:</h3>
                    <div id="membersList" class="members-list">
                        <p>Cargando miembros...</p>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons Section -->
            <div class="project-action-buttons">
                <div class="project-controls">
                    <button class="submit-button" id="joinButton">Unirse</button>
                    <button class="submit-button" id="leaveButton" style="display:none;background:#ef4444">Abandonar</button>
                    <button class="submit-button" onclick="getJoinRequests()">Ver Solicitudes</button>
                    <a class="submit-button" id="editButton" href="project-edit?id=${project.id}">Editar </a>
                </div><div id="requestsContainer"></div>
                <div id="joinStatus" class="join-status"></div>
            </div>
            
            <!-- Project Details -->
            <div class="project-details">
            <!-- <p><strong>Estado:</strong> ${project.status === 'completed' ? 'Completado' : 'En Progreso'}</p>
            <p><strong>Fecha de Creación:</strong> ${new Date(project.created_at).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</p>
            <p><strong>Última Actualización:</strong> ${new Date(project.updated_at).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</p> -->
            <p><strong></strong> ${project.description}</p>
            </div>
        `;

        // Unirse o abandonar un proyecto
        const joinButton = document.getElementById('joinButton');
        const leaveButton = document.getElementById('leaveButton');
        const joinStatus = document.getElementById('joinStatus');

        async function checkMembershipAndSetState() {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail || !joinButton) return;
            try {
                const resp = await fetch(`${API_BASE}project/members?id=${project.id}`);
                if (!resp.ok) return;
                const data = await resp.json();
                if (data.success && Array.isArray(data.members)) {
                    const already = data.members.some(m => m.email === userEmail);
                    if (already) {
                        joinButton.style.display = 'none';
                        leaveButton.style.display = 'inline-block';
                    } else {
                        joinButton.style.display = 'inline-block';
                        leaveButton.style.display = 'none';
                    }
                }
            } catch (_) {}
        }

        checkMembershipAndSetState();
        
        // Cargar miembros del proyecto
        loadProjectMembers(project.id);
        setupProjectButton(joinButton, 'join', leaveButton, 'project/sendJoinRequest');
        setupProjectButton(leaveButton, 'leave', joinButton, 'member/delete'); // Add this line

        // Utility function for fetch with timeout
        async function fetchWithTimeout(url, options, timeout = 10000) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                const response = await fetch(url, { ...options, signal: controller.signal });
                return response;
            } finally {
                clearTimeout(timeoutId);
            }
        }

                // Utility function to handle button states
        function updateButtonStates(activeButton, inactiveButton, activeText, isDisabled) {
            activeButton.disabled = isDisabled;
            activeButton.textContent = activeText;
            activeButton.style.display = 'inline-block';
            inactiveButton.style.display = 'none';
        }


        // Utility function to get user credentials
        function getUserCredentials() {
            return {
                userName: localStorage.getItem('userName') || '',
                userEmail: localStorage.getItem('userEmail') || '',
                userId: localStorage.getItem('userId') || '',
            };
        }
        
function setupProjectButton(button, action, otherButton, apiEndpoint) {
    if (!button) return;
    button.addEventListener('click', async () => {
        // Verificar autenticación
        if (!window.isAuthenticated || !window.isAuthenticated()) {
            console.log('Usuario no autenticado, mostrando modal');
            if (typeof window.showLoginModal === 'function') {
                window.showLoginModal();
            } else {
                console.error('ERROR: window.showLoginModal no está disponible');
                document.getElementById('joinStatus').textContent = 'Error: No se puede mostrar el modal de inicio de sesión.';
            }
            return;
        }

        const { userName, userEmail, userId } = getUserCredentials();
        const joinStatus = document.getElementById('joinStatus');

        // Validar credenciales del usuario
        if (!userEmail || !userName) {
            joinStatus.textContent = 'Por favor, inicia sesión para unirte a un proyecto.';
            joinStatus.style.color = '#ef4444';
            return;
        }

        // revisar si ya existe una solicitud para unirse al proyecrto
        if (action === 'join') {
            try {
                const response = await fetch(`${API_BASE}project/getJoinRequests?project_id=${project.id}`);
                const data = await response.json();
                if (data.success && Array.isArray(data.requests)) {
                    const hasPendingRequest = data.requests.some(req => req.email === userEmail);
                    if (hasPendingRequest) {
                        joinStatus.textContent = 'Ya tienes una solicitud pendiente para este proyecto.';
                        joinStatus.style.color = '#ef4444';
                        return;
                    }
                }
            } catch (err) {
                console.error('Error checking existing join requests:', err);
                joinStatus.textContent = 'Error al verificar solicitudes existentes. Inténtalo de nuevo.';
                joinStatus.style.color = '#ef4444';
                return;
            }
        }

        // Deshabilitar botón y mostrar estado de carga
        updateButtonStates(button, otherButton, action === 'join' ? 'Uniéndose...' : 'Abandonando...', true);
        joinStatus.textContent = '';
        joinStatus.style.color = ''; // Resetear color

        // Preparar datos para la solicitud
        const formData = new FormData();
        if (action === 'join') {
            formData.append('project_id', project.id);
            formData.append('name', userName);
            formData.append('email', userEmail);
            formData.append('role', 'member');
        } else {
            formData.append('project_id', project.id);
            formData.append('email', userEmail);
        }

        try {
            const res = await fetchWithTimeout(`${API_BASE}${apiEndpoint}`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (!res.ok) {
                // Manejar errores HTTP
                throw new Error(data.message || `Error HTTP: ${res.status}`);
            }
            if (!data.success) {
                // Manejar errores específicos del backend
                throw new Error(data.message || 'Error desconocido al procesar la solicitud.');
            }

            // Actualizar estado y botones
            joinStatus.textContent = action === 'join'
                ? 'Has enviado una solicitud para unirte al proyecto.'
                : 'Has abandonado el proyecto exitosamente.';
            joinStatus.style.color = '#10b981'; // Verde para éxito
            updateButtonStates(otherButton, button, action === 'join' ? 'Abandonar' : 'Unirse', false);
            checkMembershipAndSetState();
            loadProjectMembers(project.id);
        } catch (err) {
            console.error(`Error al ${action === 'join' ? 'unirse' : 'abandonar'} el proyecto:`, err);
            // Mostrar mensaje de error específico
            let errorMessage = 'Error al procesar la solicitud. Inténtalo de nuevo.';
            if (err.name === 'AbortError') {
                errorMessage = 'Tiempo de espera agotado. Verifica tu conexión.';
            } else if (err.message) {
                errorMessage = err.message;
            }
            joinStatus.textContent = errorMessage;
            joinStatus.style.color = '#ef4444';
        } finally {
            // Restaurar estado del botón si sigue visible
            if (button.style.display !== 'none') {
                updateButtonStates(button, otherButton, action === 'join' ? 'Unirse' : 'Abandonar', false);
            }
        }
    });
}
// Inicializar botones
setupProjectButton(joinButton, 'join', leaveButton, 'project/sendJoinRequest');
        }
        
        // Función para cargar miembros del proyecto
        async function loadProjectMembers(projectId) {
            const membersList = document.getElementById('membersList');
            if (!membersList) return;
            
            try {
                console.log('Cargando miembros del proyecto:', projectId);
                const response = await fetch(`${API_BASE}project/members?id=${projectId}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log('Endpoint de miembros no encontrado - posiblemente no implementado en el backend');
                        membersList.innerHTML = '<p style="color: #6b7280; font-style: italic; text-align: center;">La funcionalidad de miembros no está disponible en este momento.</p>';
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Respuesta de la API de miembros:', data);
                
                if (data.success && Array.isArray(data.members)) {
                    displayProjectMembers(data.members);
                } else if (data.success && (!data.members || data.members.length === 0)) {
                    // Caso específico: API responde correctamente pero no hay miembros
                    membersList.innerHTML = '<p style="color: #6b7280; font-style: italic; text-align: center;">No hay miembros en este proyecto.</p>';
                } else {
                    console.warn('Respuesta inesperada de la API:', data);
                    membersList.innerHTML = '<p style="color: #6b7280; font-style: italic; text-align: center;">No se pudieron cargar los miembros del proyecto.</p>';
                }
            } catch (error) {
                console.error('Error cargando miembros:', error);
                
                // Distinguir entre diferentes tipos de errores
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    membersList.innerHTML = '<p style="color: #ef4444; text-align: center;">Error de conexión. Verifica tu conexión a internet.</p>';
                } else if (error.message.includes('404')) {
                    membersList.innerHTML = '<p style="color: #6b7280; font-style: italic; text-align: center;">La funcionalidad de miembros no está disponible.</p>';
                } else {
                    membersList.innerHTML = '<p style="color: #ef4444; text-align: center;">No hay miembros en el proyecto.</p>';
                }
            }
        }
        
        // Función para mostrar los miembros del proyecto
        function displayProjectMembers(members) {
            const membersList = document.getElementById('membersList');
            if (!membersList) return;
            
            if (members.length === 0) {
                membersList.innerHTML = '<p style="text-align: center;">No hay miembros en este proyecto.</p>';
                return;
            }
            
            // Crear vista de avatares
            const membersHTML = members.map(member => {
                const joinDate = member.joined_at ? new Date(member.joined_at).toLocaleDateString('es-ES', { 
                    dateStyle: 'medium' 
                }) : 'Fecha no disponible';
                const memberName = escapeHtml(member.name || member.user_name || 'Usuario');
                const memberEmail = escapeHtml(member.email || '');
                const memberRole = escapeHtml(member.role || 'Miembro');
                
                // Crear iniciales del nombre
                const initials = memberName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().substring(0, 2);
                
                return `
                    <div class="member-avatar-container" onclick="showMemberInfo('${memberName}', '${memberEmail}', '${memberRole}', '${joinDate}')">
                        <div class="member-avatar-large">
                            <span class="member-initials">${initials}</span>
                        </div>
                        <div class="member-name-overlay">${memberName}</div>
                    </div>
                `;
            }).join('');
            
            membersList.innerHTML = `
                <div class="members-avatars-inline">
                    ${membersHTML}
                </div>
            `;
        }
        
        // Función para escapar HTML
        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Función global para mostrar información del miembro
        window.showMemberInfo = function(name, email, role, joinedDate) {
            // Crear modal si no existe
            let modal = document.getElementById('memberInfoModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'memberInfoModal';
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal-content member-info-modal">
                        <div class="modal-title">Información del Miembro</div>
                        <div class="modal-body">
                            <div class="member-details">
                                <div class="member-detail-item">
                                    <strong>Nombre:</strong> ${name}
                                </div>
                                <div class="member-detail-item">
                                    <strong>Email:</strong> ${email}
                                </div>
                                <div class="member-detail-item">
                                    <strong>Rol:</strong> ${role}
                                </div>
                                <div class="member-detail-item">
                                    <strong>Se unió:</strong> ${joinedDate}
                                </div>
                            </div>
                        </div>
                        <div class="modal-buttons">
                            <button class="modal-cancel-btn" onclick="closeMemberInfo()">Cerrar</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            // Actualizar contenido del modal
            modal.querySelector('.member-details').innerHTML = `
                <div class="member-detail-item">
                    <strong>Nombre:</strong> ${name}
                </div>
                <div class="member-detail-item">
                    <strong>Email:</strong> ${email}
                </div>
                <div class="member-detail-item">
                    <strong>Rol:</strong> ${role}
                </div>
                <div class="member-detail-item">
                    <strong>Se unió:</strong> ${joinedDate}
                </div>
            `;
            
            // Mostrar modal
            modal.style.display = 'flex';
        };

        // Función global para cerrar el modal
        window.closeMemberInfo = function() {
            const modal = document.getElementById('memberInfoModal');
            if (modal) {
                modal.style.display = 'none';
            }
        };

        // Cerrar modal al hacer click fuera de él
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('memberInfoModal');
            if (modal && event.target === modal) {
                modal.style.display = 'none';
            }
        });


        // Función para re-renderizar el título cuando cambie el tamaño de ventana
        function handleResize() {
            const titleElement = document.querySelector('.project-detail-title');
            if (titleElement && project) {
                const truncatedTitle = truncateTitleForMobile(project.title);
                titleElement.textContent = truncatedTitle;
            }
        }

        // Escuchar cambios de tamaño de ventana
        window.addEventListener('resize', handleResize);
});

async function getJoinRequests() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    if (!projectId) {
        showNotification('Por favor, ingresa un ID de proyecto.', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}project/getJoinRequests?project_id=${projectId}`);
        const data = await res.json();

        const container = document.getElementById('requestsContainer');
        container.innerHTML = '<h4>Solicitudes:</h4>';

        if (data.success && Array.isArray(data.requests) && data.requests.length > 0) {
            data.requests.forEach(req => {
                const requestDiv = document.createElement('div');
                requestDiv.style = 'border:1px solid #ccc; padding:10px; margin:5px 0;';
                requestDiv.innerHTML = `
                    <strong>ID:</strong> ${req.id}<br/>
                    <strong>Nombre:</strong> ${req.user_name}<br/>
                    <strong>Email:</strong> ${req.email}<br/>
                    <button class="approve-btn" data-id="${req.id}">Aprobar</button>
                    <button class="reject-btn" data-id="${req.id}" style="background:#dc3545;color:white;">Rechazar</button>
                `;
                container.appendChild(requestDiv);
            });

            // Asignar eventos a los botones
            document.querySelectorAll('.approve-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const requestId = btn.getAttribute('data-id');
                    await handleRequestAction(requestId, 'approve');
                });
            });

            document.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const requestId = btn.getAttribute('data-id');
                    await handleRequestAction(requestId, 'reject');
                });
            });

        } else {
            container.innerHTML += '<p>No hay solicitudes pendientes.</p>';
        }
    } catch (err) {
        console.error(err);
        showNotification('Error al obtener las solicitudes.', 'error');
    }
}

async function handleRequestAction(requestId, action) {
    const endpoint = action === 'approve'
        ? 'project/approveJoinRequest'
        : 'project/rejectJoinRequest';

    const formData = new URLSearchParams();
    formData.append('request_id', requestId);

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });

        const data = await res.json();

        if (data.success) {
            showNotification(action === 'approve' ? 'Solicitud aprobada.' : 'Solicitud rechazada.');
            getJoinRequests(); // Recarga el listado
        } else {
            showNotification(data.message || 'Ocurrió un error.', 'error');
        }
    } catch (error) {
        console.error(error);
        showNotification('Error de conexión.', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style = `
        position: fixed; top: 20px; right: 20px; padding: 10px 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white; border-radius: 5px; z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
