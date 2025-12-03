<?php
require_once __DIR__ . '/../config/database.php';

/**
 * Classe Modelo para operações com a tabela financeiro
 * Gerencia registros de pagamentos relacionados aos serviços
 */
class FinanceiroModel {
    private $conn; // Conexão com o banco de dados

    /**
     * Construtor da classe - estabelece conexão com o banco
     */
    public function __construct() {
        $db = new Database();
        $this->conn = $db->Connect();
    }

    /**
     * Obtém todos os registros financeiros ordenados por data de pagamento (mais recente primeiro)
     * @return array Lista de todos os registros financeiros
     */
    public function obterTodos() {
        $query = "SELECT * FROM financeiro ORDER BY data_pagamento DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Obtém um registro financeiro específico pelo ID
     * @param int $id ID do registro financeiro
     * @return array|bool Dados do registro ou false se não encontrado
     */
    public function obterPorId($id) {
        $query = "SELECT * FROM financeiro WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Cria um novo registro financeiro no banco de dados
     * @param array $dados Dados do novo registro (servicoId, dataPagamento, valorPago)
     * @return int ID do registro recém-criado
     */
    public function criar($dados) {
        $query = "INSERT INTO financeiro (servico_id, data_pagamento, valor_pago) VALUES (:servico_id, :data_pagamento, :valor_pago)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':servico_id', $dados['servicoId']);
        $stmt->bindParam(':data_pagamento', $dados['dataPagamento']);
        $stmt->bindParam(':valor_pago', $dados['valorPago']);
        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    /**
     * Atualiza um registro financeiro existente
     * @param int $id ID do registro a ser atualizado
     * @param array $dados Novos dados do registro
     * @return int Número de linhas afetadas (1 se sucesso, 0 se não encontrado)
     */
    public function atualizar($id, $dados) {
        $query = "UPDATE financeiro SET servico_id = :servico_id, data_pagamento = :data_pagamento, valor_pago = :valor_pago WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':servico_id', $dados['servicoId']);
        $stmt->bindParam(':data_pagamento', $dados['dataPagamento']);
        $stmt->bindParam(':valor_pago', $dados['valorPago']);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->rowCount();
    }

    /**
     * Exclui um registro financeiro do banco de dados
     * @param int $id ID do registro a ser excluído
     * @return int Número de linhas afetadas (1 se sucesso, 0 se não encontrado)
     */
    public function excluir($id) {
        $query = "DELETE FROM financeiro WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->rowCount();
    }

    /**
     * Calcula o total recebido de todos os pagamentos
     * @return float Valor total de pagamentos recebidos
     */
    public function obterTotalRecebido() {
        $query = "SELECT SUM(valor_pago) as total FROM financeiro";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result['total'] ?? 0;
    }
}