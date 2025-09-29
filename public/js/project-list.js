const API_BASE = 'http://localhost/Hackdash-aiweekend/backend/public/';
const CURRENT_SLUG = "hola";

document.addEventListener('DOMContentLoaded', () => {
    const allProjectsGrid = document.getElementById('allProjectsGrid');
    const paginationControls = document.getElementById('paginationControls');
    let currentPage = 1;
    const projectsPerPage = 6;
    let cachedProjects = [];

    async function fetchUserProjects() {
        try {
            allProjectsGrid.innerHTML = '<p>Cargando tus proyectos...</p>';
            
            // Obtener datos del usuario
            const userData = window.getUserData();
            if (!userData.userEmail) {
                allProjectsGrid.innerHTML = '<p style="text-align: center; color: #6b7280; font-style: italic;">Inicia sesión para ver tus proyectos.</p>';
                return;
            }

            console.log('Consultando proyectos para usuario:', userData.userEmail);
            
            // Intentar obtener proyectos del usuario de diferentes maneras
            let userProjects = [];
            
            // Método 1: Intentar endpoint específico para proyectos del usuario
            try {
                const userProjectsResp = await fetch(`${API_BASE}project/getUserProjects?email=${encodeURIComponent(userData.userEmail)}`);
                if (userProjectsResp.ok) {
                    const userProjectsData = await userProjectsResp.json();
                    if (userProjectsData.success && Array.isArray(userProjectsData.data)) {
                        userProjects = userProjectsData.data;
                        console.log('Proyectos obtenidos del endpoint específico:', userProjects);
                    }
                }
            } catch (error) {
                console.log('Endpoint específico no disponible, usando método alternativo');
            }
            
            // Método 2: Si no hay endpoint específico, consultar todos y filtrar
            if (userProjects.length === 0) {
                try {
                    const allProjectsResp = await fetch(`${API_BASE}project/getProjects?slug=${CURRENT_SLUG}`);
                    if (allProjectsResp.ok) {
                        const allProjectsData = await allProjectsResp.json();
                        console.log('Todos los proyectos disponibles:', allProjectsData);
                        
                        if (allProjectsData.success && Array.isArray(allProjectsData.data)) {
                            // Verificar membresías en todos los proyectos
                            for (const project of allProjectsData.data) {
                                try {
                                    const membershipResp = await fetch(`${API_BASE}project/members?id=${project.id}`);
                                    if (membershipResp.ok) {
                                        const membershipData = await membershipResp.json();
                                        
                                        if (membershipData.success && Array.isArray(membershipData.members)) {
                                            const isMember = membershipData.members.some(member => 
                                                member.email === userData.userEmail
                                            );
                                            
                                            if (isMember) {
                                                userProjects.push(project);
                                                console.log(`Proyecto ${project.id} agregado: ${project.title}`);
                                            }
                                        }
                                    }
                                } catch (error) {
                                    console.log(`Error verificando proyecto ${project.id}:`, error);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log('Error obteniendo proyectos:', error);
                }
            }
            
            // No usar datos de fallback - solo mostrar proyectos reales del usuario
            if (userProjects.length === 0) {
                console.log('Usuario no tiene proyectos reales');
                userProjects = []; // Array vacío, no datos de fallback
            }
            
            console.log('Proyectos finales del usuario:', userProjects.length);
            cachedProjects = userProjects;
            renderPage();
        } catch (error) {
            console.error('Error fetching user projects:', error);
            allProjectsGrid.innerHTML = '<p>No se pudieron cargar tus proyectos. Inténtalo de nuevo más tarde.</p>';
        }
    }

    function renderPage() {
        // No usar paginación para proyectos del usuario
        renderProjects(cachedProjects);
    }

    function renderProjects(projects) {
        allProjectsGrid.innerHTML = '';
        
        if (!projects || projects.length === 0) {
            allProjectsGrid.innerHTML = `
                <div style="text-align: center; padding: 3rem 2rem; background: rgba(255, 255, 255, 0.05); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffffff; margin-bottom: 1rem; font-size: 1.8rem; font-weight: 700;">Aún no eres parte de ningún proyecto</h2>
                    <p style="color: #cccccc; margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.6;">Explora los proyectos disponibles y únete a uno para comenzar a colaborar.</p>
                </div>
            `;
            return;
        }

        // Mostrar los proyectos del usuario obtenidos de la API
        const userProjectsSection = document.createElement('div');
        userProjectsSection.className = 'user-projects-section';
        userProjectsSection.innerHTML = `
            <h3 style="color: white; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 700;">Mis Proyectos</h3>
            <div class="user-projects-grid">
                ${projects.map(project => createUserProjectCard(project)).join('')}
            </div>
        `;
        allProjectsGrid.appendChild(userProjectsSection);
    }
    
    function createUserProjectCard(project) {
        const status = project.status === 'completed' ? 'status-completed' : 'status-in-progress';
        const statusText = project.status === 'completed' ? 'Completado' : 'En Progreso';
        
        return `
            <div class="project-card user-project">
                <h3>${escapeHtml(project.title || '')}</h3>
                <p>${escapeHtml(project.description || '')}</p>
                <div class="project-meta">
                    <span class="status ${status}">${statusText}</span>
                </div>
                <a href="project-detail?id=${encodeURIComponent(project.id)}" class="btn-ver-mas">Ver más</a>
                <span class="membership-badge">Ya eres miembro</span>
            </div>
        `;
    }

    function renderPagination(totalPages, page) {
        paginationControls.innerHTML = '';
        if (totalPages <= 1) return;

        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.disabled = page === 1;
        prevButton.textContent = 'Anterior';
        prevButton.addEventListener('click', () => {
            currentPage = Math.max(1, currentPage - 1);
            renderPage();
        });
        paginationControls.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-button';
            if (i === page) {
                pageButton.classList.add('active');
            }
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderPage();
            });
            paginationControls.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.disabled = page === totalPages;
        nextButton.textContent = 'Siguiente';
        nextButton.addEventListener('click', () => {
            currentPage = Math.min(totalPages, currentPage + 1);
            renderPage();
        });
        paginationControls.appendChild(nextButton);
    }

    function firstSafe(obj, key) {
        return obj && obj[key] ? obj[key] : '';
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }


    fetchUserProjects();
});