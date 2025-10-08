<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrarse</title>
    <link rel="stylesheet" href="public/css/user-view.css">
</head>
<body>

    <!-- Loading Overlay -->
    <div id="loading-overlay" style="display: none;">
        <div class="loading-container">
            <div class="loading-spinner" style="display: none;"></div>
            <div class="success-icon" style="display: none;">✔</div>
            <div class="error-icon" style="display: none;">✘</div>
            <p class="loading-text">Procesando registro...</p>
            <p class="countdown-text"></p>
        </div>
    </div>

    <!-- Form Section -->
    <section class="form-section">
        <div class="form-container">
            <h1 class="form-title">Registrarse</h1>
            <form class="capitals-form" id='register-form'>
                <div class="form-columns">
                    <div class="form-col">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <div class="floating-label">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="email" name="email" placeholder="Ingresa tu email" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <div class="floating-label">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password2">Confirmar Contraseña</label>
                            <div class="floating-label">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="password2" name="password2" placeholder="Confirma tu contraseña" required>
                            </div>
                        </div>
                    </div>
                        <div class="form-actions">
                            <button type="submit" class="submit-button">Registrarse</button>
                        </div>
                    </div>
                <p class="form-link">
                    ¿Ya tienes cuenta? <a href="login">Inicia sesión aquí</a>
                </p>
                </div>
            </form>
        </div>
    </section>

    <script src="public/js/register.js"></script>
    <?php require_once("components/nav.php"); ?>
</body>
</html>
