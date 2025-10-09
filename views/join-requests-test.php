<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Test Solicitudes de Proyecto</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    input, textarea, button, select { display: block; margin: 10px 0; width: 100%; max-width: 400px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Probar Solicitudes de Unión a Proyecto</h1>

  <section>
    <h2>Enviar Solicitud</h2>
    <input type="number" id="send_project_id" placeholder="ID del Proyecto" />
    <input type="text" id="send_name" placeholder="Tu Nombre" />
    <input type="email" id="send_email" placeholder="Tu Email" />
    <button onclick="sendJoinRequest()">Enviar Solicitud</button>
  </section>

  <section>
    <h2>Obtener Solicitudes</h2>
    <input type="number" id="get_project_id" placeholder="ID del Proyecto" />
    <button onclick="getJoinRequests()">Ver Solicitudes</button>
    <div id="requestsContainer"></div>
  </section>

  <section>
    <h2>Aprobar/Rechazar Solicitud</h2>
    <input type="number" id="request_id_action" placeholder="ID de Solicitud" />
    <button onclick="approveRequest()">Aprobar</button>
    <button onclick="rejectRequest()">Rechazar</button>
  </section>

  <h3>Respuesta:</h3>
  <pre id="responseOutput">Esperando interacción...</pre>

  <script src="test.js"></script>
</body>
</html>


<script>
const API_BASE = 'http://localhost/Hackdash-aiweekend/backend/public/';

function output(data) {
    document.getElementById('responseOutput').textContent = JSON.stringify(data, null, 2);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style = `
        position: fixed; top: 20px; right: 20px; padding: 10px 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white; border-radius: 5px; z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

async function sendJoinRequest() {
    const project_id = document.getElementById('send_project_id').value;
    const name = document.getElementById('send_name').value;
    const email = document.getElementById('send_email').value;

    if (!project_id || !name || !email) {
        showNotification('Por favor, completa todos los campos.', 'error');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('project_id', project_id);
    formData.append('name', name);
    formData.append('email', email);

    try {
        const res = await fetch(API_BASE + 'project/sendJoinRequest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        const data = await res.json();
        output(data);
        if (data.success) {
            showNotification('Solicitud enviada exitosamente.');
            document.getElementById('send_project_id').value = '';
            document.getElementById('send_name').value = '';
            document.getElementById('send_email').value = '';
        } else {
            showNotification(data.message || 'Error al enviar la solicitud.', 'error');
        }
    } catch (err) {
        output({ error: err.message });
        showNotification('Error de conexión.', 'error');
    }
}

async function getJoinRequests() {
    const project_id = document.getElementById('get_project_id').value;
    if (!project_id) {
        showNotification('Por favor, ingresa un ID de proyecto.', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}project/getJoinRequests?project_id=${project_id}`);
        const data = await res.json();
        output(data);

        const container = document.getElementById('requestsContainer');
        container.innerHTML = '<h4>Solicitudes:</h4>';
        if (data.success && data.requests?.length > 0) {
            data.requests.forEach(req => {
                container.innerHTML += `
                    <div style="border:1px solid #ccc; padding:10px; margin:5px 0;">
                        <strong>ID:</strong> ${req.id} <br/>
                        <strong>Nombre:</strong> ${req.user_name} <br/>
                        <strong>Email:</strong> ${req.email} <br/>
                    </div>
                `;
            });
        } else {
            container.innerHTML += '<p>No hay solicitudes pendientes.</p>';
        }
    } catch (err) {
        output({ error: err.message });
        showNotification('Error al obtener las solicitudes.', 'error');
    }
}

async function approveRequest() {
    const request_id = document.getElementById('request_id_action').value;
    if (!request_id) {
        showNotification('Por favor, ingresa un ID de solicitud.', 'error');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('request_id', request_id);

    try {
        const res = await fetch(API_BASE + 'project/approveJoinRequest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        const data = await res.json();
        output(data);
        if (data.success) {
            showNotification('Solicitud aprobada y miembro agregado.');
            const project_id = document.getElementById('get_project_id').value;
            if (project_id) {
                await getJoinRequests();
            }
            document.getElementById('request_id_action').value = '';
        } else {
            showNotification(data.message || 'Error al aprobar la solicitud.', 'error');
        }
    } catch (err) {
        output({ error: err.message });
        showNotification('Error de conexión.', 'error');
    }
}

async function rejectRequest() {
    const request_id = document.getElementById('request_id_action').value;
    if (!request_id) {
        showNotification('Por favor, ingresa un ID de solicitud.', 'error');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('request_id', request_id);

    try {
        const res = await fetch(API_BASE + 'project/rejectJoinRequest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        const data = await res.json();
        output(data);
        if (data.success) {
            showNotification('Solicitud rechazada.');
            const project_id = document.getElementById('get_project_id').value;
            if (project_id) {
                await getJoinRequests();
            }
            document.getElementById('request_id_action').value = '';
        } else {
            showNotification(data.message || 'Error al rechazar la solicitud.', 'error');
        }
    } catch (err) {
        output({ error: err.message });
        showNotification('Error de conexión.', 'error');
    }
}

</script>