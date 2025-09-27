<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyectos</title>
    <link rel="stylesheet" href="public/css/user-view.css">
</head>
<body>

    <section class="projects-section">
      <div class="projects-container">
  <h2 class="form-title" style="margin-bottom: 2rem;">EvVENTO AIWKND ROSARIO 2025</h2>
        <div style="display: flex; justify-content: center; margin: 1.5rem 0 1.5rem 0;">
          <a href="project-create" class="submit-button" style="text-align: center; text-decoration: none; display: inline-block;">Crear proyecto</a>
        </div>
        <section id="projects" class="projects-overview">
          <div class="container">
            <div class="projects-grid" id="allProjectsGrid">
              <!-- Projects will be loaded here via JavaScript -->
            </div>
            <div class="pagination-controls" id="paginationControls">
              <!-- Pagination buttons will be loaded here via JavaScript -->
            </div>
          </div>
        </section>
      </div>
    </section>
    <?php require_once("components/nav.php"); ?>
    <script src="public/js/session-check.js"></script>
    <script src="public/js/landing.js"></script>
</body>
</html>