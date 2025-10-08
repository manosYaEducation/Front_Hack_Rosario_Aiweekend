<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIWKND - Registrarse</title>
    <link rel="stylesheet" href="public/css/register.css">
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
        
        <!-- Form Section -->
        <section class="form-section">
            <div class="form-container">
                <h1 class="form-title">Crear Cuenta</h1>
                <form class="capitals-form" id="capitalsForm">
                    <div class="form-group">
                        <label for="email"></label>
                        <input type="email" id="email" name="email" placeholder="Direccion de Email" required>
                    </div>
                    <div class="form-group">
                        <label for="password"></label>
                        <input type="password" id="password" name="password" placeholder="Contraseña" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword"></label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmar contraseña" min="1" required>
                    </div>
                    <button type="submit" class="submit-button">Crear Cuenta</button>
                </form>
                <p class="form-link">
                    ¿Ya tienes cuenta? <a href="login">Accede aquí</a>
                </p>
            </div>
        </section>
        
        <!-- Desktop Bottom Nav -->
        <nav class="desktop-bottom-nav">
            <div class="desktop-bottom-logo">AIWKND</div>
        </nav>
        
        <?php require_once("components/nav.php"); ?>
    </div>
</body>
</html>