<?php

ob_clean();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../utils/response.php";
require_once __DIR__ . "/../models/servicosModel.php";

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {

    // ======================================================
    // GET – LISTAR SERVIÇOS
    // ======================================================
    case "GET":
        try {
            $lista = Servico::getAll();
            response(true, "Lista carregada com sucesso", $lista);
        } catch (Exception $e) {
            response(false, "Erro interno ao listar");
        }
    break;


    // ======================================================
    // POST – CRIAR SERVIÇO
    // ======================================================
    case "POST":
        $nome = $data["nome"] ?? "";
        $descricao = $data["descricao"] ?? "";

        if (!$nome || !$descricao) {
            response(false, "Preencha todos os campos");
        }

        try {
            $ok = Servico::create($nome, $descricao);

            if ($ok) {
                response(true, "Serviço criado com sucesso");
            } else {
                response(false, "Erro ao criar serviço");
            }

        } catch (Exception $e) {
            response(false, "Erro interno ao criar");
        }
    break;


    // ======================================================
    // PUT – ATUALIZAR SERVIÇO
    // ======================================================
    case "PUT":
        $id = $_GET["id"] ?? null;

        if (!$id) {
            response(false, "ID não informado");
        }

        $nome = $data["nome"] ?? "";
        $descricao = $data["descricao"] ?? "";

        if (!$nome || !$descricao) {
            response(false, "Preencha todos os campos");
        }

        try {
            $ok = Servico::update($id, $nome, $descricao);

            if ($ok) {
                response(true, "Serviço atualizado com sucesso");
            } else {
                response(false, "Erro ao atualizar serviço");
            }

        } catch (Exception $e) {
            response(false, "Erro interno ao atualizar");
        }
    break;


    // ======================================================
    // DELETE – EXCLUIR SERVIÇO
    // ======================================================
    case "DELETE":
        $id = $_GET["id"] ?? null;

        if (!$id) {
            response(false, "ID não informado");
        }

        try {
            $ok = Servico::delete($id);

            if ($ok) {
                response(true, "Serviço deletado com sucesso");
            } else {
                response(false, "Erro ao deletar serviço");
            }

        } catch (Exception $e) {
            response(false, "Erro interno ao deletar");
        }
    break;


    // ======================================================
    default:
        response(false, "Método inválido");
}
