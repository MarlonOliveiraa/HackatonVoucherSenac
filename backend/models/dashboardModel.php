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

        // Soma geral do que já foi pago no financeiro.
        $sql = "SELECT COALESCE(SUM(valor_pago), 0) AS faturamento_total FROM financeiro";
        $fatTotal = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        // Contagem de orçamentos aprovados (tratados como serviços concluídos).
        $sql = "SELECT COUNT(*) AS servicos_concluidos 
                FROM orcamento 
                WHERE status_orcamento = 'aprovado'";
        $servicosConcluidos = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        // Busca o valor total de cada orçamento aprovado para uso no cálculo do ticket médio.
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
            // Média dos valores para definir o ticket médio.
            $ticketMedio = $soma / count($ticketMedioLista);
        }

        // Número total de clientes marcados como ativos.
        $sql = "SELECT COUNT(*) AS clientes_ativos 
                FROM cliente 
                WHERE status = 'ativo'";
        $clientesAtivos = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        // Identifica qual serviço gerou o maior faturamento.
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

        // Encontra o dia da semana com maior volume de pagamentos.
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

        // Quantidade total de serviços cadastrados.
        $sql = "SELECT COUNT(*) AS total_servicos FROM servico";
        $totalServicos = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        // Cálculo da previsão baseado na média do faturamento dos últimos três meses.
        $sql = "SELECT AVG(total_mensal) AS previsao
        FROM (
            SELECT SUM(valor_pago) AS total_mensal
            FROM financeiro
            WHERE data_pagamento >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
            GROUP BY MONTH(data_pagamento)
        ) AS t
        ";
        $previsao = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);

        return [
            "faturamento_total"      => $fatTotal['faturamento_total'],
            "servicos_concluidos"    => $servicosConcluidos['servicos_concluidos'],
            "ticket_medio"           => $ticketMedio,
            "clientes_ativos"        => $clientesAtivos['clientes_ativos'],
            "servico_mais_lucrativo" => $servicoMaisLucrativo,
            "dia_maior_faturamento"  => $diaMaiorFaturamento,
            "total_servicos"         => $totalServicos['total_servicos'],
            "previsaoFaturamento"    => $previsao['previsao'] ?? 0
        ];

    } catch (\Throwable $th) {
        return ["erro" => $th->getMessage()];
    }
}

}

?>
