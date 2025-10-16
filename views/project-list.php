<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyectos</title>
    <link rel="stylesheet" href="public/css/project-list.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-left">
                <img src="public/images/AIWKND-negro-solo.png" alt="AIWKND" class="logo">
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

        <!-- Sección de Proyectos Activos -->
        <section class="projects-section">
            <h1 class="projects-title">Proyectos Activos</h1>
            <div class="projects-container">
                <div class="projects-grid" id="allProjectsGrid">
                    <!-- Proyectos activos cargados vía JavaScript -->
                </div>
                <div class="pagination-controls" id="activeProjectsPagination">
                    <!-- Paginación para proyectos activos -->
                </div>
            </div>
        </section>

        <!-- Nueva sección de Proyectos Seguidos -->
        <section class="followed-projects-section">
            <h1 class="projects-title">Proyectos que sigues</h1>
            <div class="projects-container">
                <div class="projects-grid" id="followedProjectsGrid">
                    <!-- Proyectos seguidos cargados vía JavaScript -->
                </div>
                <div class="pagination-controls" id="followedProjectsPagination">
                    <!-- Paginación para proyectos seguidos -->
                </div>
            </div>
        </section>

        <!-- Desktop Bottom Nav -->
        <nav class="desktop-bottom-nav">
            <img src="public/images/AIWKND-negro-solo.png" alt="AIWKND" class="desktop-bottom-logo">
        </nav>

        <?php require_once("components/nav.php"); ?>
    </div>

    <script src="public/js/config.js"></script>
    <script src="public/js/session-check.js"></script>
    <script src="public/js/project-list.js"></script>
</body>
</html>