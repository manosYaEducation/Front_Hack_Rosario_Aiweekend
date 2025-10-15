<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer contraseña</title>
    <link rel="stylesheet" href="public/css/recover-password.css">
    <script src="public/js/recover-password.js"></script>
</head>
<body>

    <!-- Form Section -->
    <section class="form-section">
        <div class="form-container">
            <h1 class="form-title">Restablecer contraseña</h1>
            <p class="form-description">
                Por favor, introduce tu correo electrónico para restablecer tu contraseña.
            </p>
            <form class="capitals-form" id="forgotPasswordForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Ingresa tu correo" required>
                </div>
                <button type="submit" class="submit-button">Enviar formulario</button>
                <div style="display: flex; justify-content: center; margin: 40px 0 0 0;">
                <div style="display: flex; justify-content: center; margin: 24px 0 0 0;">
                <a href="login" class="submit-button" style="text-align: center; text-decoration: none; display: inline-block;">Volver</a>
            </div>
            </div>
            </form>
        </div>
    </section>
    <script src="public/js/recover-password.js"></script>
    <?php require_once("components/nav.php"); ?>
</body>
</html>