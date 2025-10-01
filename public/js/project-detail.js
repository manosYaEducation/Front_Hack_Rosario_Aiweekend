const API_BASE = 'http://localhost/Hackdash-aiweekend/backend/public/';

document.addEventListener('DOMContentLoaded', () => {
    const projectDetailContent = document.getElementById('projectDetailContent');
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

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

    function renderProjectDetails(project) {
        if (!project) {
            console.error("Project data is undefined or null.");
            return;
        }

        document.querySelector('.project-detail-title').textContent = project.title;

 projectDetailContent.innerHTML = `
            <!-- Action Buttons Section -->
            <div class="project-action-buttons">
                <div class="project-controls">
                    <button class="submit-button" id="joinButton">Unirse</button>
                    <button class="submit-button" id="leaveButton" style="display:none;background:#ef4444">Abandonar</button>
                    <button class="submit-button" id="backButton">Volver atrás</button>
                    <a class="submit-button" id="editButton" href="project-edit?id=${project.id}">Editar Proyecto</a>
                    <button class="submit-button" id="deleteButton" style="background:#ef4444">Eliminar Proyecto</button>
                </div>
                <div id="joinStatus" class="join-status"></div>
            </div>
            
            <!-- Project Details -->
            <div class="project-details">
                <p><strong>Estado:</strong> ${project.status === 'completed' ? 'Completado' : 'En Progreso'}</p>
                <p><strong>Fecha de Creación:</strong> ${new Date(project.created_at).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</p>
                <p><strong>Última Actualización:</strong> ${new Date(project.updated_at).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</p>
                <p><strong>Descripción:</strong> ${project.description}</p>
            </div>
            
            <!-- Sección de Miembros -->
            <div id="membersSection" class="members-section">
                <h3>Miembros del Proyecto</h3>
                <div id="membersList" class="members-list">
                    <p>Cargando miembros...</p>
                </div>
            </div>
        `;

        // Añadir funcionalidad al botón de volver
        const backButton = document.getElementById('backButton');
        backButton.addEventListener('click', () => {
            window.history.back();
        });

        // Añadir funcionalidad al botón de eliminar
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.addEventListener('click', async () => {
            if (!confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
                return;
            }

            const joinStatus = document.getElementById('joinStatus');
            deleteButton.disabled = true;
            deleteButton.textContent = 'Eliminando...';
            joinStatus.textContent = '';

            try {
                const formData = new FormData();
                formData.append('id', project.id);

                const response = await fetchWithTimeout(`${API_BASE}project/delete/`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Error al eliminar el proyecto');
                }

                joinStatus.textContent = 'Proyecto eliminado exitosamente.';
                joinStatus.style.color = '#10b981';
                deleteButton.style.display = 'none';

                // Redirigir a la página principal después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'index';
                }, 2000);

            } catch (err) {
                console.error('Error eliminando proyecto:', err);
                joinStatus.textContent = err.name === 'AbortError'
                    ? 'Tiempo de espera agotado.'
                    : err.message || 'Error al eliminar el proyecto.';
                joinStatus.style.color = '#ef4444';
                deleteButton.disabled = false;
                deleteButton.textContent = 'Eliminar Proyecto';
            }
        });

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
                ? 'Te uniste al proyecto exitosamente.'
                : 'Has abandonado el proyecto exitosamente.';
            joinStatus.style.color = '#10b981'; // Verde para éxito
            updateButtonStates(otherButton, button, action === 'join' ? 'Abandonar' : 'Unirse', false);

            // Recargar lista de miembros
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
setupProjectButton(joinButton, 'join', leaveButton, 'project/createProjectMember');
setupProjectButton(leaveButton, 'leave', joinButton, 'member/delete');
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
                        membersList.innerHTML = '<p style="color: #6b7280; font-style: italic;">La funcionalidad de miembros no está disponible en este momento.</p>';
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
                    membersList.innerHTML = '<p style="color: #6b7280; font-style: italic;">No hay miembros en este proyecto.</p>';
                } else {
                    console.warn('Respuesta inesperada de la API:', data);
                    membersList.innerHTML = '<p style="color: #6b7280; font-style: italic;">No se pudieron cargar los miembros del proyecto.</p>';
                }
            } catch (error) {
                console.error('Error cargando miembros:', error);
                
                // Distinguir entre diferentes tipos de errores
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    membersList.innerHTML = '<p style="color: #ef4444;">Error de conexión. Verifica tu conexión a internet.</p>';
                } else if (error.message.includes('404')) {
                    membersList.innerHTML = '<p style="color: #6b7280; font-style: italic;">La funcionalidad de miembros no está disponible.</p>';
                } else {
                    membersList.innerHTML = '<p style="color: #ef4444;">No hay miembros en el proyecto.</p>';
                }
            }
        }
        
        // Función para mostrar los miembros del proyecto
        function displayProjectMembers(members) {
            const membersList = document.getElementById('membersList');
            if (!membersList) return;
            
            if (members.length === 0) {
                membersList.innerHTML = '<p>No hay miembros en este proyecto.</p>';
                return;
            }
            
            const membersHTML = members.map(member => {
                const joinDate = member.joined_at ? new Date(member.joined_at).toLocaleDateString('es-ES', { 
                    dateStyle: 'medium' 
                }) : 'Fecha no disponible';
                
                return `
                    <div class="member-card">
                        <div class="member-info">
                            <h4 class="member-name">${escapeHtml(member.name || member.user_name || 'Usuario')}</h4>
                            <p class="member-email">${escapeHtml(member.email || '')}</p>
                            <p class="member-role">Rol: ${escapeHtml(member.role || 'Miembro')}</p>
                            <p class="member-joined">Se unió: ${joinDate}</p>
                        </div>
                    </div>
                `;
            }).join('');
            
            membersList.innerHTML = membersHTML;
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
});