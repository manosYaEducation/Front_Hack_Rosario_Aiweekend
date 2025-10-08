<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear proyecto</title>
    <link rel="stylesheet" href="public/css/project-create.css">
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
        
        <section class="form-section">
        <div class="form-container">
            <h1 class="form-title">Crear proyecto</h1>
            <form class="capitals-form" id="capitalsForm">
                <div class="form-group">
                    <label for="title">Titulo</label>
                    <input type="text" id="title" name="title" placeholder="Ingresa el título del proyecto" required>
                </div>
                <div class="form-group">
                    <label for="description">Descripción</label>
                    <input type="text" id="description" name="description" placeholder="Ingresa la descripción" required>
                </div>
                <div class="form-group">
                    <label for="pitch">Subir pitch</label>
                    <input type="file" id="pitch" name="pitch">
                </div>
                <div class="form-group">
                    <label for="image">Subir imagen</label>
                    <input type="file" id="image" name="image">
                </div>
                <div>
                    <button type="button" class="submit-button" id="cancelButton">Cancelar</button>
                    <button type="submit" class="submit-button">Crear proyecto</button>
                </div>
            </form>
        </div>
    </section>

        <!-- Desktop Bottom Nav -->
        <nav class="desktop-bottom-nav">
            <div class="desktop-bottom-logo">AIWKND</div>
        </nav>
        
        <?php require_once("components/nav.php"); ?>
    </div>
    
    <script src="public/js/session-check.js"></script>
    <script src="public/js/project-create.js"></script>
</body>
</html>