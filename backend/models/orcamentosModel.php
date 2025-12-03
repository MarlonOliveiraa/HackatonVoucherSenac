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

    //retornar a conexão
    public function getConn(){
        return $this->conn;
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

    //Obter a lista de ids de itens
    public function getExistingItemIds($orcamentoId) {
        $sql = "SELECT id FROM orcamento_itens WHERE orcamento_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$orcamentoId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN, 0); // Retorna array simples de IDs
    }

    //Deletar um item especifico
    public function deleteItem($itemId) {
        $sql = "DELETE FROM orcamento_itens WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$itemId]);
    }

    //Inserir ou atualizar um unico item
    public function upsertItem($orcamentoId, $item) {
        $valorNumerico = is_numeric($item['valor']) ? floatval($item['valor']) : 0;
        
        if (isset($item['id']) && is_numeric($item['id'])) { 
            $sql = "UPDATE orcamento_itens SET nomeItem = :nomeItem, valor = :valor WHERE id = :id AND orcamento_id = :orcamentoId";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([
                ':nomeItem' => $item['nomeItem'],
                ':valor' => $valorNumerico,
                ':id' => $item['id'],
                ':orcamentoId' => $orcamentoId
            ]);
        }
        
        $sql = "INSERT INTO orcamento_itens (orcamento_id, nomeItem, valor) VALUES (:orcamento_id, :nomeItem, :valor)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':orcamento_id' => $orcamentoId,
            ':nomeItem' => $item['nomeItem'],
            ':valor' => $valorNumerico
        ]);
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

    //Deletar todos os itens de um orçamento
    public function deletarItens($orcamentoId){
        $sql = "DELETE FROM orcamentos_itens WHERE orcamento_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$orcamentoId]);
    }

    //Inserir itens
    public function inserirItens($orcamentoId, $itens){
        $sqlItem = "INSERT INTO orcamento_itens (orcamento_id, nomeItem, valor) VALUES ( ?, ?, ?)";
        $stmtItem = $this->conn->prepare($sqlItem);

        foreach ($itens as $item){
            $valorNumerico = is_numeric($item['valor']) ? floatval($item['valor']) : 0;

            $stmtItem->execute([
                $orcamentoId, $item['nomeItem'], $valorNumerico
            ]);
        }
        return true;
    }


}




?>