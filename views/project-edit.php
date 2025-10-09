<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar proyecto</title>
    <link rel="stylesheet" href="public/css/user-view.css">
</head>
<body>
    <!-- Form Section -->
    <section class="form-section">
        <div class="form-container">
            <h1 class="form-title">Editar proyecto</h1>
            <form class="capitals-form" id="editProjectForm">
                <div class="form-group">
                    <label for="title">Título</label>
                    <input type="text" id="title" name="title" placeholder="Ingresa el título del proyecto" required>
                </div>
                <div class="form-group">
                    <label for="description">Descripción</label>
                    <input type="text" id="description" name="description" placeholder="Ingresa la descripción" required>
                </div>
                <div class="form-group">
                    <label for="pitch">Enlace pitch</label>
                    <input type="text" id="pitch" name="pitch" placeholder="Ingresa el enlace de tu pitch">
                </div>
                <div class="form-group">
                    <label for="status">Estado</label>
                    <select id="status" name="status" required>
                        <option value="in_progress">En progreso</option>
                        <option value="completed">Completado</option>
                    </select>
                </div>
                <div>
                    <button type="button" class="submit-button" id="cancelButton">Cancelar</button>
                    <button type="button" class="submit-button" id="previewButton">Vista previa</button>
                    <button type="submit" class="submit-button">Guardar cambios</button>
                </div>
            </form>
        </div>
    </section>

    <?php require_once("components/nav.php"); ?>
    <script src="public/js/config.js"></script>
    <script src="public/js/project-edit.js"></script>
</body>
</html>