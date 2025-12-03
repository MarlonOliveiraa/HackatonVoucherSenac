<?php

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../utils/response.php";

$db = new Database();
$conn = $db->Connect();

if (!$conn) {
    die("Erro ao conectar ao banco de dados.");
}


$data = json_decode(file_get_contents('php://input'), true);

$email = $data["email"] ?? "";
$senha = $data["senha"] ?? "";

$sql = $conn->prepare("SELECT * FROM usuarios WHERE email = :email");
$sql->execute(['email' => $email]);
$user = $sql->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    response(false, "Usuário não encontrado");
}

if (!password_verify($senha, $user["senha"])) {
    response(false, "Senha incorreta");
}

response(true, "Login autorizado", [
    "id" => $user["id"],
    "nome" => $user["nome"],
    "email" => $user["email"],
]);
