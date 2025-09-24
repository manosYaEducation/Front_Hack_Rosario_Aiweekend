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