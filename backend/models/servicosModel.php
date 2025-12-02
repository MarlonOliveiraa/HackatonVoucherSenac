<?php

class Servico{
    private $conn;
    private $table = "servico";

    public $id;
    public $nome;
    public $descricao;	

    public function __construct($db){
        $this->conn = $db;
    }

    public function listar(){
        $query = "SELECT * FROM " . $this->table . " ORDER BY data DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function listar() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY data DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table . " 
        SET nome=:nome, descricao=:descricao";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":descricao", $this->descricao);

        return $stmt->execute();
    }

    public function editar($id){
        $query = "UPDATE " . $this->table . "
                  SET nome = :nome, descricao = :descricao
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":descricao", $this->descricao);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();
    }

    public function deletar($id){
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();
    }
}

?>