<?php

require_once __DIR__ . "/../config/database.php";

class FinanceiroModel{

    private static $table = "financeiro";
    private static $pdo;

    //Conectando ao banco
    protected static function connect(){
        if (!self::$pdo){
            $db = new Database();
            self::$pdo = $db->Connect();
        }
        return self::$pdo;
    }

    //Listar todos os registros financeiros
    public static function getAll(){
        $pdo = self::connect();
        $stmt = $pdo->prepare("
            SELECT
                id,
                servico_id AS servicoId,
                data_pagamento AS dataPagamento,
                valor_pago AS valorPago
            FROM financeiro
        ");
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //Criar registro financeiro
    public static function criarRegistro(array $data){
        $pdo = self::connect();

        $stmt = $pdo->prepare("INSERT INTO financeiro
                                (servico_id, data_pagamento, valor_pago)
                                VALUES (?, ?, ?)");

        $stmt->execute([
            $data['servico_id'],
            $data['data_pagamento'] ?? null,
            $data['valor_pago'] ?? null
        ]);

        return $pdo->lastInsertId();
    }

    //Editar registro financeiro
    public static function editarRegistro($id, array $data){
        $pdo = self::connect();

        if (empty($data)) {
            return false; // Nada para atualizar
        }

        $setClauses = [];
        $params = [];

        //Mapeamento para garantir que o nome no db seja utilizado
        $columnMap = [
            'servico_id' => 'servico_id',
            'data_pagamento' => 'data_pagamento',
            'valor_pago' => 'valor_pago',
        ];

        foreach ($data as $key => $value) {
            if (isset($columnMap[$key])) {
                $columnName = $columnMap[$key];
                $setClauses[] = "{$columnName} = ?";
                $params[] = $value;
            }
        }

        $params[] = $id;
        $stmt = $pdo->prepare("UPDATE financeiro SET " . implode(', ', $setClauses) . " WHERE id = ?");

        return $stmt->execute($params);
    }

    //Deletar registro financeiro
    public static function deletarRegistro($id){
        $pdo = self::connect();
        $stmt = $pdo->prepare("DELETE FROM financeiro WHERE id = ?");
        return $stmt->execute([$id]);
    }

    //Buscar registro por ID
    public static function getById($id){
        $pdo = self::connect();
        $stmt = $pdo->prepare("
            SELECT
                id,
                servico_id AS servicoId,
                data_pagamento AS dataPagamento,
                valor_pago AS valorPago
            FROM financeiro
            WHERE id = ?
        ");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

?>