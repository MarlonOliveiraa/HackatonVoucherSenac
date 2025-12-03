<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$rota = $_GET["rota"] ?? "";

switch ($rota) {
    case "register":
        require "controllers/register.php";
        break;

    case "login":
        require "controllers/login.php";
        break;

    default:
        echo json_encode(["erro" => true, "mensagem" => "Rota inválida"]);
}
