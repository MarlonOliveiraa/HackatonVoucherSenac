<?php
ob_clean();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../controllers/dashboardController.php";

$acao = $_GET['acao'] ?? '';
$dashboardController = new DashboardController();

switch ($acao) {
    case 'getDashboardData':
        $resposta = $dashboardController->index();
        echo json_encode($resposta);
        break;

    default:
        echo json_encode(["erro" => "Ação inválida"]);
        break;
}
