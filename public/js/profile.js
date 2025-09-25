const API_BASE = 'http://localhost/Front_Hack_Rosario_Aiweekend/api/';

     // Verificar si el usuario está logueado
        window.addEventListener("load", function() {
            if (!window.isAuthenticated()) {
                window.location.href = 'login';
                return;
            }

            const userData = window.getUserData();
            const username = userData.userName || userData.username;
            const userEmail = userData.userEmail;

            document.getElementById("profileName").value = username || '';
            document.getElementById("profileEmail").value = userEmail || '';

            loadUserProjects();

            const logoutButton = document.getElementById("logoutButton");
            logoutButton.addEventListener("click", function() {
                window.logout();
            });
        });

        async function loadUserProjects() {
            const userProjectsList = document.getElementById('userProjectsList');
            const userData = window.getUserData();
            const userEmail = userData.userEmail;
            
            if (!userEmail) {
                userProjectsList.innerHTML = '<p>Por favor, inicia sesión para ver tus proyectos.</p>';
                return;
            }

            try {
                userProjectsList.innerHTML = '<p>Cargando proyectos...</p>';
                
                const memberships = JSON.parse(localStorage.getItem('userProjectMemberships') || '[]');
                console.log('All memberships in localStorage:', memberships);
                const userMemberships = memberships.filter(m => m.userEmail === userEmail);
                console.log('User memberships for', userEmail, ':', userMemberships);
                
                if (userMemberships.length === 0) {
                    userProjectsList.innerHTML = '<p>No estás participando en ningún proyecto actualmente.</p>';
                    return;
                }
                
                const userProjects = [];
                
                for (const membership of userMemberships) {
                    try {
                        const projectResponse = await fetch(`${API_BASE}project/get?id=${membership.projectId}`);
                        if (projectResponse.ok) {
                            const projectData = await projectResponse.json();
                            if (projectData.success && projectData.project) {
                                // Add membership info to project
                                projectData.project.membership = membership;
                                userProjects.push(projectData.project);
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading project ${membership.projectId}:`, error);
                    }
                }

                if (userProjects.length === 0) {
                    userProjectsList.innerHTML = '<p>No se pudieron cargar los detalles de tus proyectos.</p>';
                    return;
                }

                renderUserProjects(userProjects);
                
            } catch (error) {
                console.error('Error loading user projects:', error);
                userProjectsList.innerHTML = '<p>Error al cargar los proyectos. Inténtalo de nuevo más tarde.</p>';
            }
        }

        function renderUserProjects(projects) {
            const userProjectsList = document.getElementById('userProjectsList');
            userProjectsList.innerHTML = '';

            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'user-project-card';
                const joinedDate = project.membership ? new Date(project.membership.joined_at).toLocaleDateString() : 'Fecha desconocida';
                const role = project.membership ? project.membership.role : 'Miembro';
                
                projectCard.innerHTML = `
                    <div class="project-info">
                        <h4>${escapeHtml(project.title || '')}</h4>
                        <p>${escapeHtml(project.description || '')}</p>
                        <div class="project-meta">
                            <span class="project-status ${project.status === 'completed' ? 'status-completed' : 'status-in-progress'}">
                                ${project.status === 'completed' ? 'Completado' : 'En Progreso'}
                            </span>
                            <span class="project-role">Rol: ${escapeHtml(role)}</span>
                            <span class="project-joined">Unido: ${joinedDate}</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        <a href="project-detail?id=${encodeURIComponent(project.id)}" class="btn-view-project">Ver Detalles</a>
                        <button class="btn-leave-project" data-project-id="${project.id}">Abandonar Proyecto</button>
                    </div>
                `;
                userProjectsList.appendChild(projectCard);
            });

            document.querySelectorAll('.btn-leave-project').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const projectId = e.target.getAttribute('data-project-id');
                    await leaveProject(projectId);
                });
            });
        }

        async function leaveProject(projectId) {
            const userData = window.getUserData();
            const userEmail = userData.userEmail;
            const userName = userData.userName;
            
            if (!userEmail || !userName) {
                alert('Por favor, inicia sesión para abandonar un proyecto.');
                return;
            }

            if (!confirm('¿Estás seguro de que quieres abandonar este proyecto?')) {
                return;
            }

            try {
                const formData = new FormData();
                formData.append('project_id', projectId);
                formData.append('email', userEmail);

                const response = await fetch(`${API_BASE}project/removeProjectMember`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Remove from localStorage
                    let memberships = JSON.parse(localStorage.getItem('userProjectMemberships') || '[]');
                    memberships = memberships.filter(m => !(m.projectId == projectId && m.userEmail === userEmail));
                    localStorage.setItem('userProjectMemberships', JSON.stringify(memberships));
                    
                    alert('Has abandonado el proyecto exitosamente.');
                    // Recargar la lista de proyectos
                    loadUserProjects();
                } else {
                    alert(result.message || 'Error al abandonar el proyecto.');
                }
            } catch (error) {
                console.error('Error leaving project:', error);
                alert('Error de conexión. Inténtalo de nuevo más tarde.');
            }
        }

        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }