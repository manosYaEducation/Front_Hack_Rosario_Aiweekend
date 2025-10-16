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
                    <div class="form-group">
                        <label for="image">Imagen del Proyecto</label>
                        <input type="file" id="image" name="image" accept="image/*">
                        <p class="resolution-info">Resoluciones recomendadas de imagen: 640×480, 800×600, 1024×768, 1280×688</p>
                        <div id="imagePreview" style="margin-top: 10px; text-align: center;"></div>
                        <div id="newImagePreview" style="display: none; margin-top: 10px; text-align: center;">
                            <img id="previewImg" style="max-width: 200px; max-height: 150px; border: 1px solid #ccc; border-radius: 8px;">
                            <button type="button" id="cropImageBtn" class="btn crop" style="display: block; margin: 10px auto 0 auto;">Recortar Imagen</button>
                        </div>
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

    <!-- Modal de Recorte de Imagen -->
    <div id="cropModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 10px; max-width: 90%; max-height: 90%;">
            <h3 style="margin-bottom: 15px;">Recortar Imagen</h3>
            
            <!-- Selector de resolución -->
            <div style="margin-bottom: 15px;">
                <label for="resolutionSelect">Selecciona resolución:</label>
                <select id="resolutionSelect" style="margin-left: 10px; padding: 5px;">
                    <option value="640x480">640 × 480</option>
                    <option value="800x600">800 × 600</option>
                    <option value="1024x768">1024 × 768</option>
                    <option value="1280x688">1280 × 688</option>
                </select>
            </div>
            
            <!-- Canvas de recorte -->
            <div style="text-align: center; margin-bottom: 15px;">
                <canvas id="cropCanvas" style="max-width: 100%; max-height: 400px; border: 2px solid #ccc;"></canvas>
            </div>
            
            <!-- Controles -->
            <div style="text-align: center;">
                <button id="applyCrop" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px;">Aplicar Recorte</button>
                <button id="cancelCrop" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px;">Cancelar</button>
            </div>
        </div>
    </div>

    <script src="public/js/config.js"></script>
    <script src="public/js/project-edit.js"></script>
</body>
</html>
