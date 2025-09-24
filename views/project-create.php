<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear proyecto</title>
    <link rel="stylesheet" href="public/css/user-view.css">
</head>
<body>

    <!-- Form Section -->
    <section class="form-section">
        <div class="form-container">
            <h1 class="form-title">Crear proyecto</h1>
            <form class="capitals-form" id="capitalsForm">
                <div class="form-group">
                    <label for="title">Titulo</label>
                    <input type="text" id="title" name="title" placeholder="Ingresa el título del proyecto" required>
                </div>
                <div class="form-group">
                    <label for="description">Descripción</label>
                    <input type="text" id="description" name="description" placeholder="Ingresa la descripción" required>
                </div>
                <div class="form-group">
                    <label for="pitch">Subir pitch</label>
                    <input type="file" id="pitch" name="pitch">
                </div>
                <div class="form-group">
                    <label for="image">Subir imagen</label>
                    <input type="file" id="image" name="image">
                </div>
                <div>
                    <button type="button" class="submit-button" id="cancelButton">Cancelar</button>
                    <button type="button" class="submit-button" id="previewButton">Vista previa</button>
                    <button type="submit" class="submit-button">Crear proyecto</button>
                </div>
            </form>
        </div>
    </section>

    <?php require_once("components/nav.php"); ?>
    
    <script src="public/js/user-view.js"></script>
</body>
</html>