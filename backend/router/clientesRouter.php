<?php
ob_clean();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/clientesController.php";

$acao = $_GET['acao'] ?? '';
$db = new Database();
$pdo = $db->Connect();
$controller = new ClientesController($pdo);

switch ($acao) {
	case 'listar':
	case 'getClientes':
		$resposta = $controller->index();
		echo json_encode($resposta);
		break;

	case 'getCliente':
		$id = $_GET['id'] ?? null;
		$resposta = $controller->show($id);
		echo json_encode($resposta);
		break;

	case 'criar':
	case 'create':
		$body = json_decode(file_get_contents('php://input'), true) ?? $_POST;
		$resposta = $controller->store($body);
		echo json_encode($resposta);
		break;

	case 'atualizar':
	case 'update':
		$id = $_GET['id'] ?? null;
		$body = json_decode(file_get_contents('php://input'), true) ?? [];
		$resposta = $controller->update($id, $body);
		echo json_encode($resposta);
		break;

	case 'deletar':
	case 'delete':
		$id = $_GET['id'] ?? null;
		$resposta = $controller->destroy($id);
		echo json_encode($resposta);
		break;

	default:
		echo json_encode(["erro" => "Ação inválida"]);
		break;
}

?>