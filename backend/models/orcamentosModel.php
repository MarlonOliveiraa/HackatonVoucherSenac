<?php

require_once __DIR__ . "/../config/database.php";

class OrcamentoModel{

    private static $table = "orcamento";
    private static $pdo;

    //Conectando ao banco
    protected static function connect(){
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

        $valorFloat = is_numeric($valor) ? floatval($valor) : 0;  //valor é float
        $orcamentoIdInt = intval($orcamentoId);  //id é int
        
        $stmt = $pdo->prepare("INSERT INTO orcamento_itens (orcamento_id, nomeItem, valor)
                               VALUES ( ?, ?, ?)");
        return $stmt->execute([$orcamentoIdInt, $nomeItem, $valorFloat]);
    }

    //Editar Orçamento
    public static function editarOrcamento($id, array $body){
        $pdo = self::connect();

        if (empty($body)) {
            return false; // Nada para atualizar
        }

        $setClauses = [];
        $params = [];

        //Mapeamento inverso para garantir que o nome no db seja utilizado
        $columnMap = [
            'cliente_id' => 'cliente_id',
            'servico_id' => 'servico_id',
            'detalhes' => 'detalhes',
            'tempo_estimado' => 'tempo_estimado',
            'data_criacao' => 'data_criacao',
            'status_orcamento' => 'status_orcamento',
        ];

        foreach ($body as $key => $value) {
            if (isset($columnMap[$key])) {
                $columnName = $columnMap[$key];
                $setClauses[] = "{$columnName} = ?";
                $params[] = $value;
            }
        }

        $params[] = $id; 
        $stmt = $pdo->prepare("UPDATE orcamento SET " . implode(', ', $setClauses) . " WHERE id = ?");
        
        return $stmt->execute($params);

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

    // Sincroniza (adiciona, edita, deleta) os itens em uma transação segura
    public static function sincronizarItens($orcamentoId, array $novosItens){
        $pdo = self::connect(); // Agora funciona, pois é chamado de dentro da Model
        
        try {
            $pdo->beginTransaction();

            // Obter e comparar IDs
            $idsExistentes = self::getExistingItemIds($orcamentoId);
            $novosIds = array_filter(array_map(function($item) {
                return (isset($item['id']) && is_numeric($item['id'])) ? (int)$item['id'] : null;
            }, $novosItens));
            $idsParaDeletar = array_diff($idsExistentes, $novosIds);
            
            // Deletar itens removidos
            foreach ($idsParaDeletar as $itemId) {
                self::deleteItem($itemId);
            }
            
            // Inserir ou atualizar itens
            foreach ($novosItens as $item) {
                self::upsertItem($orcamentoId, $item);
            }
            
            $pdo->commit();
            return ["success" => true];
        } catch (\Throwable $e) {
            $pdo->rollBack();
            // Retorna a mensagem de erro detalhada para o Controller
            return ["success" => false, "mensagem" => $e->getMessage()]; 
        }
    }

    //Insere ou edita um item do orçamento
    public static function upsertItem($orcamentoId, array $item){
        $pdo = self::connect();
        $itemId = $item['id'] ?? null;
        $orcamentoIdInt = intval($orcamentoId);
        
        if ($itemId && is_numeric($itemId)) {
            $itemIdInt = intval($itemId);
            $valorFloat = $item['valor'];

            // Atualizar
            $stmt = $pdo->prepare("UPDATE orcamento_itens SET nomeItem = ?, valor = ? WHERE id = ? AND orcamento_id = ?");
            return $stmt->execute([$item['nomeItem'], $valorFloat, $itemIdInt, $orcamentoIdInt]);
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