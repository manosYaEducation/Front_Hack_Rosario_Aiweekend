const API_BASE = CONFIG.API_BASE;
const CURRENT_SLUG = CONFIG.SLUG;

document.addEventListener("DOMContentLoaded", () => {
  const capitalsForm = document.getElementById("capitalsForm");
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");
  const previewImg = document.getElementById("previewImg");
  const cropImageBtn = document.getElementById("cropImageBtn");
  const cropModal = document.getElementById("cropModal");
  const cropCanvas = document.getElementById("cropCanvas");
  const resolutionSelect = document.getElementById("resolutionSelect");
  const applyCrop = document.getElementById("applyCrop");
  const cancelCrop = document.getElementById("cancelCrop");

  let originalImageFile = null;
  let croppedImageBlob = null;
  let croppedImageFile = null;

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

  // Funcionalidad de recorte de imagen
  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      originalImageFile = file;
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  cropImageBtn.addEventListener('click', function() {
    if (originalImageFile) {
      openCropModal();
    }
  });

  applyCrop.addEventListener('click', function() {
    applyImageCrop();
  });

  cancelCrop.addEventListener('click', function() {
    cropModal.style.display = 'none';
  });

  // Cerrar modal al hacer clic fuera
  cropModal.addEventListener('click', function(e) {
    if (e.target === cropModal) {
      cropModal.style.display = 'none';
    }
  });

  function openCropModal() {
    cropModal.style.display = 'block';
    
    const img = new Image();
    img.onload = function() {
      drawImageOnCanvas(img);
    };
    img.src = previewImg.src;
  }

  function drawImageOnCanvas(img) {
    const canvas = cropCanvas;
    const ctx = canvas.getContext('2d');
    
    // Obtener resolución seleccionada
    const resolution = resolutionSelect.value.split('x');
    const targetWidth = parseInt(resolution[0]);
    const targetHeight = parseInt(resolution[1]);
    
    // Calcular dimensiones del canvas para mostrar la imagen completa
    const maxCanvasSize = 400;
    const aspectRatio = img.width / img.height;
    let canvasWidth, canvasHeight;
    
    if (aspectRatio > 1) {
      canvasWidth = Math.min(maxCanvasSize, img.width);
      canvasHeight = canvasWidth / aspectRatio;
    } else {
      canvasHeight = Math.min(maxCanvasSize, img.height);
      canvasWidth = canvasHeight * aspectRatio;
    }
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Dibujar imagen escalada
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    
    // Dibujar rectángulo de recorte
    drawCropRectangle(ctx, canvasWidth, canvasHeight, targetWidth, targetHeight);
  }

  function drawCropRectangle(ctx, canvasWidth, canvasHeight, targetWidth, targetHeight) {
    // Calcular proporción del rectángulo de recorte
    const targetRatio = targetWidth / targetHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let cropWidth, cropHeight, cropX, cropY;
    
    if (targetRatio > canvasRatio) {
      // La imagen objetivo es más ancha, ajustar por ancho
      cropWidth = canvasWidth * 0.8;
      cropHeight = cropWidth / targetRatio;
      cropX = (canvasWidth - cropWidth) / 2;
      cropY = (canvasHeight - cropHeight) / 2;
    } else {
      // La imagen objetivo es más alta, ajustar por altura
      cropHeight = canvasHeight * 0.8;
      cropWidth = cropHeight * targetRatio;
      cropX = (canvasWidth - cropWidth) / 2;
      cropY = (canvasHeight - cropHeight) / 2;
    }
    
    // Dibujar overlay semitransparente
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Limpiar área de recorte
    ctx.clearRect(cropX, cropY, cropWidth, cropHeight);
    
    // Redibujar imagen solo en el área de recorte
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight);
      
      // Dibujar borde del rectángulo de recorte
      ctx.strokeStyle = '#007bff';
      ctx.lineWidth = 2;
      ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
      
      // Guardar coordenadas de recorte
      cropCanvas.cropData = { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
    };
    img.src = previewImg.src;
  }

  function applyImageCrop() {
    if (!cropCanvas.cropData) return;
    
    const img = new Image();
    img.onload = function() {
      const resolution = resolutionSelect.value.split('x');
      const targetWidth = parseInt(resolution[0]);
      const targetHeight = parseInt(resolution[1]);
      
      // Crear canvas temporal para el recorte
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      
      // Calcular coordenadas de recorte en la imagen original
      const canvas = cropCanvas;
      const cropData = canvas.cropData;
      const scaleX = img.width / canvas.width;
      const scaleY = img.height / canvas.height;
      
      const sourceX = cropData.x * scaleX;
      const sourceY = cropData.y * scaleY;
      const sourceWidth = cropData.width * scaleX;
      const sourceHeight = cropData.height * scaleY;
      
      // Dibujar imagen recortada y redimensionada
      tempCtx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, targetWidth, targetHeight
      );
      
      // Convertir a blob
      tempCanvas.toBlob(function(blob) {
        croppedImageBlob = blob;
        
        // Actualizar preview
        const url = URL.createObjectURL(blob);
        previewImg.src = url;
        
        // Crear nuevo File object
        const fileName = originalImageFile.name.split('.')[0] + '_cropped.jpg';
        croppedImageFile = new File([blob], fileName, { type: 'image/jpeg' });
        
        // Actualizar input file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(croppedImageFile);
        imageInput.files = dataTransfer.files;
        
        cropModal.style.display = 'none';
        alert(`Imagen recortada a ${targetWidth}×${targetHeight} píxeles`);
      }, 'image/jpeg', 0.9);
    };
    img.src = previewImg.src;
  }

  // Actualizar canvas cuando cambie la resolución
  resolutionSelect.addEventListener('change', function() {
    if (cropModal.style.display === 'block') {
      const img = new Image();
      img.onload = function() {
        drawImageOnCanvas(img);
      };
      img.src = previewImg.src;
    }
  });
});