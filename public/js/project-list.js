const API_BASE = CONFIG.API_BASE;
const CURRENT_SLUG = CONFIG.SLUG;

document.addEventListener('DOMContentLoaded', () => {
    const allProjectsGrid = document.getElementById('allProjectsGrid');
    const followedProjectsGrid = document.getElementById('followedProjectsGrid');
    let cachedActiveProjects = [];
    let cachedFollowedProjects = [];

    async function fetchUserProjectsAndFollowed() {
        try {
            // Set loading states
            allProjectsGrid.innerHTML = '<p>Cargando tus proyectos...</p>';
            followedProjectsGrid.innerHTML = '<p>Cargando proyectos que sigues...</p>';

            // Get user data
            const userData = window.getUserData();
            if (!userData.userEmail) {
                const noLoginMessage = `
                    <p style="text-align: center; color: white; font-size: 18px; font-style: italic; font-family: Raleway, sans-serif; font-weight: bold;">
                        Inicia sesión para ver tus proyectos.
                    </p>`;
                allProjectsGrid.innerHTML = noLoginMessage;
                followedProjectsGrid.innerHTML = noLoginMessage;
                return;
            }

            console.log('Consultando proyectos para usuario:', userData.userEmail);

            // Fetch active projects
            let activeProjects = [];
            try {
                const userProjectsResp = await fetch(`${API_BASE}project/getUserProjects?email=${encodeURIComponent(userData.userEmail)}`);
                if (userProjectsResp.ok) {
                    const userProjectsData = await userProjectsResp.json();
                    console.log('Respuesta de getUserProjects:', userProjectsData);
                    if (userProjectsData.success && Array.isArray(userProjectsData.data)) {
                        activeProjects = userProjectsData.data;
                        console.log('Proyectos activos obtenidos:', activeProjects);
                    } else {
                        console.warn('Respuesta de getUserProjects no válida:', userProjectsData);
                    }
                } else {
                    console.warn('Error en la respuesta de getUserProjects:', userProjectsResp.status);
                }
            } catch (error) {
                console.error('Error al obtener proyectos activos:', error);
            }

            // Fetch followed projects
            let followedProjects = [];
            try {
                const followedProjectsResp = await fetch(`${API_BASE}project/getFollowedProjects?email=${encodeURIComponent(userData.userEmail)}`);
                if (followedProjectsResp.ok) {
                    const followedProjectsData = await followedProjectsResp.json();
                    console.log('Respuesta de getFollowedProjects:', followedProjectsData);
                    if (followedProjectsData.success && Array.isArray(followedProjectsData.projects)) {
                        followedProjects = followedProjectsData.projects;
                        console.log('Proyectos seguidos obtenidos:', followedProjects);
                    } else {
                        console.warn('Respuesta de getFollowedProjects no válida:', followedProjectsData);
                    }
                } else {
                    console.warn('Error en la respuesta de getFollowedProjects:', followedProjectsResp.status);
                }
            } catch (error) {
                console.error('Error al obtener proyectos seguidos:', error);
            }

            // Alternative method: Fetch all projects and filter by membership (for active projects only)
            if (activeProjects.length === 0) {
                try {
                    const allProjectsResp = await fetch(`${API_BASE}project/getProjects?slug=${CURRENT_SLUG}`);
                    if (allProjectsResp.ok) {
                        const allProjectsData = await allProjectsResp.json();
                        console.log('Todos los proyectos disponibles:', allProjectsData);

                        if (allProjectsData.success && Array.isArray(allProjectsData.data)) {
                            for (const project of allProjectsData.data) {
                                try {
                                    const membershipResp = await fetch(`${API_BASE}project/members?id=${project.id}`);
                                    if (membershipResp.ok) {
                                        const membershipData = await membershipResp.json();
                                        if (membershipData.success && Array.isArray(membershipData.members)) {
                                            const isMember = membershipData.members.some(member => 
                                                member.email === userData.userEmail
                                            );
                                            if (isMember && !activeProjects.some(p => p.id === project.id)) {
                                                activeProjects.push(project);
                                                console.log(`Proyecto activo ${project.id} agregado: ${project.title}`);
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
                    console.error('Error obteniendo proyectos alternativos:', error);
                }
            }

            // Handle empty states
            if (activeProjects.length === 0) {
                console.log('Usuario no tiene proyectos activos');
                activeProjects = [];
            }
            if (followedProjects.length === 0) {
                console.log('Usuario no sigue ningún proyecto');
                followedProjects = [];
            }

            console.log('Proyectos activos finales:', activeProjects.length);
            console.log('Proyectos seguidos finales:', followedProjects.length);

            // Cache projects
            cachedActiveProjects = activeProjects;
            cachedFollowedProjects = followedProjects;

            // Render both sections
            renderPage();
        } catch (error) {
            console.error('Error general al obtener proyectos:', error);
            allProjectsGrid.innerHTML = '<p>No se pudieron cargar tus proyectos. Inténtalo de nuevo más tarde.</p>';
            followedProjectsGrid.innerHTML = '<p>No se pudieron cargar los proyectos que sigues. Inténtalo de nuevo más tarde.</p>';
        }
    }

    function renderPage() {
        renderProjects(cachedActiveProjects, allProjectsGrid, 'Aún no eres parte de ningún proyecto');
        renderProjects(cachedFollowedProjects, followedProjectsGrid, 'Aún no sigues ningún proyecto');
    }

    function renderProjects(projects, gridElement, emptyMessage) {
        gridElement.innerHTML = '';

        if (!projects || projects.length === 0) {
            gridElement.innerHTML = `
                <div style="text-align: center; padding: 3rem 2rem; background: rgba(255, 255, 255, 0.05); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffffff; margin-bottom: 1rem; font-size: 1.8rem; font-weight: 700;">${emptyMessage}</h2>
                    <p style="color: #cccccc; margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.6;">Explora los proyectos disponibles y únete o sigue uno para comenzar.</p>
                </div>
            `;
            return;
        }

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.innerHTML = createUserProjectCard(project);
            const cardElement = projectCard.firstElementChild;

            const isMobile = window.innerWidth < 1024;
            if (isMobile) {
                const titleElement = cardElement.querySelector('.clickable-title');
                if (titleElement) {
                    titleElement.style.cursor = 'pointer';
                    titleElement.addEventListener('click', () => {
                        window.location.href = `project-detail?id=${encodeURIComponent(project.id)}`;
                    });
                }
            }

            gridElement.appendChild(cardElement);
        });
    }

    function createUserProjectCard(project) {
        const truncatedTitle = truncateTitle(project.title || '');
        const description = project.description || '';
        const truncatedDescription = description.length > 65 ? description.substring(0, 65) + '...' : description;
        const firstLetter = (project.title || 'P').charAt(0).toUpperCase();
        const isMobile = window.innerWidth < 1024;
        const imageSrc = project.image ? `data:image/jpeg;base64,${project.image}` : null;

        return `
            <div class="project-card user-project">
                <div class="project-icon">
                    ${imageSrc
                        ? `<img src="${imageSrc}" alt="Imagen del proyecto" class="project-image" />`
                        : `<div class="project-icon-letter">${firstLetter}</div>`
                    }
                </div>
                <div class="project-info">
                    <h3 class="${isMobile ? 'clickable-title' : ''}">${escapeHtml(truncatedTitle)}</h3>
                    <p class="project-description">${escapeHtml(truncatedDescription)}</p>
                    ${!isMobile ? `<a href="project-detail?id=${encodeURIComponent(project.id)}" class="btn-ver-mas">Ver más</a>` : ''}
                </div>
            </div>
        `;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function truncateTitle(title) {
        if (!title) return '';
        const maxLength = 20;
        if (title.length > maxLength) {
            const truncated = title.substring(0, maxLength) + '...';
            console.log(`FORZANDO truncamiento: "${title}" (${title.length} chars) -> "${truncated}"`);
            return truncated;
        }
        console.log(`Título no truncado: "${title}" (${title.length} chars)`);
        return title;
    }

    function handleResize() {
        if (cachedActiveProjects.length > 0 || cachedFollowedProjects.length > 0) {
            renderPage();
        }
    }

    window.addEventListener('resize', handleResize);

    // Start fetching both active and followed projects
    fetchUserProjectsAndFollowed();
});