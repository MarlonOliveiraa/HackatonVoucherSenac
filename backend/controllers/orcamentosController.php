<?php

require_once __DIR__ . '/../models/orcamentoModel.php';

class OrcamentoController{
    
    private $model;

    public function __construct(){
        $this->model = new OrcamentoModel();
    }

    public function criar($request){
        $orcamento = $request['orcamento'];
        $itens = $request['itens'];

        $id = $this->model->criarOrcamento($orcamento, $itens);

        if ($id){
            return ["success" => true, "id" => $id];
        }
        return ["success" => false];
    }

    public function listar(){
        return $this->model->listarOrcamentos();
    }

    public function itens($id){
        return $this->model->listarItens($id);
    }

    public function atualizarItens($orcamentoId, $novosItens){
        try {
            $this->model->getConn()->beginTransaction(); 
    
            //Obter od ids dos itens que vieram do frontend
            $novosIds = array_map(function($item) {
                return (isset($item['id']) && is_numeric($item['id'])) ? $item['id'] : null;
            }, $novosItens);
            $novosIds = array_filter($novosIds); // Remove IDs nulos e mockados (itens novos)
            
            //Obter ids dos itens no banco
            $idsExistentes = $this->model->getExistingItemIds($orcamentoId);
    
            //Deletar itens que foram removidos no Frontend
            $idsParaDeletar = array_diff($idsExistentes, $novosIds);
            foreach ($idsParaDeletar as $itemId) {
                $this->model->deleteItem($itemId);
            }
    
            //Inserir ou atualizar os itens da nova lista
            foreach ($novosItens as $item) {
                $this->model->upsertItem($orcamentoId, $item);
            }
    
            $this->model->getConn()->commit();
            return ["success" => true];
    
        } catch (\Throwable $th) {
            $this->model->getConn()->rollBack(); 
            return ["success" => false, "mensagem" => $th->getMessage()];
        }
    }

    public function atualizar($id, $body){
        $ok = $this->model->atualizarOrcamento($id, $body);
        return ["success" => $ok];
    }

    public function deletar($id){
        $ok = $this->model->deleteOrcamento($id);
        return ["success" => $ok];
    }

}

?>