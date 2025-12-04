<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
ob_clean();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../controllers/financeiroController.php";

$controller = new FinanceiroController();
$method = $_SERVER['REQUEST_METHOD'];
$acao = $_GET['acao'] ?? null;
$id = $_GET['id'] ?? null;

$dados = [];
// Lê os dados do corpo da requisição JSON (para POST/PUT)
if ($method == 'POST' || $method == 'PUT') {
    $json = file_get_contents("php://input");
    $dados = json_decode($json, true) ?? [];
}

$resposta = ["success" => false, "mensagem" => "Ação não reconhecida."];
$statusCode = 200; // Começamos com sucesso

// --- 3. ROTEAMENTO (SWITCH) ---
try {
    switch ($acao) {

        case 'listar':
            $resposta = $controller->getAll();
            break;

        case 'buscar':
            if (!$id) { $statusCode = 400; $resposta['mensagem'] = "ID necessário para buscar registro."; break; }
            $resposta = $controller->getById($id);
            break;

        case 'criar':
            if ($method != 'POST') { $statusCode = 405; break; }
            $resposta = $controller->criar($dados);
            $statusCode = $resposta['success'] ? 201 : 422; // 201 Created ou 422 Unprocessable Entity
            break;

        case 'atualizar':
            if (($method != 'POST' && $method != 'PUT') || !$id) {
                $statusCode = 405;
                break;
            }
            $resposta = $controller->atualizar($id, $dados);
            break;

        case 'deletar':
            if (($method != 'DELETE' && $method != 'GET') || !$id) { $statusCode = 405; break; }
            $resposta = $controller->deletar($id);
            break;

        default:
            $statusCode = 404; // Not Found
            $resposta['mensagem'] = "Recurso não encontrado ou ação inválida.";
            break;
    }

} catch (\Throwable $e) {
    $statusCode = 500; // Internal Server Error
    $resposta = ["success" => false, "mensagem" => "Erro interno no servidor: " . $e->getMessage()];
}

// --- 4. SAÍDA FINAL ---
http_response_code($statusCode);
echo json_encode($resposta);

?>