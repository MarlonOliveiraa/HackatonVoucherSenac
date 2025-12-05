<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../controllers/financeiroController.php';

$controller = new FinanceiroController();
$method = $_SERVER['REQUEST_METHOD'];

// Permitir preflight
if ($method === "OPTIONS") {
    http_response_code(200);
    exit;
}

// ROTEAMENTO POR ?acao=
$acao = $_GET['acao'] ?? null;

switch ($acao) {

    case 'listar':
        if ($method === "GET") {
            $controller->obterTodos();
        } else {
            metodoNaoPermitido();
        }
        break;

    case 'criar':
        if ($method === "POST") {
            $controller->criar();
        } else {
            metodoNaoPermitido();
        }
        break;

    case 'atualizar':
        if ($method === "PUT") {
            $id = $_GET['id'] ?? null;
            if (!$id) respostaErro("ID não informado");
            $controller->atualizar($id);
        } else {
            metodoNaoPermitido();
        }
        break;

    case 'deletar':
        if ($method === "DELETE") {
            $id = $_GET['id'] ?? null;
            if (!$id) respostaErro("ID não informado");
            $controller->excluir($id);
        } else {
            metodoNaoPermitido();
        }
        break;

    case 'total':
        if ($method === "GET") {
            $controller->obterTotal();
        } else {
            metodoNaoPermitido();
        }
        break;

    default:
        echo json_encode([
            'success' => false,
            'message' => 'Ação inválida'
        ]);
        break;
}

function metodoNaoPermitido() {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}

function respostaErro($msg) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $msg]);
}
