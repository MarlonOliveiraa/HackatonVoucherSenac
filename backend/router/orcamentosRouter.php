<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../controllers/orcamentosController.php";

$acao = $_GET['acao'] ?? '';
$orcamentoController = new OrcamentoController();

//pega dados do front-end
$body = json_decode(file_get_contents('php://input'), true);

switch ($acao){
    case 'criar':
        if ($body){
            $resposta = $orcamentoController->criar($body);
            echo json_encode($resposta);
        } else{
            echo json_encode(["erro" => "Dados não informados!"]);
        }
        break;
    
    case 'listar':
        $resposta = $orcamentoController->listar();
        echo json_encode($resposta);
        break;
    
    case 'itens':
        $id = $_GET['id'] ?? null;
        if ($id){
            $resposta = $orcamentoController->itens($id);
            echo json_encode($resposta);
        } else{
            echo json_encode(["erro" => "ID não informado!"]);
        }
        break;

    case 'atualizar':
        $id = $_GET['id'] ?? null;
        if ($id && $body){
            $resposta = $orcamentoController->atualizar($id, $body);
            echo json_encode($resposta);
        } else{
            echo json_encode(["erro" => "ID ou dados não informados!"]);
        }
        break;

    case 'deletar':
        $id = $_GET['id'] ?? null;
        if($id){
            $resposta = $orcamentoController->deletar($id);
            echo json_encode($resposta);
        } else{
            echo json_encode(["erro" => "ID não informado!"]);
        }
        break;

    default:
        echo json_encode(["erro" => "Ação inválida!"]);
        break;
}

?>