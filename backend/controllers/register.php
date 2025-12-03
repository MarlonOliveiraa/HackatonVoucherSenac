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

$data = json_decode(file_get_contents('php://input'), true);

$nome = $data["nome"] ?? "";
$email = $data["email"] ?? "";
$senha = $data["senha"] ?? "";
$confirmarSenha = $data["confirmarSenha"] ?? "";

// Verifica campos obrigatórios
if (!$nome || !$email || !$senha || !$confirmarSenha) {
    response(false, "Preencha todos os campos");
}

// Verifica se as senhas batem
if ($senha !== $confirmarSenha) {
    response(false, "As senhas não coincidem");
}

// Hash seguro da senha
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Insere no banco com tratamento de erro
try {
    $sql = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
    $sql->execute([$nome, $email, $senha_hash]);

    response(true, "Usuário cadastrado com sucesso");

} catch (PDOException $e) {

    // Código 1062 = Duplicate entry (violou UNIQUE)
    if ($e->errorInfo[1] == 1062) {
        response(false, "Este e-mail já está cadastrado");
    }

    // Para qualquer outro erro
    response(false, "Erro interno ao cadastrar");
}
