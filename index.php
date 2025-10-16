<?php

// Cargar las rutas
$routes = require __DIR__ . '/routes.php';

// Obtener la ruta solicitada desde la URL
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');

// Si la ruta existe en el array, cargar la vista correspondiente
if (array_key_exists($uri, $routes)) {
    require $routes[$uri];
} else {
    // Si no existe, cargar la vista de "no encontrado"
    require $routes['not-found'];
}