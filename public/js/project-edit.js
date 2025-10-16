const API_BASE = CONFIG.API_BASE;

document.addEventListener("DOMContentLoaded", () => {
  const editProjectForm = document.getElementById("editProjectForm");
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");
  const newImagePreview = document.getElementById("newImagePreview");
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

  if (!projectId) {
    alert("ID de proyecto no proporcionado.");
    window.history.back();
    return;
  }

  // Cargar datos en el formulario
  async function loadProjectData() {
    try {
      const response = await fetch(`${API_BASE}project/get?id=${projectId}`, {
        method: 'GET'
      });
      const data = await response.json();

      if (data.success && data.project) {
        document.getElementById("title").value = data.project.title;
        document.getElementById("description").value = data.project.description;
        document.getElementById("pitch").value = data.project.pitch;
        document.getElementById("status").value = data.project.status;

        if (data.project.image) {
          imagePreview.innerHTML = `<img src="data:image/jpeg;base64,${data.project.image}" alt="Project Image" style="max-width: 200px; height: auto; border-radius: 8px;" />`;
        } else {
          imagePreview.innerHTML = '<p>No hay imagen actual.</p>';
        }
      } else {
        alert(data.message || "Error al cargar los datos del proyecto.");
        window.history.back();
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión al cargar el proyecto. Inténtalo de nuevo.");
      window.history.back();
    }
  }

  loadProjectData();

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        originalImageFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImg.src = event.target.result;
          newImagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        newImagePreview.style.display = 'none';
        loadProjectData();
      }
    });
  }

  if (editProjectForm) {
    editProjectForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Obtener datos del formulario
      const formData = new FormData(this);
      formData.append('id', projectId);

      // Validación simple
      if (!formData.get('title') || !formData.get('description')) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
      }

      // Botón de envío
      const submitButton = this.querySelector("[type='submit']");
      const originalText = submitButton.textContent;

      submitButton.textContent = "Guardando...";
      submitButton.disabled = true;

      try {
        const response = await fetch(`${API_BASE}project/update`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          alert("¡Proyecto actualizado exitosamente!");
          window.location.href = `project-list`;
        } else {
          alert(data.message || "Error al actualizar el proyecto.");
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
      editProjectForm.reset();
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
      const status = document.getElementById("status").value;
      const image = imageInput.files[0] ? 'Imagen seleccionada' : 'Sin nueva imagen';

      if (!title || !description) {
        alert("Por favor, completa título y descripción para vista previa.");
        return;
      }
      alert(`Vista previa del proyecto:\n\nTítulo: ${title}\nDescripción: ${description}\nPitch: ${pitch}\nEstado: ${status === 'in_progress' ? 'En progreso' : 'Completado'}\nImagen: ${image}`);
    });
  }

  // Funcionalidad de recorte de imagen
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