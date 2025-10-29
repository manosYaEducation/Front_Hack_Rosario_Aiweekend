<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIWKND - Proyectos</title>
    <link rel="stylesheet" href="public/css/styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-left">
                 <a href="index" class="nav-link">
                <img src="public/images/AIWKND-negro-solo.png" alt="AIWKND" class="logo">
                </a>
                <nav class="desktop-nav">
                    <a href="index" class="nav-link">
                        <span class="nav-icon"></span>
                        <span class="nav-text">Inicio</span>
                    </a>
                    <a href="project-list" class="nav-link">
                        <span class="nav-icon"></span>
                        <span class="nav-text">Proyectos</span>
                    </a>
                </nav>
            </div>
            <nav class="desktop-nav-right">
                <a href="profile" class="nav-link">
                    <span class="nav-icon"></span>
                    <span class="nav-text">Cuenta</span>
                </a>
            </nav>
        </header>
        
        <main class="main-content">
            <!-- Hero Section -->
            <div class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">Evento AIWKND<br>Mendoza 2025</h1>
                </div>
            </div>
            
           
            <!-- Projects List -->
            <div class="projects-list">  
                 <section id="projects" class="projects-overview">
                     
                    <a href="project-create" class="create-project-btn">Crear Proyecto</a>
                    <div class="projects-search" id="projectsSearch">
                        <input type="text" id="searchProjectsInput" placeholder="Buscar proyectos por título" aria-label="Buscar proyectos por título">                 
                    </div>                 
                    <div class="projects-grid" id="allProjectsGrid">
                        <!-- Projects will be loaded here via JavaScript -->
                    </div>
                    <div class="pagination-controls" id="paginationControls">
                        <!-- Pagination buttons will be loaded here via JavaScript -->
                    </div>                  
                    <!-- Sección Hackathon -->
                    <div class="hackathon-content-section">
                        <h1 class="hackathon-main-title"> Hackathon AI Weekend Mendoza</h1>
                        <h2 class="hackathon-subtitle">Un espacio para crear, compartir y experimentar con IA</h2>                       
                        <div class="hackathon-intro">
                            <p>En el AI Weekend Mendoza creemos que la innovación comienza cuando perdemos el miedo a experimentar. Por eso, nuestra hackathon no tiene barreras técnicas ni requisitos previos: está pensada para todos los curiosos de la inteligencia artificial —desde desarrolladores hasta artistas, docentes o personas mayores que quieren explorar este nuevo mundo.</p>
                        </div>
                        <div class="hackathon-presentation">
                            <h3 class="section-title">Al final del evento, cada equipo tendrá:</h3>
                            <ul class="presentation-timeline">
                                <li><span class="icon"></span> <strong>3 minutos</strong> para exponer su proyecto.</li>
                                <li><span class="icon"></span> <strong>2 minutos</strong> para responder preguntas del jurado.</li>
                            </ul>
                        </div>
                        <div class="hackathon-philosophy">
                            <p>No buscamos presentaciones perfectas ni grandes avances tecnológicos. Lo importante es la idea, la historia y las personas detrás del proyecto. Queremos ver cómo usas la magia de la IA para resolver un problema, inspirar a otros o crear algo que antes parecía imposible.</p>
                        </div>
                        <div class="hackathon-remember">
                            <h3 class="section-title">Recuerda:</h3>
                            <ul class="remember-list">
                                <li><span class="remember-icon"></span><span class="remember-text">El pitch principal eres tú, no la diapositiva.</span></li>
                                <li><span class="remember-icon"></span><span class="remember-text">El jurado valora la claridad, la colaboración y la visión.</span></li>
                                <li><span class="remember-icon"></span><span class="remember-text">La hackathon es un espacio inclusivo y diverso, donde se pueden cruzar abuelas curiosas, niños programadores y emprendedores locales, entre otros.</span></li>
                                <li><span class="remember-icon"></span><span class="remember-text">El trabajo en equipo y las conexiones que generes valen tanto como el proyecto mismo.</span></li>
                                <li><span class="remember-icon"></span><span class="remember-text">Ya lo vimos en el workshop de Matías: hoy cualquiera puede crear un video con IA. Lo que queremos ver ahora es cómo tú puedes usar esa posibilidad para contar tu historia.</span></li>
                                <li><span class="remember-icon"></span><span class="remember-text">Confía en tu proyecto, tu equipo, comparte tu experiencia y sé parte de la comunidad que está abriendo la puerta a la IA para todos.</span></li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Sección de la jornada del viernes con video -->
                    <div class="jornada-video-wrapper">
                        <div class="jornada-video-container">
                            <div class="jornada-text-content">
                                <p>La jornada del viernes 17 comenzó explorando cómo la inteligencia artificial está transformando los negocios con la charla de <strong>Marcos Bruno</strong>, seguida por <strong>Melanie Swarynski</strong> (<strong>Google</strong>), quien invitó a pasar del entusiasmo a la acción frente a la oportunidad que representa la IA. Luego, <strong>Eugenia Haeusser</strong> (<strong>iPlan</strong>) animó a las pymes a convertirse en estrategas tecnológicas, mientras <strong>Santiago Cavanna</strong> (<strong>Microsoft</strong>) destacó la importancia de construir confianza en las soluciones basadas en IA. Desde el mundo creativo, <strong>Melina Bordino</strong> (<strong>Febrero Made</strong>) y el dúo <strong>Noe Antonelli</strong> y <strong>Juan Funes</strong> reflexionaron sobre cómo la inteligencia artificial redefine la publicidad y el proceso creativo. Más tarde, <strong>Augusto Salvatto</strong> (<strong>Rock in Data</strong>) propuso repensar nuestras conversaciones sobre IA, <strong>Martín Sanado</strong> (<strong>Amazon</strong>) habló de cómo pasar <em>"del prompt al propósito"</em>, y <strong>Esteban Suárez</strong> cerró la mañana con una mirada práctica al desarrollo <em>"From 0 to v0"</em>. Tras el almuerzo, <strong>Martín Rabaglia</strong> llevó la reflexión hacia un horizonte más filosófico con su charla <em>"Un futuro lleno de caos infinito"</em>, abriendo preguntas sobre el rumbo de la humanidad en la era de la inteligencia artificial.</p>
                            </div>
                            <div class="jornada-video-content vertical-video">
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/8V_iigw4FnE?si=QVAYf0gqypl5m4uY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Comunidad Colaboradora -->
                    <div class="hero-content">
                        <h1 class="community-title">Comunidad Colaboradora</h1>
                    </div>
                    
                    <!-- Botones de comunidad -->
                    <div class="projects-search community-buttons">
                        <a href="https://wa.me/5492612750652" class="community-btn">SofIA Unobot</a>
                        <a href="https://drive.google.com/file/d/1wyA4_FGjIVsj_6Oc57qWAnDIevvzTzuV/view?usp=drive_link" class="community-btn">Entrevistas CuyoConnect</a>
                        <a href="https://drive.google.com/file/d/1pGcyTSG9fX_CXgs1YFMGWoFB5Psl3pJK/view?usp=sharing" class="community-btn">Workshop Genosha</a>
                    </div>
                    
                    <!-- Descripción del programa -->
                    <p class="program-description">Noe Antonielli y Juan Funes nos comparten toda su energia en su programa "LA IA ES FUROR" directo desde el evento</p>
                    
                    <!-- Video de LA IA ES FUROR -->
                    <div class="projects-search video-section">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/1ddmckF86lY?si=Z0tqEYolNdfTkzUB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                </section>
            </div>
        </main>
        <!-- Desktop Bottom Nav -->
        <nav class="desktop-bottom-nav">
            <img src="public/images/AIWKND-negro-solo.png" alt="AIWKND" class="desktop-bottom-logo">
        </nav>
        
        <?php require_once("components/nav.php"); ?>
    </div>
    <script src="public/js/config.js"></script>
    <script src="public/js/session-check.js"></script>
    <script src="public/js/landing.js"></script>
</body>
</html>