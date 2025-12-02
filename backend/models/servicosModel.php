<?php

class Servico{
    private $conn;
    private $table = "servico";

    public $id;
    public $cliente_id;
    public $nome;
    public $valor;
    public $tempo_estimado;
    public $status;
    public $data;	

    public function __construct($db){
        $this->conn = $db;
    }

    public function listar(){
        $query = "SELECT * FROM " . $this->table . " ORDER BY data DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table . " 
        SET cliente_id=:cliente_id, nome=:nome, valor=:valor, tempo_estimado=:tempo_estimado, status=:status, data=:data";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":cliente_id", $this->clienteId);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":valor", $this->valor);
        $stmt->bindParam(":tempo_estimado", $this->tempoEstimado);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":data", $this->data);

        return $stmt->execute();
    }
}

?>