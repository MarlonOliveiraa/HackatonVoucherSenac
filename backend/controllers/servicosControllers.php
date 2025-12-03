<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/database.php";
require_once "../models/servicosModel.php";

$db = (new Database())->connect();
$servico = new Servico($db);

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {

// LISTAR
    case "GET":
        $result = $servico->listar();
        echo json_encode($result);
    break;

    // CRIAR
    case "POST":
        $data = json_decode(file_get_contents("php://input"));

        $servico->nome          = $data->nome;
        $servico->descricao = $data->descricao;

        if ($servico->criar()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;

    // ATUALIZAR
    case "PUT":
        $id = $_GET["id"];
        $data = json_decode(file_get_contents("php://input"));

        $servico->nome          = $data->nome;
        $servico->descricao = $data->descricao;

        if ($servico->editar($id)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;

    // DELETAR
    case "DELETE":
        $id = $_GET["id"];

        if ($servico->deletar($id)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
        break;
}

?>