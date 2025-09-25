<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyectos</title>
    <link rel="stylesheet" href="public/css/user-view.css">
</head>
<body>

    <!-- Projects Section -->
    <section class="projects-section">
        <div class="projects-container">
            <h1 class="projects-title">Proyectos</h1>


                  <!-- Projects Section -->
      <section id="projects" class="projects-overview">
        <div class="container">
          <div class="projects-grid" id="allProjectsGrid">
            <!-- Projects will be loaded here via JavaScript -->
          </div>
          <div class="pagination-controls" id="paginationControls">
            <!-- Pagination buttons will be loaded here via JavaScript -->
          </div>
            <div style="display: flex; justify-content: center; margin: 40px 0 0 0;">
              <a href="project-create" class="btn btn-primary" style="padding: 12px 32px; font-size: 18px; text-decoration: none; background: #007bff; color: #fff; border-radius: 6px;">Crear</a>
            </div>
        </div>
      </section>
            
        </div>
    </section>

    <?php require_once("components/nav.php"); ?>

    <script src="public/js/project-list.js"></script>
</body>
</html>