<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../models/financeiroModel.php';

class FinanceiroController {

    private $modelo;

    public function __construct() {
        $this->modelo = new FinanceiroModel();
    }

    public function processarRequisicao() {
        $metodo = $_SERVER['REQUEST_METHOD'];
        $caminho = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        if ($metodo === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $id = null;
        if (preg_match('/\/financeiro\/(\d+)/', $caminho, $matches)) {
            $id = $matches[1];
        }

        switch ($metodo) {
            case 'GET':
                $this->handleGet($id, $caminho);
                break;

            case 'POST':
                $this->criar();
                break;

            case 'PUT':
                $id ? $this->atualizar($id) : $this->metodoNaoPermitido();
                break;

            case 'DELETE':
                $id ? $this->excluir($id) : $this->metodoNaoPermitido();
                break;

            default:
                $this->metodoNaoPermitido();
        }
    }

    public function handleGet($id, $caminho) {
        if ($id) return $this->obterPorId($id);
        if (strpos($caminho, '/total') !== false) return $this->obterTotal();
        return $this->obterTodos();
    }

    public function obterTodos() {
        try {
            $rows = $this->modelo->obterTodos();

            $data = array_map(fn($r) => [
                "id" => $r["id"],
                "servicoId" => $r["servico_id"],
                "dataPagamento" => $r["data_pagamento"],
                "valorPago" => $r["valor_pago"]
            ], $rows);

            echo json_encode(["success" => true, "data" => $data]);

        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    public function obterPorId($id) {
        try {
            $r = $this->modelo->obterPorId($id);

            if (!$r) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Registro não encontrado"]);
                return;
            }

            $data = [
                "id" => $r["id"],
                "servicoId" => $r["servico_id"],
                "dataPagamento" => $r["data_pagamento"],
                "valorPago" => $r["valor_pago"]
            ];

            echo json_encode(["success" => true, "data" => $data]);

        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    public function obterTotal() {
        try {
            $total = $this->modelo->obterTotalRecebido();
            echo json_encode(["success" => true, "total" => $total]);

        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    public function criar() {
        try {
            $entrada = json_decode(file_get_contents('php://input'), true);

            if (!$this->validarEntrada($entrada)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Dados inválidos"]);
                return;
            }

            $id = $this->modelo->criar($entrada);

            echo json_encode([
                "success" => true,
                "id" => $id,
                "message" => "Registro criado com sucesso"
            ]);

        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    public function atualizar($id) {
        try {
            $entrada = json_decode(file_get_contents('php://input'), true);

            if (!$this->validarEntrada($entrada)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Dados inválidos"]);
                return;
            }

            $linhas = $this->modelo->atualizar($id, $entrada);

            if ($linhas > 0) {
                echo json_encode(["success" => true, "message" => "Registro atualizado"]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Registro não encontrado"]);
            }

        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    public function excluir($id) {
        try {
            $linhas = $this->modelo->excluir($id);

            if ($linhas > 0) {
                echo json_encode(["success" => true, "message" => "Registro excluído"]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Registro não encontrado"]);
            }

        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    public function validarEntrada($entrada) {
        return isset($entrada['servicoId'])
            && isset($entrada['dataPagamento'])
            && isset($entrada['valorPago'])
            && is_numeric($entrada['valorPago']);
    }

    public function metodoNaoPermitido() {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método não permitido"]);
    }

    public function respostaErro($mensagem) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $mensagem]);
    }
}

if (basename(__FILE__) === basename($_SERVER["PHP_SELF"])) {
    (new FinanceiroController())->processarRequisicao();
}
