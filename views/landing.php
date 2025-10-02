<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIWKND - Proyectos</title>
    <link rel="stylesheet" href="public/css/styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-left">
                <div class="logo">AIWKND</div>
                <nav class="desktop-nav">
                    <a href="index" class="nav-link">
                        <span class="nav-icon"></span>
                        <span class="nav-text">Inicio</span>
                    </a>
                    <a href="project-list" class="nav-link">
                        <span class="nav-icon"></span>
                        <span class="nav-text">Proyectos</span>
                    </a>
                </nav>
            </div>
            <nav class="desktop-nav-right">
                <a href="profile" class="nav-link">
                    <span class="nav-icon"></span>
                    <span class="nav-text">Cuenta</span>
                </a>
            </nav>
        </header>
        
        <main class="main-content">
            <!-- Hero Section -->
            <div class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">Evento AIWKND<br>Rosario 2025</h1>
                </div>
            </div>
            
            <!-- Create Project Section -->
            <div class="create-project-section">
                <a href="project-create" class="create-project-btn">Crear Proyecto</a>
            </div>
            
            <!-- Projects List -->
            <div class="projects-list">
                <section id="projects" class="projects-overview">
                    <div class="projects-grid" id="allProjectsGrid">
                        <!-- Projects will be loaded here via JavaScript -->
                    </div>
                    <div class="pagination-controls" id="paginationControls">
                        <!-- Pagination buttons will be loaded here via JavaScript -->
                    </div>
                </section>
            </div>
        </main>
        
        <!-- Desktop Bottom Nav -->
        <nav class="desktop-bottom-nav">
            <div class="desktop-bottom-logo">AIWKND</div>
        </nav>
        
        <?php require_once("components/nav.php"); ?>
    </div>

    <script src="public/js/session-check.js"></script>
    <script src="public/js/landing.js"></script>
</body>
</html>