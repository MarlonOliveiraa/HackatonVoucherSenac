<?php
ob_clean();
require_once __DIR__ . '/../models/financeiroModel.php';

class FinanceiroController{
    // --- GET ---

    public function getAll() {
        // A Model retorna o array de registros financeiros
        return FinanceiroModel::getAll();
    }

    public function getById($id) {
        // A Model retorna o registro financeiro por ID
        return FinanceiroModel::getById($id);
    }

    // --- POST, PUT, DELETE ---

    public function criar(array $dados) {
        // Mapeamento dos dados do frontend (camelCase) para o formato da Model (snake_case)
        $dataDB = [
            // Frontend key => Nome da Coluna na DB
            'servico_id' => $dados['servicoId'] ?? null,
            'data_pagamento' => $dados['dataPagamento'] ?? null,
            'valor_pago' => $dados['valorPago'] ?? null,
        ];

        $novoId = FinanceiroModel::criarRegistro($dataDB);

        if ($novoId) {
            return ["success" => true, "id" => $novoId, "mensagem" => "Registro financeiro criado com sucesso."];
        } else {
            return ["success" => false, "mensagem" => "Falha ao criar registro financeiro."];
        }
    }

    public function atualizar($id, array $dados) {
        // Mapeamento dos dados de atualização
        $updatesDB = [];
        if (isset($dados['servicoId'])) $updatesDB['servico_id'] = $dados['servicoId'];
        if (isset($dados['dataPagamento'])) $updatesDB['data_pagamento'] = $dados['dataPagamento'];
        if (isset($dados['valorPago'])) $updatesDB['valor_pago'] = $dados['valorPago'];

        $ok = FinanceiroModel::editarRegistro($id, $updatesDB);

        if ($ok) {
            return ["success" => true, "mensagem" => "Registro financeiro atualizado."];
        } else {
            return ["success" => false, "mensagem" => "Falha ao atualizar registro financeiro."];
        }
    }

    public function deletar($id) {
        $ok = FinanceiroModel::deletarRegistro($id);

        if ($ok) {
            return ["success" => true, "mensagem" => "Registro financeiro deletado com sucesso."];
        } else {
            return ["success" => false, "mensagem" => "Falha ao deletar registro financeiro."];
        }
    }
}

?>