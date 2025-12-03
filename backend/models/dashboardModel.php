<?php
ob_clean();
require_once __DIR__ . "/../config/database.php";

class DashboardModel {

    private $conn;

    public function __construct() {
        $banco = new Database();
        $this->conn = $banco->Connect();

        if ($this->conn === null) {
            die("ERRO: Não foi possível conectar ao banco.");
        }
    }

    public function getDashboardData() {
    try {
        $sql = "SELECT COALESCE(SUM(valor_pago), 0) AS faturamento_total FROM financeiro";
        $fatTotal = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT COUNT(*) AS servicos_concluidos 
                FROM orcamento 
                WHERE status_orcamento = 'aprovado'";
        $servicosConcluidos = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        $sql = "
            SELECT 
                o.id AS orcamento_id,
                SUM(oi.valor) AS total_servico
            FROM orcamento o
            LEFT JOIN orcamento_itens oi ON oi.orcamento_id = o.id
            WHERE o.status_orcamento = 'aprovado'
            GROUP BY o.id
        ";
        $ticketMedioLista = $this->conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        $ticketMedio = 0;
        if (count($ticketMedioLista) > 0) {
            $soma = 0;
            foreach ($ticketMedioLista as $t) {
                $soma += floatval($t['total_servico']);
            }
            $ticketMedio = $soma / count($ticketMedioLista);
        }

        $sql = "SELECT COUNT(*) AS clientes_ativos 
                FROM cliente 
                WHERE status = 'ativo'";
        $clientesAtivos = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        $sql = "
            SELECT 
                s.id,
                s.nome,
                SUM(f.valor_pago) AS faturamento
            FROM servico s
            JOIN financeiro f ON f.servico_id = s.id
            GROUP BY s.id
            ORDER BY faturamento DESC
            LIMIT 1
        ";
        $servicoMaisLucrativo = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        $sql = "
            SELECT 
                DAYOFWEEK(data_pagamento) AS dia_semana, 
                SUM(valor_pago) AS total
            FROM financeiro
            GROUP BY dia_semana
            ORDER BY total DESC
            LIMIT 1
        ";
        $diaMaiorFaturamento = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        return [
            "faturamento_total"      => $fatTotal['faturamento_total'],
            "servicos_concluidos"    => $servicosConcluidos['servicos_concluidos'],
            "ticket_medio"           => $ticketMedio,
            "clientes_ativos"        => $clientesAtivos['clientes_ativos'],
            "servico_mais_lucrativo" => $servicoMaisLucrativo,
            "dia_maior_faturamento"  => $diaMaiorFaturamento
        ];

    } catch (\Throwable $th) {
        return ["erro" => $th->getMessage()];
    }
}

}

?>