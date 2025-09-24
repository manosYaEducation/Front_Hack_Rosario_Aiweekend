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
        </div>
      </section>
            
        </div>
    </section>

    <?php require_once("components/nav.php"); ?>

    <script src="public/js/user-view.js"></script>
</body>
</html>