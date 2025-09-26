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
            <p><strong>Descripción:</strong> ${project.description}</p>
            <p><strong>Estado:</strong> ${project.status === 'completed' ? 'Completado' : 'En Progreso'}</p>
            <p><strong>Dashboard:</strong> ${project.dashboard_slug || 'No disponible'}</p>
            <p><strong>Fecha de Creación:</strong> ${new Date(project.created_at).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</p>
            <p><strong>Última Actualización:</strong> ${new Date(project.updated_at).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</p>
            <div id="joinSection" class="join-section">
                <button class="submit-button" id="joinButton">Unirse</button>
                <button class="submit-button" id="leaveButton" style="display:none;background:#ef4444">Abandonar</button>
                <span id="joinStatus" class="join-status" style="margin-left:10px"></span>
            </div>
            <button class="submit-button" id="backButton">Volver atrás</button>
            <a class="submit-button" id="editButton" href="project-edit?id=${project.id}">Editar Proyecto</a>
        `;
        // Añadir funcionalidad al botón
        const backButton = document.getElementById('backButton');
        backButton.addEventListener('click', () => {
            window.history.back();
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
            const { userName, userEmail, userId } = getUserCredentials();
            if (!userEmail || !userName) {
            joinStatus.textContent = 'Por favor, inicia sesión para unirte a un proyecto.';
            return;
        }

        button.disabled = true;
        button.textContent = action === 'join' ? 'Uniéndose...' : 'Abandonando...';
        joinStatus.textContent = '';

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
            if (!res.ok || !data.success) throw new Error(data.message);

            joinStatus.textContent = action === 'join'
                ? 'Te uniste al proyecto.'
                : 'Has abandonado el proyecto.';

            updateButtonStates(otherButton, button, action === 'join' ? 'Abandonar' : 'Unirse', false);
        } catch (err) {
            console.error(err);
            joinStatus.textContent = err.name === 'AbortError'
                ? 'Tiempo de espera agotado.'
                : err.message || 'Error de red.';
        } finally {
            if (button.style.display !== 'none') {
                button.disabled = false;
                button.textContent = action === 'join' ? 'Unirse' : 'Abandonar';
            }
        }
    });
}

// Inicializar botones
setupProjectButton(joinButton, 'join', leaveButton, 'project/createProjectMember');
setupProjectButton(leaveButton, 'leave', joinButton, 'member/delete');
        }
});