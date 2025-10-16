// Profile management
window.addEventListener("load", function() {
    // Verificar autenticación usando las funciones globales
    if (!window.isAuthenticated()) {
        window.location.href = 'login';
        return;
    }else {
        document.body.style.display = "block";
    }

    // Obtener datos del usuario usando las funciones globales
    const userData = window.getUserData();
    const username = userData.userName || userData.username;
    const userEmail = userData.userEmail;

    // Llenar los campos del perfil
    document.getElementById("profileName").value = username || '';
    //document.getElementById("profileEmail").value = userEmail || '';

    // Configurar botón de logout usando la función global
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            window.logout();
        });
    }
    
     // Configurar botón de logout usando la función global
    const createProjectButton = document.getElementById("createProjectButton");
    if (createProjectButton) {
        createProjectButton.addEventListener("click", function() {
             window.location.href = 'project-create';
              return;
        });
    }
    
    
    
});