<?php

require_once __DIR__ . '/../config/database.php';

class OrcamentoModel{

    private $conn;

    public function __construct(){
        $db = new Database();
        $this->conn = $db->Connect();
    }


    //Criar Orçamento
    public function criarOrcamento($data, $itens){
        try {
            $this->conn->beginTransaction();

            //Inserindo orçamento
            $sql = " INSERT INTO orcamento
                (cliente_id, servico_id, detalhes, tempo_estimado, data_criacao, status_orcamento)
                VALUES (:cliente_id, :servico_id, :detalhes, :tempo_estimado, :data_criacao, :status_orcamento)";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                ':cliente_id' => $data['clienteId'],
                ':servico_id' => $data['servicoId'],
                ':detalhes' => $data['detalhes'],
                ':tempo_estimado' => $data['tempoEstimado'],
                ':data_criacao' => $data['dataCriacao'],
                ':status_orcamento' => $data['status']
            ]);

            $orcamentoId = $this->conn->lastInsertId();


            //inserindo itens do orçamento
            $sqlItem = "INSERT INTO orcamento_itens
                (orcamento_id, nomeItem,valor)
                VALUES (:orcamento_id, :nomeItem, :valor)";

            $stmtItem = $this->conn->prepare($sqlItem);

            foreach ($itens as $item){
                $stmtItem->execute([
                    ':orcamento_id' => $orcamentoId,
                    ':nomeItem' => $item['nomeItem'],
                    ':valor' => $item['valor']
                ]);
            }

            $this->conn->commit();

            return $orcamentoId;

        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    //Listar todos
    public function listarOrcamentos(){
        $sql = "SELECT * FROM orcamento ORDER BY id DESC";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll();
    }

    //Itens de um orçamento
    public function listarItens($orcamentoId){
        $sql = "SELECT * FROM orcamento_itens WHERE orcamento_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':id' => $orcamentoId]);
        return $stmt->fetchAll();
    }

    //Atualizar orçamento
    public function atualizarOrcamento($id,$data){
        $set = [];
        $params = [':id' => $id];

        foreach ($data as $campo => $valor){
            $set[] = "$campo = :$campo";
            $params[":$campo"] = $valor;
        }

        $sql = "UPDATE orcamento SET " . implode(", ", $set) . "WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($params);
    }

    //Excluir orçamento
    public function deleteOrcamento($id){
        try{
            $this->conn->beginTransaction();
            $this->conn->prepare("DELETE FROM orcamento_itens WHERE orcamento_id = ?")
                       ->execute([$id]);
            
            $this->conn->prepare("DELETE FROM orcamento WHERE id = ?")
                       ->execute([$id]);

            $this->conn->commit();
            return true;
        } catch (Exception $e){
            $this->conn->rollBack();
            return false;
        }
    }


}




?>