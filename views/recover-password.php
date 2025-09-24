<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer contraseña</title>
    <link rel="stylesheet" href="public/css/user-view.css">
</head>
<body>

    <!-- Form Section -->
    <section class="form-section">
        <div class="form-container">
            <h1 class="form-title">Restablecer contraseña</h1>
            <p class="form-description">
                Por favor, introduce tu correo electrónico para restablecer tu contraseña.
            </p>
            <form class="capitals-form" id="capitalsForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Ingresa tu correo" required>
                </div>
                <button type="submit" class="submit-button">Enviar formulario</button>
            </form>
        </div>
    </section>

    <?php require_once("components/nav.php"); ?>

    <script src="public/css/user-view.js"></script>
</body>
</html>