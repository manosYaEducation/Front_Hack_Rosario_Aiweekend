const API_BASE = 'http://localhost/Front_Hack_Rosario_Aiweekend/api/';

document.addEventListener('DOMContentLoaded', () => {
    // No verificar sesión - permitir ver detalles sin login

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
            <p><strong>Dashboard:</strong> ${project.dashboard_slug}</p>
            <p><strong>Fecha de Creación:</strong> ${new Date(project.created_at).toLocaleDateString()}</p>
            <p><strong>Última Actualización:</strong> ${new Date(project.updated_at).toLocaleDateString()}</p>
            <div id="joinSection" class="join-section">
                <button class="submit-button" id="joinButton">Unirse</button>
                <button class="submit-button" id="leaveButton" style="display:none;background:#ef4444">Abandonar</button>
                <span id="joinStatus" class="join-status" style="margin-left:10px"></span>
            </div>
            <button class="submit-button" id="backButton">
                Volver atrás
            </button>
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

        function checkMembershipAndSetState() {
            const isLoggedIn = window.isAuthenticated();
            const userData = window.getUserData();
            const userEmail = userData.userEmail;
            
            if (!isLoggedIn) {
                if (joinButton) {
                    joinButton.style.display = 'inline-block';
                    joinButton.textContent = 'Unirse';
                    joinButton.style.background = '';
                    joinButton.onclick = null; // Remove any existing onclick
                }
                if (leaveButton) {
                    leaveButton.style.display = 'none';
                }
                if (joinStatus) {
                    joinStatus.textContent = '';
                    joinStatus.style.color = '';
                }
                return;
            }
            
            if (!userEmail || !joinButton) return;
            
            const isMember = window.isProjectMember(project.id);
            
            if (isMember) {
                joinButton.style.display = 'none';
                leaveButton.style.display = 'inline-block';
            } else {
                joinButton.style.display = 'inline-block';
                leaveButton.style.display = 'none';
            }
        }

        checkMembershipAndSetState();

        function showLoginModal() {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';

            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';

            modalContent.innerHTML = `
                <div style="margin-bottom: 1.5rem;">
                    <h3 class="modal-title">Inicia Sesión</h3>
                    <p class="modal-message">
                        Para unirte a este proyecto necesitas iniciar sesión en tu cuenta.
                    </p>
                </div>
                <div class="modal-buttons">
                    <button id="modalCancelBtn" class="modal-cancel-btn">Cancelar</button>
                    <button id="modalLoginBtn" class="modal-login-btn">Ir al Login</button>
                </div>
            `;

            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            document.getElementById('modalCancelBtn').addEventListener('click', () => {
                document.body.removeChild(modalOverlay);
            });

            document.getElementById('modalLoginBtn').addEventListener('click', () => {
                window.location.href = 'login';
            });

            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    document.body.removeChild(modalOverlay);
                }
            });

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(modalOverlay);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        }

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

        function createFormData(projectId, userData) {
            const form = new FormData();
            form.append('project_id', projectId);
            Object.entries(userData).forEach(([key, value]) => {
                const mappedKey = key === 'user_name' ? 'name' : key;
                form.append(mappedKey, value);
            });
            return form;
        }

        function getUserCredentials() {
            const userData = window.getUserData();
            return {
                userName: userData.userName || userData.username || '',
                userEmail: userData.userEmail || ''
            };
        }

        function updateButtonStates(activeButton, inactiveButton, activeText, isDisabled) {
            activeButton.disabled = isDisabled;
            activeButton.textContent = activeText;
            activeButton.style.display = 'inline-block';
            inactiveButton.style.display = 'none';
        }

        function setupProjectButton(button, action, oppositeButton, apiEndpoint) {
            if (!button) return;

            button.addEventListener('click', async () => {
                // revisar si el usuario esta logyeado
                if (!window.isAuthenticated()) {
                    showLoginModal();
                    return;
                }

                const { userName, userEmail } = getUserCredentials();

                if (!userEmail || !userName) {
                    joinStatus.textContent = 'Por favor, inicia sesión para unirte a un proyecto.';
                    return;
                }

                try {
                    button.disabled = true;
                    button.textContent = action === 'join' ? 'Uniéndose...' : 'Abandonando...';
                    joinStatus.textContent = '';

                    const formData = createFormData(project.id, action === 'join'
                        ? { name: userName, email: userEmail, role: 'member' }
                        : { email: userEmail }
                    );

                    const endpoint = action === 'join' ? 'createProjectMember' : 'removeProjectMember';
                    const response = await fetchWithTimeout(`${API_BASE}project/${endpoint}`, {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        joinStatus.textContent = action === 'join' ? 'Te uniste al proyecto.' : 'Has abandonado el proyecto.';
                        
                        if (action === 'join') {
                            window.updateProjectMembership(project.id, true);
                        } else if (action === 'leave') {
                            window.updateProjectMembership(project.id, false);
                        }
                        
                        const nextLabel = action === 'join' ? 'Abandonar' : 'Unirse';
                        updateButtonStates(oppositeButton, button, nextLabel, false);
                    } else {
                        throw new Error(result.message || (action === 'join' ? 'No se pudo unir.' : 'No se pudo abandonar.'));
                    }
                } catch (error) {
                    console.error(`Error during ${action}:`, error);
                    joinStatus.textContent = error.name === 'AbortError'
                        ? 'Tiempo de espera agotado.'
                        : error.message || 'Error de red.';
                } finally {
                    if (button.style.display !== 'none') {
                        button.disabled = false;
                        button.textContent = action === 'join' ? 'Unirse' : 'Abandonar';
                    }
                }
            });
        }

        setupProjectButton(
            joinButton,
            'join',
            leaveButton,
            'createProjectMember'
        );

        setupProjectButton(
            leaveButton,
            'leave',
            joinButton,
            'removeProjectMember'
        );
    }
});