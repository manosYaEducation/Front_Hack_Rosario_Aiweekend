<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

function proxyToOriginalBackend($endpoint, $method = 'GET', $data = null) {
    $originalBackend = 'http://localhost/Hackdash-aiweekend/backend/public/';
    $url = $originalBackend . $endpoint;
    
    $options = [
        'http' => [
            'method' => $method,
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $data
        ]
    ];
    
    if ($method === 'POST' && $data) {
        $options['http']['content'] = http_build_query($data);
    }
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    return $result ? json_decode($result, true) : null;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

if ($method === 'GET') {
    if (isset($_GET['id']) && !isset($_GET['slug'])) {
        $endpoint = 'project/get?id=' . intval($_GET['id']);
        $result = proxyToOriginalBackend($endpoint);
        echo json_encode($result ?: ['success' => false, 'message' => 'Error al obtener proyecto']);
    } elseif (isset($_GET['slug'])) {
        $endpoint = 'project/getProjects?slug=' . urlencode($_GET['slug']);
        $result = proxyToOriginalBackend($endpoint);
        echo json_encode($result ?: ['success' => false, 'message' => 'Error al obtener proyectos']);
    } elseif (isset($_GET['id']) && $pathParts[count($pathParts) - 1] === 'members') {
        $projectId = intval($_GET['id']);
        $members = [];
        
        error_log("API Debug - Getting members for project ID: " . $projectId);
        error_log("Session project_members exists: " . (isset($_SESSION['project_members']) ? 'yes' : 'no'));
        
        if (isset($_SESSION['project_members'])) {
            error_log("Total members in session: " . count($_SESSION['project_members']));
            foreach ($_SESSION['project_members'] as $member) {
                if ($member['project_id'] == $projectId) {
                    $members[] = $member;
                }
            }
        }
        
        error_log("Found " . count($members) . " members for project " . $projectId);
        
        echo json_encode([
            'success' => true,
            'members' => $members,
            'debug' => [
                'projectId' => $projectId,
                'totalMembers' => count($members),
                'sessionExists' => isset($_SESSION['project_members'])
            ]
        ]);
    } elseif ($pathParts[count($pathParts) - 1] === 'dashboards' || $path === '/api/dashboards') {
        $endpoint = 'dashboards';
        $result = proxyToOriginalBackend($endpoint);
        echo json_encode($result ?: ['success' => false, 'message' => 'Error al obtener dashboards']);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input)) {
        $input = $_POST;
    }
    
    $action = $pathParts[count($pathParts) - 1];
    
    if ($action === 'createProjectMember') {
        $projectId = intval($input['project_id']);
        $userEmail = $input['email'] ?? '';
        $userName = $input['name'] ?? '';
        $role = $input['role'] ?? 'member';
        
        error_log("API Debug - createProjectMember called");
        error_log("Project ID: " . $projectId);
        error_log("User Email: " . $userEmail);
        error_log("User Name: " . $userName);
        error_log("Input data: " . print_r($input, true));
        
        if (!$projectId || !$userEmail) {
            echo json_encode([
                'success' => false,
                'message' => 'Datos incompletos para unirse al proyecto - Project ID: ' . $projectId . ', Email: ' . $userEmail
            ]);
            return;
        }
        
        if (!isset($_SESSION['project_members'])) {
            $_SESSION['project_members'] = [];
        }
        
        $memberKey = $projectId . '_' . $userEmail;
        if (isset($_SESSION['project_members'][$memberKey])) {
            echo json_encode([
                'success' => false,
                'message' => 'Ya eres miembro de este proyecto'
            ]);
            return;
        }
        
        $_SESSION['project_members'][$memberKey] = [
            'project_id' => $projectId,
            'email' => $userEmail,
            'name' => $userName,
            'role' => $role,
            'joined_at' => date('Y-m-d H:i:s')
        ];
        
        error_log("Member added to session: " . print_r($_SESSION['project_members'][$memberKey], true));
        error_log("Total members in session: " . count($_SESSION['project_members']));
        
        echo json_encode([
            'success' => true,
            'message' => 'Te has unido al proyecto exitosamente',
            'debug' => [
                'memberKey' => $memberKey,
                'totalMembers' => count($_SESSION['project_members'])
            ]
        ]);
    } elseif ($action === 'removeProjectMember') {
        $projectId = intval($input['project_id']);
        $userEmail = $input['email'] ?? '';
        
        if (!$projectId || !$userEmail) {
            echo json_encode([
                'success' => false,
                'message' => 'Datos incompletos para abandonar el proyecto'
            ]);
            return;
        }
        
        $memberKey = $projectId . '_' . $userEmail;
        if (isset($_SESSION['project_members'][$memberKey])) {
            unset($_SESSION['project_members'][$memberKey]);
            echo json_encode([
                'success' => true,
                'message' => 'Has abandonado el proyecto exitosamente'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No eres miembro de este proyecto'
            ]);
        }
    } elseif ($action === 'create') {
        $endpoint = 'project/create';
        $result = proxyToOriginalBackend($endpoint, 'POST', $input);
        echo json_encode($result ?: ['success' => false, 'message' => 'Error al crear proyecto']);
    } else {
        $endpoint = 'project/' . $action;
        $result = proxyToOriginalBackend($endpoint, 'POST', $input);
        echo json_encode($result ?: ['success' => false, 'message' => 'Error en la operación']);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
