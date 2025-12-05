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

require_once __DIR__ . "/../controllers/orcamentosController.php";

$controller = new OrcamentoController();
$method = $_SERVER['REQUEST_METHOD'];
$acao = $_GET['acao'] ?? null;
$id = $_GET['id'] ?? null;

$dados = [];
// Lê os dados da requisição JSON
if ($method == 'POST' || $method == 'PUT') {
    $json = file_get_contents("php://input");
    $dados = json_decode($json, true) ?? [];
}

$resposta = ["success" => false, "mensagem" => "Ação não reconhecida."];
$statusCode = 200; 

try {
    switch ($acao) {
        
        //Listar os orçamentos
        case 'listar':
            $resposta = $controller->getAll();
            break;

        //Pehar os itens do orçamento
        case 'itens':
            if (!$id) { $statusCode = 400; $resposta['mensagem'] = "ID necessário para listar itens."; break; }
            $resposta = $controller->getItens($id);
            break;

        //Criar orçamento
        case 'criar':
            if ($method != 'POST') { $statusCode = 405; break; }
            $resposta = $controller->criar($dados);
            $statusCode = $resposta['success'] ? 201 : 422; // 201 Created ou 422 Unprocessable Entity
            break;

        //Atualizar o orçamento
        case 'atualizar':
            if (($method != 'POST' && $method != 'PUT') || !$id) { 
                $statusCode = 405;
                break;
            }
            $resposta = $controller->atualizar($id, $dados);
            break;
        
        //atualizar os itens
        case 'atualizarItens':
            if (($method != 'POST' && $method != 'PUT') || !$id) { $statusCode = 405; break; }
            $resposta = $controller->atualizarItens($id, $dados);
            break;
            
        //deletar o orçamento
        case 'deletar':
            if (($method != 'DELETE' && $method != 'GET') || !$id) { $statusCode = 405; break; }
            $resposta = $controller->deletar($id);
            break;

        //se nenhuma das opções acima forem chamadas, vem o default
        default:
            $statusCode = 404; // Not Found
            $resposta['mensagem'] = "Recurso não encontrado ou ação inválida.";
            break;
    }

//Tratamento de erro
} catch (\Throwable $e) {
    $statusCode = 500; // Internal Server Error
    $resposta = ["success" => false, "mensagem" => "Erro interno no servidor: " . $e->getMessage()];
}


http_response_code($statusCode);
echo json_encode($resposta);

?>