<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil</title>
    <link rel="stylesheet" href="public/css/user-view.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
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
                <input type="text" id="profileName" class="profile-input" value="" readonly>
            </div>

            <div class="profile-email-section">
                <label for="profileEmail" class="profile-label">Correo electrónico</label>
                <!-- Aquí cargamos el correo del usuario desde el localStorage -->
                <input type="email" id="profileEmail" class="profile-input" value="" readonly>
            </div>

            <div class="profile-actions">
                <button class="submit-button">Cancelar</button>
                <button class="submit-button">Guardar</button>
            </div>
            <div class="disconnect-section">
                <button class="submit-button" id="logoutButton">Desconectar</button>
            </div>
        </main>

        
    <?php require_once("components/nav.php"); ?>

    <script src="public/css/user-view.js"></script>
    <script>
        // Verificar si el usuario está logueado
        window.addEventListener("load", function() {
            // Obtener la información del usuario desde localStorage
            const userLoggedIn = localStorage.getItem("userLoggedIn");
            const username = localStorage.getItem("userName");
            const userEmail = localStorage.getItem("userEmail");

            document.getElementById("profileName").value = username;
            document.getElementById("profileEmail").value = userEmail;

            // Lógica para desconectar al usuario
            const logoutButton = document.getElementById("logoutButton");
            logoutButton.addEventListener("click", function() {
                // Limpiar el localStorage y redirigir al login
                localStorage.clear();
                window.location.href = "login";
            });
        });
    </script>
</body>
</html>