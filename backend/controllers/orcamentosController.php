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