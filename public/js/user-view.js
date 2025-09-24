const API_BASE = 'http://localhost/Hackdash-aiweekend/backend/public/';
const currentSlug = "hola";

// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle") // Cambiado de 'hamburger'
  const mobileNav = document.getElementById("mobileNav")
  const closeNav = document.getElementById("closeNav")

  // Open mobile navigation
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      mobileNav.classList.add("active")
      navToggle.classList.add("active") // Cambiado de 'hamburger'
      document.body.style.overflow = "hidden" // Prevent scrolling
    })
  }

  // Close mobile navigation
  if (closeNav && mobileNav) {
    closeNav.addEventListener("click", () => {
      mobileNav.classList.remove("active")
      navToggle.classList.remove("active") // Cambiado de 'hamburger'
      document.body.style.overflow = "" // Restore scrolling
    })
  }

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active")
      navToggle.classList.remove("active") // Cambiado de 'hamburger'
      document.body.style.overflow = ""
    })
  })

  // Close menu when clicking outside
  mobileNav?.addEventListener("click", (e) => {
    if (e.target === mobileNav) {
      mobileNav.classList.remove("active")
      navToggle.classList.remove("active") // Cambiado de 'hamburger'
      document.body.style.overflow = ""
    }
  })

  // Form submission
  const capitalsForm = document.getElementById("capitalsForm")
  if (capitalsForm) {
    capitalsForm.addEventListener("submit", async function (e) {
      e.preventDefault()

      // Get form data
      const formData = new FormData(this)
      formData.append('slug', currentSlug)
      formData.append('status', 'in_progress')

      // Simple validation
      if (!formData.get('title') || !formData.get('description')) {
        alert("Por favor, completa todos los campos requeridos.")
        return
      }

      // Submit to API
      const submitButton = this.querySelector("[type='submit']")
      const originalText = submitButton.textContent

      submitButton.textContent = "Enviando..."
      submitButton.disabled = true

      try {
        const response = await fetch(`${API_BASE}project/create`, {
          method: 'POST',
          body: formData
        })
        const data = await response.json()

        if (data.success) {
          alert("¡Proyecto creado exitosamente!")
          this.reset()
        } else {
          alert(data.message || "Error al crear el proyecto.")
        }
      } catch (error) {
        console.error('Error:', error)
        alert("Error de conexión. Inténtalo de nuevo.")
      } finally {
        submitButton.textContent = originalText
        submitButton.disabled = false
      }
    })
  }

  // Cancel button
  const cancelButton = document.getElementById("cancelButton")
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      capitalsForm.reset()
      window.history.back()
    })
  }

  // Preview button
  const previewButton = document.getElementById("previewButton")
  if (previewButton) {
    previewButton.addEventListener("click", () => {
      const title = document.getElementById("title").value
      const description = document.getElementById("description").value
      const pitch = document.getElementById("pitch").files[0]?.name || "Ningún pitch seleccionado"
      const image = document.getElementById("image").files[0]?.name || "Ninguna imagen seleccionada"

      if (!title || !description) {
        alert("Por favor, completa título y descripción para vista previa.")
        return
      }

      alert(`Vista previa del proyecto:\n\nTítulo: ${title}\nDescripción: ${description}\nPitch: ${pitch}\nImagen: ${image}`)
    })
  }

  const ctaButtons = document.querySelectorAll(".cta-button")
  ctaButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()

      const originalText = this.textContent
      this.textContent = "Cargando..."
      this.disabled = true

      setTimeout(() => {
        this.textContent = originalText
        this.disabled = false
        // Navigate to relevant section or page
        window.location.href = "projects.html"
      }, 1000)
    })
  })

  // Project button functionality
  const projectButtons = document.querySelectorAll(".project-button")
  projectButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()

      const originalText = this.textContent
      this.textContent = "Cargando..."
      this.disabled = true

      setTimeout(() => {
        this.textContent = originalText
        this.disabled = false
      }, 1500)
    })
  })

  // Bottom Navigation Active State
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const bottomNavItems = document.querySelectorAll(".bottom-nav-item")

  bottomNavItems.forEach((item) => {
    const href = item.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add scroll effect to header
  let lastScrollTop = 0
  const header = document.querySelector(".header")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = "translateY(-100%)"
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })
})

// Utility function for responsive behavior
function handleResize() {
  const mobileNav = document.getElementById("mobileNav")
  const navToggle = document.getElementById("navToggle") // Cambiado de 'hamburger'

  if (window.innerWidth >= 768 && mobileNav) {
    mobileNav.classList.remove("active")
    if (navToggle) {
      navToggle.classList.remove("active") // Cambiado de 'hamburger'
    }
    document.body.style.overflow = ""
  }
}

window.addEventListener("resize", handleResize)

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".project-card, .form-group, .feature-card")
  animatedElements.forEach((el, index) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(el)
  })
})

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  const mobileNav = document.getElementById("mobileNav")
  const navToggle = document.getElementById("navToggle") // Cambiado de 'hamburger'

  // Close mobile nav with Escape key
  if (e.key === "Escape" && mobileNav?.classList.contains("active")) {
    mobileNav.classList.remove("active")
    navToggle?.classList.remove("active") // Cambiado de 'hamburger'
    document.body.style.overflow = ""
  }
})

////Mostrar proyectos paginados

document.addEventListener('DOMContentLoaded', () => {
    const allProjectsGrid = document.getElementById('allProjectsGrid');
    const paginationControls = document.getElementById('paginationControls');
    let currentPage = 1;
    const projectsPerPage = 6;
    let cachedProjects = [];

    async function fetchDashboardsAndProjects() {
        try {
            allProjectsGrid.innerHTML = '<p>Cargando proyectos...</p>';
            const dashboardsResp = await fetch(`${API_BASE}dashboards`);
            if (!dashboardsResp.ok) {
                throw new Error(`Error dashboards ${dashboardsResp.status}`);
            }
            const dashboardsData = await dashboardsResp.json();
            if (!dashboardsData.success || !Array.isArray(dashboardsData.data) || dashboardsData.data.length === 0) {
                allProjectsGrid.innerHTML = '<p>No hay dashboards disponibles.</p>';
                return;
            }

            const firstDashboard = dashboardsData.data[0];
            const slug = firstDashboard.slug || firstDashboard.dashboard_slug || firstDashboard.id || '';
            if (!slug) {
                allProjectsGrid.innerHTML = '<p>No se pudo determinar el slug del dashboard.</p>';
                return;
            }

            const projectsResp = await fetch(`${API_BASE}project/getProjects?slug=${currentSlug}`);
            if (!projectsResp.ok) {
                throw new Error(`Error projects ${projectsResp.status}`);
            }
            const projectsData = await projectsResp.json();
            if (!projectsData.success || !Array.isArray(projectsData.data)) {
                allProjectsGrid.innerHTML = '<p>Error al cargar proyectos.</p>';
                return;
            }

            cachedProjects = projectsData.data;
            currentPage = 1;
            renderPage();
        } catch (error) {
            console.error('Error fetching dashboards/projects:', error);
            allProjectsGrid.innerHTML = '<p>No se pudieron cargar los proyectos. Inténtalo de nuevo más tarde.</p>';
        }
    }

    function renderPage() {
        const totalPages = Math.max(1, Math.ceil(cachedProjects.length / projectsPerPage));
        const start = (currentPage - 1) * projectsPerPage;
        const end = start + projectsPerPage;
        const pageItems = cachedProjects.slice(start, end);
        renderProjects(pageItems);
        renderPagination(totalPages, currentPage);
    }

    function renderProjects(projects) {
        allProjectsGrid.innerHTML = '';
        if (!projects || projects.length === 0) {
            allProjectsGrid.innerHTML = '<p>No hay proyectos disponibles en este momento.</p>';
            return;
        }

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            const status = project.status === 'completed' ? 'status-completed' : 'status-in-progress';
            const statusText = project.status === 'completed' ? 'Completado' : 'En Progreso';
            const dashSlug = project.dashboard_slug || firstSafe(project.dashboard, 'slug') || '';
            const dashName = project.dashboard_name || firstSafe(project.dashboard, 'title') || dashSlug || 'Dashboard';
            projectCard.innerHTML = `
                <h3>${escapeHtml(project.title || '')}</h3>
                <p>${escapeHtml(project.description || '')}</p>
                <div class="project-meta">
                    <span class="status ${status}">${statusText}</span>
                    <span class="dashboard-link">Dashboard: ${dashSlug ? `<a href="dashboard?slug=${encodeURIComponent(dashSlug)}">${escapeHtml(dashName)}</a>` : escapeHtml(dashName)}</span>
                </div>
                <a href="project-detail?id=${encodeURIComponent(project.id)}" class="btn-ver-mas">Ver más</a>
            `;
            allProjectsGrid.appendChild(projectCard);
        });
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

    fetchDashboardsAndProjects();
});

// Project detail
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

        // Utility function to create FormData
        function createFormData(projectId, userData) {
            const form = new FormData();
            form.append('project_id', projectId);
            Object.entries(userData).forEach(([key, value]) => {
                // Map 'user_name' to 'name' to match backend expectation
                const mappedKey = key === 'user_name' ? 'name' : key;
                form.append(mappedKey, value);
            });
            return form;
        }

        // Utility function to get user credentials
        function getUserCredentials() {
            return {
                userName: localStorage.getItem('userName') || localStorage.getItem('username') || '',
                userEmail: localStorage.getItem('userEmail') || ''
            };
        }

        // Utility function to handle button states
        function updateButtonStates(activeButton, inactiveButton, activeText, isDisabled) {
            activeButton.disabled = isDisabled;
            activeButton.textContent = activeText;
            activeButton.style.display = 'inline-block';
            inactiveButton.style.display = 'none';
        }

        // Main handler for joining/leaving projects
        function setupProjectButton(button, action, oppositeButton, apiEndpoint) {
            if (!button) return;

            button.addEventListener('click', async () => {
                // Disable leave functionality due to missing backend support
                if (action === 'leave') {
                    joinStatus.textContent = 'La funcionalidad de abandonar proyecto no está soportada.';
                    return;
                }

                const { userName, userEmail } = getUserCredentials();

                // Validate credentials before sending
                if (!userEmail || !userName) {
                    joinStatus.textContent = 'Por favor, inicia sesión para unirte a un proyecto.';
                    return;
                }

                try {
                    // Update UI to show loading state
                    button.disabled = true;
                    button.textContent = action === 'join' ? 'Uniéndose...' : 'Abandonando...';
                    joinStatus.textContent = '';

                    // Prepare form data
                    const formData = createFormData(project.id, action === 'join'
                        ? { user_name: userName, email: userEmail, role: 'member' }
                        : { email: userEmail }
                    );

                    // Make API request
                    const response = await fetchWithTimeout(`${API_BASE}project/${apiEndpoint}`, {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        joinStatus.textContent = action === 'join' ? 'Te uniste al proyecto.' : 'Has abandonado el proyecto.';
                        // After joining, show "Abandonar"; after leaving, show "Unirse"
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
                    // Reset button if operation failed
                    if (button.style.display !== 'none') {
                        button.disabled = false;
                        button.textContent = action === 'join' ? 'Unirse' : 'Abandonar';
                    }
                }
            });
        }

        // Initialize buttons
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
            'leave'
        );
    }
});