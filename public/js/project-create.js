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
      const pitch = document.getElementById("pitch").files[0]?.name || "Ningún pitch seleccionado";
      const image = document.getElementById("image").files[0]?.name || "Ninguna imagen seleccionada";

      if (!title || !description) {
        alert("Por favor, completa título y descripción para vista previa.");
        return;
      }

      alert(`Vista previa del proyecto:\n\nTítulo: ${title}\nDescripción: ${description}\nPitch: ${pitch}\nImagen: ${image}`);
    });
  }
});