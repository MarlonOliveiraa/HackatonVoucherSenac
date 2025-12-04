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
        // A Model retorna o array de itens para um ID
        return OrcamentoModel::getItensByOrcamentoId($id); 
    }

    // --- POST, PUT, DELETE ---

    public function criar(array $dados) {
        $orcamentoDataFrontend = $dados['orcamento'] ?? [];
        $itensData = $dados['itens'] ?? [];

        // Mapeamento dos dados do frontend (camelCase) para o formato da Model (snake_case/colunas do DB)
        $orcamentoDataDB = [
            // Frontend key => DB column name
            'cliente_id' => $orcamentoDataFrontend['clienteId'] ?? null,
            'servico_id' => $orcamentoDataFrontend['servicoId'] ?? null,
            'detalhes' => $orcamentoDataFrontend['detalhes'] ?? null,
            'tempo_estimado' => $orcamentoDataFrontend['tempoEstimado'] ?? null,
            'data_criacao' => $orcamentoDataFrontend['dataCriacao'] ?? null,
            'status_orcamento' => $orcamentoDataFrontend['status'] ?? 'pendente', // status no frontend
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
        // Mapeamento dos dados de atualização (apenas os campos que podem ser atualizados)
        $updatesDB = [];
        if (isset($dados['clienteId'])) $updatesDB['cliente_id'] = $dados['clienteId'];
        if (isset($dados['servicoId'])) $updatesDB['servico_id'] = $dados['servicoId'];
        if (isset($dados['detalhes'])) $updatesDB['detalhes'] = $dados['detalhes'];
        if (isset($dados['tempoEstimado'])) $updatesDB['tempo_estimado'] = $dados['tempoEstimado'];
        if (isset($dados['dataCriacao'])) $updatesDB['data_criacao'] = $dados['dataCriacao'];
        if (isset($dados['status'])) $updatesDB['status_orcamento'] = $dados['status']; // status no frontend

        $ok = OrcamentoModel::editarOrcamento($id, $updatesDB); // Use $updatesDB
        
        if ($ok) {
            return ["success" => true, "mensagem" => "Orçamento atualizado."];
        } else {
            return ["success" => false, "mensagem" => "Falha ao atualizar orçamento."];
        }
    }
    
    public function atualizarItens($orcamentoId, array $dados) {
        $novosItens = $dados['itens'] ?? [];
        
        $pdo = OrcamentoModel::connect(); 
        $pdo->beginTransaction();
        
        try {
            //Obter e comparar IDs
            $idsExistentes = OrcamentoModel::getExistingItemIds($orcamentoId);
            $novosIds = array_filter(array_map(function($item) {
                return (isset($item['id']) && is_numeric($item['id'])) ? (int)$item['id'] : null;
            }, $novosItens));
            $idsParaDeletar = array_diff($idsExistentes, $novosIds);
            
            //Deletar itens removidos
            foreach ($idsParaDeletar as $itemId) {
                OrcamentoModel::deleteItem($itemId);
            }
            
            //Inserir ou atualizar itens
            foreach ($novosItens as $item) {
                OrcamentoModel::upsertItem($orcamentoId, $item);
            }
            
            $pdo->commit();
            return ["success" => true, "mensagem" => "Itens atualizados com sucesso."];
        } catch (\Throwable $e) {
            $pdo->rollBack();
            return ["success" => false, "mensagem" => "Erro ao sincronizar itens: " . $e->getMessage()];
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