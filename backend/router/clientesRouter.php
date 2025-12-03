<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../controllers/orcamentosController.php";

$acao = $_GET['acao'] ?? '';
$clientesController = new ClientesController();

//pega dados do front-end
$body = json_decode(file_get_contents('php://input'), true);

switch ($acao){
    case 'criar':
        if ($body){
            $resposta = $clientesController->criar($body);
            echo json_encode($resposta);
        } else{
            echo json_encode(["erro" => "Dados não informados!"]);
        }
        break;
    
    default:
        echo json_encode(["erro" => "Ação inválida!"]);
        break;
}

?>