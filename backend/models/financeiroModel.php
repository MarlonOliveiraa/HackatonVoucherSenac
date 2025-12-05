<?php
require_once __DIR__ . '/../config/database.php';

class FinanceiroModel {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->Connect();
    }

    public function obterTodos() {
        $query = "SELECT * FROM financeiro ORDER BY data_pagamento DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function obterPorId($id) {
        $query = "SELECT * FROM financeiro WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function criar($dados) {
        $query = "INSERT INTO financeiro (servico_id, data_pagamento, valor_pago)
                  VALUES (:servico_id, :data_pagamento, :valor_pago)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':servico_id', $dados['servicoId']);
        $stmt->bindParam(':data_pagamento', $dados['dataPagamento']);
        $stmt->bindParam(':valor_pago', $dados['valorPago']);

        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    public function atualizar($id, $dados) {
        $query = "UPDATE financeiro
                  SET servico_id = :servico_id,
                      data_pagamento = :data_pagamento,
                      valor_pago = :valor_pago
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':servico_id', $dados['servicoId']);
        $stmt->bindParam(':data_pagamento', $dados['dataPagamento']);
        $stmt->bindParam(':valor_pago', $dados['valorPago']);
        $stmt->bindParam(':id', $id);

        $stmt->execute();
        return $stmt->rowCount();
    }

    public function excluir($id) {
        $query = "DELETE FROM financeiro WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function obterTotalRecebido() {
        $query = "SELECT SUM(valor_pago) AS total FROM financeiro";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result['total'] ?? 0;
    }
}
