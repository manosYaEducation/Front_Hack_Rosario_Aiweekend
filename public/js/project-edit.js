const API_BASE = CONFIG.API_BASE;

document.addEventListener("DOMContentLoaded", () => {
  const editProjectForm = document.getElementById("editProjectForm");
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");

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
          imagePreview.innerHTML = `<img src="data:image/jpeg;base64,${data.project.image}" alt="Project Image" style="max-width: 200px; height: auto;" />`;
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
        const reader = new FileReader();
        reader.onload = (event) => {
          imagePreview.innerHTML = `<img src="${event.target.result}" alt="Image Preview" style="max-width: 200px; height: auto;" />`;
        };
        reader.readAsDataURL(file);
      } else {
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
});