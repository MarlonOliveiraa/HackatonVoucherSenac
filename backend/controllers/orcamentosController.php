<?php
ob_clean();
require_once __DIR__ . '/../models/orcamentosModel.php';

class OrcamentoController{
    // --- GET ---

    public function getAll() {
        // A Model retorna o array de orçamentos
        return OrcamentoModel::getAll(); 
    }

    public function getItens($id) {
        // A Model retorna o array de itens para um id
        return OrcamentoModel::getItensByOrcamentoId($id); 
    }

    // --- POST, PUT, DELETE ---

    public function criar(array $dados) {
        $orcamentoDataFrontend = $dados['orcamento'] ?? [];
        $itensData = $dados['itens'] ?? [];

        // Mapeamento dos dados do frontend para o formato da Model
        $orcamentoDataDB = [
            // Frontend key => nome da coluna no banco de dados
            'cliente_id' => $orcamentoDataFrontend['clienteId'] ?? null,
            'servico_id' => $orcamentoDataFrontend['servicoId'] ?? null,
            'detalhes' => $orcamentoDataFrontend['detalhes'] ?? null,
            'tempo_estimado' => $orcamentoDataFrontend['tempoEstimado'] ?? null,
            'data_criacao' => $orcamentoDataFrontend['dataCriacao'] ?? null,
            'status_orcamento' => $orcamentoDataFrontend['status'] ?? 'pendente',
        ];

        // Aqui usamos o novo array mapeado
        $novoId = OrcamentoModel::criarOrcamento($orcamentoDataDB, $itensData);

        if ($novoId) {
            return ["success" => true, "id" => $novoId, "mensagem" => "Orçamento criado com sucesso."];
        } else {
            return ["success" => false, "mensagem" => "Falha ao criar orçamento."];
        }
    }

    public function atualizar($id, array $dados) {
        // Mapeamento dos dados de atualização
        if (isset($dados['clienteId'])) $updatesDB['cliente_id'] = $dados['clienteId'];
        if (isset($dados['servicoId'])) $updatesDB['servico_id'] = $dados['servicoId'];
        if (isset($dados['detalhes'])) $updatesDB['detalhes'] = $dados['detalhes'];
        if (isset($dados['tempoEstimado'])) $updatesDB['tempo_estimado'] = $dados['tempoEstimado'];
        if (isset($dados['dataCriacao'])) $updatesDB['data_criacao'] = $dados['dataCriacao'];
        if (isset($dados['status'])) $updatesDB['status_orcamento'] = $dados['status'];

        $ok = OrcamentoModel::editarOrcamento($id, $updatesDB);
        
        if ($ok) {
            return ["success" => true, "mensagem" => "Orçamento atualizado."];
        } else {
            return ["success" => false, "mensagem" => "Falha ao atualizar orçamento."];
        }
    }
    
    public function atualizarItens($orcamentoId, array $dados) {
        $novosItens = $dados['itens'] ?? [];
        
        // Chama um novo método da Model que gerencia a transação internamente
        $resultado = OrcamentoModel::sincronizarItens($orcamentoId, $novosItens);

        if ($resultado['success']) {
            return ["success" => true, "mensagem" => "Itens atualizados com sucesso."];
        } else {
            return ["success" => false, "mensagem" => "Erro ao sincronizar itens: " . $resultado['mensagem']];
        }
    }


    public function deletar($id) {
        $ok = OrcamentoModel::deletarOrcamento($id);

        if ($ok) {
            return ["success" => true, "mensagem" => "Orçamento deletado com sucesso."];
        } else {
            return ["success" => false, "mensagem" => "Falha ao deletar orçamento."];
        }
    }
}

?>