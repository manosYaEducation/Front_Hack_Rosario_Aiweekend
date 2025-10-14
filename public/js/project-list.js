const API_BASE = CONFIG.API_BASE;
const CURRENT_SLUG = CONFIG.SLUG;

document.addEventListener('DOMContentLoaded', () => {
    const allProjectsGrid = document.getElementById('allProjectsGrid');
    let currentPage = 1;
    const projectsPerPage = 6;
    let cachedProjects = [];

    async function fetchUserProjects() {
        try {
            allProjectsGrid.innerHTML = '<p>Cargando tus proyectos...</p>';
            
            // Obtener datos del usuario
            const userData = window.getUserData();
            if (!userData.userEmail) {
                allProjectsGrid.innerHTML = '<p style="text-align: center; color: white; font-size: 18px; font-style: italic; font-family: Raleway, sans-serif; font-weight: bold;">Inicia sesión para ver tus proyectos.</p>';
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

        // Renderizar las tarjetas directamente en el grid
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.innerHTML = createUserProjectCard(project);
            const cardElement = projectCard.firstElementChild;
            
            // Detectar si es móvil o tablet (< 1024px) y agregar evento click al título
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
            
            allProjectsGrid.appendChild(cardElement);
        });
    }
    
    function createUserProjectCard(project) {
        // Truncar título y descripción
        const truncatedTitle = truncateTitle(project.title || '');
        const description = project.description || '';
        const truncatedDescription = description.length > 65 ? description.substring(0, 65) + '...' : description;
        
        // Obtener la primera letra del título en mayúscula
        const firstLetter = (project.title || 'P').charAt(0).toUpperCase();
        
        // Detectar si es móvil o tablet (< 1024px)
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
    
    function truncateTitle(title) {
        if (!title) return '';
        
        // Truncamiento más agresivo para títulos muy largos
        const maxLength = 20; // Reducido para ser más estricto
        
        // Forzar truncamiento para cualquier título que supere la longitud máxima
        if (title.length > maxLength) {
            const truncated = title.substring(0, maxLength) + '...';
            console.log(`FORZANDO truncamiento: "${title}" (${title.length} chars) -> "${truncated}"`);
            return truncated;
        }
        
        console.log(`Título no truncado: "${title}" (${title.length} chars)`);
        return title;
    }
    
    // Función para re-renderizar cuando cambie el tamaño de ventana
    function handleResize() {
        if (cachedProjects.length > 0) {
            renderPage();
        }
    }
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', handleResize);

    fetchUserProjects();
});