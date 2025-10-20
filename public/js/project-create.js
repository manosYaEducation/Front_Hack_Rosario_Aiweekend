const API_BASE = CONFIG.API_BASE;
const CURRENT_SLUG = CONFIG.SLUG;

document.addEventListener("DOMContentLoaded", () => {
  const capitalsForm = document.getElementById("capitalsForm");

  if (capitalsForm) {
    capitalsForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Obtener datos del formulario
      const formData = new FormData(this);
      formData.append('slug', CURRENT_SLUG);
      formData.append('status', 'in_progress');

      // Validación simple
      if (!formData.get('title') || !formData.get('description')) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
      }

      // Botón de envío
      const submitButton = this.querySelector("[type='submit']");
      const originalText = submitButton.textContent;

      submitButton.textContent = "Enviando...";
      submitButton.disabled = true;

      try {
        const response = await fetch(`${API_BASE}project/create`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          // Obtener ID del proyecto creado desde varias formas de respuesta posibles
          const projectId = (data && (data.project?.id || data.data?.id || data.id || data.project_id || data.data?.project_id)) || null;

          // SOLUCIÓN FRONTEND: Almacenar información del creador para tratarlo como owner funcionalmente
          (async () => {
            try {
              if (projectId && typeof window.getUserData === 'function') {
                const userData = window.getUserData();
                if (userData && userData.userEmail) {
                  console.log('🎯 SOLUCIÓN FRONTEND: Almacenando información del creador como owner funcional');
                  
                  // Almacenar información del creador en localStorage
                  const creatorInfo = {
                    projectId: projectId,
                    email: userData.userEmail,
                    name: userData.userName || userData.username || '',
                    role: 'owner', // Rol funcional
                    isCreator: true,
                    createdAt: new Date().toISOString()
                  };
                  
                  // Obtener lista existente de creadores
                  let creators = JSON.parse(localStorage.getItem('projectCreators') || '[]');
                  
                  // Agregar o actualizar información del creador
                  const existingIndex = creators.findIndex(c => c.projectId === projectId);
                  if (existingIndex >= 0) {
                    creators[existingIndex] = creatorInfo;
                  } else {
                    creators.push(creatorInfo);
                  }
                  
                  localStorage.setItem('projectCreators', JSON.stringify(creators));
                  console.log('✅ Información del creador almacenada:', creatorInfo);
                  
                  // Agregar al usuario como member (para que aparezca en la lista de miembros)
                  const joinForm = new FormData();
                  joinForm.append('project_id', projectId);
                  joinForm.append('name', userData.userName || userData.username || '');
                  joinForm.append('email', userData.userEmail);
                  joinForm.append('role', 'member'); // El backend solo acepta member

                  try {
                    const sendReq = await fetch(`${API_BASE}project/sendJoinRequest`, { method: 'POST', body: joinForm });
                    const sendData = await sendReq.json().catch(() => ({}));
                    if (sendReq.ok && sendData && sendData.success) {
                      // Buscar y aprobar la solicitud
                      const listResp = await fetch(`${API_BASE}project/getJoinRequests?project_id=${projectId}`);
                      const listData = await listResp.json().catch(() => ({}));
                      if (listResp.ok && listData && listData.success && Array.isArray(listData.requests)) {
                        const myReq = listData.requests.find(r => r && (r.email === userData.userEmail));
                        if (myReq && myReq.id) {
                          // Aprobar la solicitud
                          const params = new URLSearchParams();
                          params.append('request_id', myReq.id);
                          const approveResp = await fetch(`${API_BASE}project/approveJoinRequest`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: params.toString()
                          });
                          const approveData = await approveResp.json().catch(() => ({}));
                          
                          if (approveResp.ok && approveData && approveData.success) {
                            console.log('✅ Usuario agregado como member (pero funcionalmente será owner)');
                            
                            // Actualizar membresía local
                            if (typeof window.updateProjectMembership === 'function') {
                              window.updateProjectMembership(projectId, true);
                            }
                          }
                        }
                      }
                    }
                  } catch (error) {
                    console.log('⚠️ Error al agregar como member, pero el creador ya está registrado funcionalmente');
                  }
                }
              }
            } catch (error) {
              console.error('❌ Error en solución frontend:', error);
            }
          })();

          alert("¡Proyecto creado exitosamente!");
          this.reset();
          // Redirigir al landing después de crear el proyecto
          window.location.href = 'index';
        } else {
          alert(data.message || "Error al crear el proyecto.");
        }
      } catch (error) {
        console.error('Error:', error);
        alert("Error de conexión. Inténtalo de nuevo.");
      } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }

  // Botón cancelar
  const cancelButton = document.getElementById("cancelButton");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      capitalsForm.reset();
      window.history.back();
    });
  }

  // Botón vista previa
  const previewButton = document.getElementById("previewButton");
  if (previewButton) {
    previewButton.addEventListener("click", () => {
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const pitch = document.getElementById("pitch").value;
      const image = document.getElementById("image").files[0]?.name || "Ninguna imagen seleccionada";

      if (!title || !description) {
        alert("Por favor, completa título y descripción para vista previa.");
        return;
      }

      alert(`Vista previa del proyecto:\n\nTítulo: ${title}\nDescripción: ${description}\nPitch: ${pitch}\nImagen: ${image}`);
    });
  }
});