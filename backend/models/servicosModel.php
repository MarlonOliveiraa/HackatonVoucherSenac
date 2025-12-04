<?php
require_once __DIR__ . "/../config/database.php";

class Servico {

    private static $table = "servico";
    private static $pdo;

    // INICIALIZA CONEXÃO
    private static function connect()
    {
        if (!self::$pdo) {
            $db = new Database();
            self::$pdo = $db->Connect();
        }
        return self::$pdo;
    }

    // LISTAR TODOS
    public static function getAll() {

        $pdo = self::connect();

        $stmt = $pdo->prepare("SELECT * FROM " . self::$table);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // CRIAR SERVIÇO
    public static function create($nome, $descricao) {

        $pdo = self::connect();

        $stmt = $pdo->prepare("
            INSERT INTO " . self::$table . " 
            (nome, descricao) 
            VALUES (?, ?)
        ");

        return $stmt->execute([$nome, $descricao]);
    }

    // EDITAR SERVIÇO
    public static function update($id, $nome, $descricao) {

        $pdo = self::connect();

        $stmt = $pdo->prepare("
            UPDATE " . self::$table . "
            SET nome = ?, descricao = ?
            WHERE id = ?
        ");

        return $stmt->execute([$nome, $descricao, $id]);
    }

    // DELETAR SERVIÇO
    public static function delete($id) {

        $pdo = self::connect();

        $stmt = $pdo->prepare("
            DELETE FROM " . self::$table . "
            WHERE id = ?
        ");

        return $stmt->execute([$id]);
    }
}
