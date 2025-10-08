        document.getElementById('register-form').addEventListener('submit', async function (e) {
            e.preventDefault();

            // Mostrar el indicador de carga
            const loadingOverlay = document.getElementById('loading-overlay');
            const loadingSpinner = document.querySelector('.loading-spinner');
            const successIcon = document.querySelector('.success-icon');
            const errorIcon = document.querySelector('.error-icon');
            const loadingText = document.querySelector('.loading-text');
            const countdownText = document.querySelector('.countdown-text');

            loadingOverlay.style.display = 'flex';
            loadingSpinner.style.display = 'block';
            successIcon.style.display = 'none';
            errorIcon.style.display = 'none';
            loadingText.textContent = 'Procesando registro...';
            countdownText.textContent = '';

            // Función para el contador regresivo
            function startCountdown(seconds) {
                let count = seconds;
                countdownText.textContent = `Autodireccionamiento a login en ${count} segundos...`;
                
                const timer = setInterval(() => {
                    count--;
                    countdownText.textContent = `Autodireccionamiento a login en ${count} segundos...`;
                    
                    if (count <= 0) {
                        clearInterval(timer);
                    }
                }, 1000);
            }

            // Validar que las contraseñas coincidan
            const password = document.getElementById('password').value;
            const password2 = document.getElementById('password2').value;

            if (password !== password2) {
                loadingSpinner.style.display = 'none';
                errorIcon.style.display = 'block';
                loadingText.textContent = 'Las contraseñas no coinciden';
                countdownText.textContent = '';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 2000);
                return;
            }

            // Crear objeto de datos
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: password,
                company: document.getElementById('company').value,
                location: document.getElementById('location').value,
                phone: document.getElementById('phone').value,
                description: document.getElementById('description').value
            };

            try {
                // Enviar solicitud al backend
                const response = await fetch('http://localhost/jwt-mail-qr/Version 2- SystemAuth/register.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    // Mostrar mensaje de éxito
                    loadingSpinner.style.display = 'none';
                    successIcon.style.display = 'block';
                    loadingText.textContent = data.message || 'Se ha enviado un correo electrónico de verificación. Por favor, revisa tu bandeja de entrada para activar tu cuenta.';
                    
                    // Iniciar contador regresivo
                    startCountdown(5);

                    // Limpiar formulario
                    document.getElementById('register-form').reset();

                    // Redireccionar después de 5 segundos
                    setTimeout(() => {
                        window.location.href = 'login';
                    }, 5000);
                } else {
                    // Mostrar mensaje de error
                    loadingSpinner.style.display = 'none';
                    errorIcon.style.display = 'block';
                    loadingText.textContent = data.error || 'Error en el registro. Inténtalo de nuevo.';
                    countdownText.textContent = '';
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                    }, 2000);
                }
            } catch (error) {
                console.error('Error:', error);
                loadingSpinner.style.display = 'none';
                errorIcon.style.display = 'block';
                loadingText.textContent = 'Error en la conexión. Inténtalo más tarde.';
                countdownText.textContent = '';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 2000);
            }
        });