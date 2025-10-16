<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil</title>
    <link rel="stylesheet" href="public/css/account.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body style="display: none;">
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

    <div class="profile-page-container">
        <main class="profile-content">
            <div class="profile-avatar-section">
                <div class="profile-avatar">
                    <i class="fas fa-user"></i>
                    <div class="edit-icon-overlay">
                        <i class="fas fa-pen"></i>
                    </div>
                </div>
            </div>

            <div class="profile-name-section">
                <label for="profileName" class="profile-label">Nombre del perfil</label>
                <!-- Aquí cargamos el nombre del usuario desde el localStorage -->
                <input type="text" id="profileName" class="profile-input" value="">
            </div>

            <!-- <div class="profile-email-section">
                <label for="profileEmail" class="profile-label">Correo electrónico</label>
                Aquí cargamos el correo del usuario desde el localStorage 
                <input type="email" id="profileEmail" class="profile-input" value="" readonly>
            </div> -->

            <div class="profile-actions">
                <!--<button class="submit-button">Cancelar</button>-->
                <!--<button class="submit-button">Guardar</button>-->
          <button class="submit-button" id="createProjectButton">Crear Proyecto</button>
        
            </div>
            <div class="disconnect-section">
                <button class="submit-button" id="logoutButton">Desconectar</button>
            </div>
        </main>

        <!-- Desktop Bottom Nav -->
        <nav class="desktop-bottom-nav">
            <img src="public/images/AIWKND-negro-solo.png" alt="AIWKND" class="desktop-bottom-logo">
        </nav>
        
    <?php require_once("components/nav.php"); ?>
    
    <script src="public/js/session-check.js"></script>
    <script src="public/js/profile.js"></script>
</body>
</html>