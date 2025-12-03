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
                ':servico_id' => $data['servicoteId'],
                ':detalhes' => $data['detalhes'],
                ':tempo_estimado' => $data['tempoEstimado'],
                ':data_criacao' => $data['dataCriacao'],
                ':status_orcamento' => $data['statusOrcamento']
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


}




?>