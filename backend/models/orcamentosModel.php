<?php

require_once __DIR__ . "/../config/database.php";

class OrcamentoModel{

    private static $table = "orcamento";
    private static $pdo;

    //Conectando ao banco
    private static function connect(){
        if (!self::$pdo){
            $db = new Database();
            self::$pdo = $db->Connect();
        }
        return self::$pdo;
    }

    //Listar os orçamentos
    public static function getAll(){
        $pdo = self::connect();
        $stmt = $pdo->prepare("
            SELECT 
                id, 
                cliente_id AS clienteId, 
                servico_id AS servicoId, 
                detalhes, 
                tempo_estimado AS tempoEstimado, 
                data_criacao AS dataCriacao, 
                status_orcamento AS status 
            FROM orcamento
        ");
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //Listar itens por id do orçamento
    public static function getItensByOrcamentoId($orcamentoId){
        $pdo = self::connect();
        $stmt = $pdo->prepare("
            SELECT 
                id, 
                orcamento_id AS orcamentoId, 
                nomeItem, 
                valor 
            FROM orcamento_itens 
            WHERE orcamento_id = ?
        ");
        $stmt->execute([$orcamentoId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //Criar orçamento
    public static function criarOrcamento(array $orcamentoData, array $itensData){
        $pdo = self::connect();

        try {
            $pdo->beginTransaction();

            // 1. Inserir Orçamento Principal
            $stmt = $pdo->prepare("INSERT INTO orcamento 
                                    (cliente_id, servico_id, detalhes, tempo_estimado, data_criacao, status_orcamento)
                                    VALUES (?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                $orcamentoData['cliente_id'], 
                $orcamentoData['servico_id'], 
                $orcamentoData['detalhes'], 
                $orcamentoData['tempo_estimado'], 
                $orcamentoData['data_criacao'], 
                $orcamentoData['status_orcamento']
            ]);

            $orcamentoId = $pdo->lastInsertId();

            // 2. Inserir Itens do Orçamento
            foreach ($itensData as $item) {
                self::criarItem($orcamentoId, $item['nomeItem'], $item['valor']);
            }

            $pdo->commit();
            return $orcamentoId; 
        } catch (\Throwable $e) {
            $pdo->rollBack();
            return false;
        }
    }

   //Criar um item
    public static function criarItem($orcamentoId, $nomeItem, $valor) {
        $pdo = self::connect();
        
        $stmt = $pdo->prepare("INSERT INTO orcamento_itens (orcamento_id, nomeItem, valor)
                               VALUES ( ?, ?, ?)");
        return $stmt->execute([$orcamentoId, $nomeItem, $valor]);
    }

    //Editar Orçamento
    public static function editarOrcamento($id, array $body){
        $pdo = self::connect();
        $stmt = $pdo->prepare("UPDATE orcamento
                                SET cliente_id = ?, servico_id = ?, detalhes = ?, tempo_estimado = ?, data_criacao = ?, status_orcamento = ?
                                WHERE id = ?");
        return $stmt->execute([
            $body['cliente_id'], 
            $body['servico_id'], 
            $body['detalhes'], 
            $body['tempo_estimado'], 
            $body['data_criacao'], 
            $body['status_orcamento'],
            $id
        ]);
    }

    //Deletar item
    public static function deleteItem($itemId){
        $pdo = self::connect();
        $stmt = $pdo->prepare("DELETE FROM orcamento_itens WHERE id = ?");
        return $stmt->execute([$itemId]);
    }

    //Obter id existente
    public static function getExistingItemIds($orcamentoId){
        $pdo = self::connect();
        $stmt = $pdo->prepare("SELECT id FROM orcamento_itens WHERE orcamento_id = ?");
        $stmt->execute([$orcamentoId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    //Insere ou edita um item do orçamento
    public static function upsertItem($orcamentoId, array $item){
        $pdo = self::connect();
        $itemId = $item['id'] ?? null;
        
        if ($itemId && is_numeric($itemId)) {
            // Atualizar
            $stmt = $pdo->prepare("UPDATE orcamento_itens SET nomeItem = ?, valor = ? WHERE id = ? AND orcamento_id = ?");
            return $stmt->execute([$item['nomeItem'], $item['valor'], $itemId, $orcamentoId]);
        } else {
            // Inserir (novo item)
            return self::criarItem($orcamentoId, $item['nomeItem'], $item['valor']);
        }
    }

    //Detelatar Orçamento
    public static function deletarOrcamento($id){
        $pdo = self::connect();
        try {
            $pdo->beginTransaction();

            // Deletar os itens do orçamento
            $stmtItens = $pdo->prepare("DELETE FROM orcamento_itens WHERE orcamento_id = ?");
            $stmtItens->execute([$id]);

            // Deletar orçamento
            $stmtOrcamento = $pdo->prepare("DELETE FROM orcamento WHERE id = ?");
            $stmtOrcamento->execute([$id]); // CORRIGIDO: Usando $stmtOrcamento
            
            $pdo->commit();
            return true;
        } catch (\Throwable $e) { // Usar \Throwable para capturar Exceptions e Errors
            $pdo->rollBack();
            return false;
        }
    }
}

?>