<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar proyecto</title>
    <link rel="stylesheet" href="public/css/project-edit.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <!--<header class="header">
            <div class="header-left">
                <div class="logo">AIWKND</div>
                <nav class="desktop-nav">
            </div>

        </header> -->

        <!-- Formulario -->
        <section class="form-section">
            <div class="form-container">
                <h1 class="form-title">Editar proyecto</h1>
                <form class="capitals-form" id="editProjectForm" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="title">Título</label>
                        <input type="text" id="title" name="title" placeholder="Ingresa el título del proyecto" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Descripción</label>
                        <textarea id="description" name="description" placeholder="Ingresa la descripción del proyecto. Puedes usar formato estructurado con viñetas (•) y secciones (Descripción:, Valor diferencial:)" required rows="8"></textarea>
                        <div class="formatting-help">
                            <small> Usa "•" o "-" para viñetas, y ":" para títulos de sección, ejemplo: "Descripción:"</small>
                        </div>
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
                    <div class="form-group">
                        <label for="image">Imagen del Proyecto</label>
                        <input type="file" id="image" name="image" accept="image/*">
                        <div id="imagePreview" style="margin-top: 10px;"></div>
                    </div>

                    <div class="button-group">
                        <button type="button" class="btn cancel" id="cancelButton">Cancelar</button>
                        <button type="button" class="btn preview" id="previewButton">Vista previa</button>
                        <button type="submit" class="btn save">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </section>

        <!-- Navegación inferior -->

    </div>

    <script src="public/js/config.js"></script>
    <script src="public/js/project-edit.js"></script>
</body>
</html>
