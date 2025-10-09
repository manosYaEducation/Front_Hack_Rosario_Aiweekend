<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIWKND - Detalle de Proyecto</title>
    <link rel="stylesheet" href="public/css/project-detail.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-left">
                <div class="logo">AIWKND</div>
                <!-- Desktop Navigation -->
                <nav class="desktop-nav">
                    <a href="index" class="nav-link">
                        <span class="nav-text">Inicio</span>
                    </a>
                    <a href="project-list" class="nav-link">
                        <span class="nav-text">Proyectos</span>
                    </a>
                </nav>
            </div>
            <!-- Desktop Navigation Right -->
            <nav class="desktop-nav-right">
                <a href="profile" class="nav-link">
                    <span class="nav-icon"></span>
                </a>
            </nav>
        </header>

        <section id="project-detail" class="form-section">
            <div class="form-container">
                <h2 class="form-title project-detail-title"></h2>
                <div class="project-detail-content" id="projectDetailContent">
                    <!-- Project details will be loaded here via JavaScript -->
                </div>
            </div>
        </section>

        <?php require_once("components/nav.php"); ?>
        
        <!-- Desktop Bottom Nav -->
        <nav class="desktop-bottom-nav">
            <div class="desktop-bottom-logo">AIWKND</div>
        </nav>
    </div>
    <script src="public/js/config.js"></script>
    <script src="public/js/session-check.js"></script>
    <script src="public/js/project-detail.js"></script>
</body>
</html>