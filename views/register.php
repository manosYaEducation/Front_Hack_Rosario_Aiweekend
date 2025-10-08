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
                            <label for="name">Nombre</label>
                            <div class="floating-label">
                                <i class="fas fa-user"></i>
                                <input type="text" id="name" name="name" placeholder="Ingresa tu nombre" required>
                            </div>
                        </div>
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
                    <div class="form-col">
                        <div class="form-group">
                            <label for="company">Empresa</label>
                            <div class="floating-label">
                                <i class="fas fa-building"></i>
                                <input type="text" id="company" name="company" placeholder="Nombre de tu empresa" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="location">Ciudad</label>
                            <div class="floating-label">
                                <i class="fas fa-map-marker-alt"></i>
                                <input type="text" id="location" name="location" placeholder="Tu ciudad">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="phone">Teléfono</label>
                            <div class="floating-label">
                                <i class="fas fa-phone"></i>
                                <input type="text" id="phone" name="phone" placeholder="Tu número de teléfono">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="description">Descripción</label>
                            <textarea id="description" name="description" placeholder="Breve descripción..."></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="submit-button">Registrarse</button>
                        </div>
                    </div>
                </div>
                <p class="form-link">
                    ¿Ya tienes cuenta? <a href="login">Inicia sesión aquí</a>
                </p>
            </form>
        </div>
    </section>

    <script src="public/js/register.js"></script>
    <?php require_once("components/nav.php"); ?>
</body>
</html>
