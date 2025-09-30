<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIWKND - Acceder</title>
    <link rel="stylesheet" href="public/css/login.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="logo">AIWKND</div>
        </header>
        
        <div class="subheader">
            <button class="back-btn" onclick="history.back()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6"/>
                </svg>
            </button>
            <h1 class="page-title">Acceder</h1>
        </div>
        
        <main class="main-content">
            <form class="login-form" id="loginForm">
                <div class="form-group">
                    <input type="email" id="username" name="username" class="form-input" placeholder="Dirección de Email" required>
                </div>
                
                <div class="form-group">
                    <input type="password" id="password" name="password" class="form-input" placeholder="Contraseña" required>
                </div>
                
                <div class="form-group-check">
                    <label class="checkbox-container">
                        <p type="checkbox" id="mantenerSesion" name="mantenerSesion">
                        <span class="checkbox-label"></span>
                    </label>
                </div>
                
                <div class="forgot-password">
                    <span class="forgot-text">¿Olvidaste tu contraseña?</span>
                    <a href="recover-password" class="forgot-link">Recupera tu contraseña aquí</a>
                </div>
                
                <button type="submit" class="login-btn">ACCEDER</button>
                
                <div class="register-link">
                    <span class="register-text">¿No tienes cuenta?</span>
                    <a href="register" class="register-link-btn">Regístrate aquí</a>
                </div>
            </form>
        </main>
        
        <?php require_once("components/nav.php"); ?>
    </div>
    
    <script src="public/js/login.js"></script>
</body>
</html>