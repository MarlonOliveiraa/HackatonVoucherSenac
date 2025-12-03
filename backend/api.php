<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/controllers/controllers.php';

/**
 * Classe principal da API
 * Gerencia o roteamento das requisições para diferentes endpoints
 */
class ApiPrincipal {
    private $controladorFinanceiro; // Instância do controlador financeiro

    /**
     * Construtor da classe API
     * Inicializa os controladores necessários
     */
    public function __construct() {
        $this->controladorFinanceiro = new FinanceiroController();
    }

    /**
     * Processa a requisição recebida e direciona para o endpoint apropriado
     * Baseado nos parâmetros GET da URL
     */
    public function processarRequisicao() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $endpoint = $_GET['endpoint'] ?? '';
        $acao = $_GET['action'] ?? '';
        $id = $_GET['id'] ?? null;

        switch ($endpoint) {
            case 'financeiro':
                $this->rotearFinanceiro($acao, $id);
                break;
            default:
                $this->respostaErroEndpointNaoEncontrado();
        }
    }

    /**
     * Roteia as requisições do módulo financeiro
     * @param string $acao Ação específica (ex: 'total')
     * @param int|null $id ID do registro (para operações individuais)
     */
    private function rotearFinanceiro($acao, $id = null) {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                if ($acao === 'total') {
                    // Endpoint: GET /api.php?endpoint=financeiro&action=total
                    $this->controladorFinanceiro->processarRequisicaoTotal();
                } elseif ($id) {
                    // Endpoint: GET /api.php?endpoint=financeiro&id={id}
                    $this->controladorFinanceiro->obterPorId($id);
                } else {
                    // Endpoint: GET /api.php?endpoint=financeiro
                    $this->controladorFinanceiro->obterTodos();
                }
                break;

            case 'POST':
                // Endpoint: POST /api.php?endpoint=financeiro
                $this->controladorFinanceiro->criar();
                break;

            case 'PUT':
                if ($id) {
                    // Endpoint: PUT /api.php?endpoint=financeiro&id={id}
                    $this->controladorFinanceiro->atualizar($id);
                } else {
                    $this->respostaMetodoNaoPermitido();
                }
                break;

            case 'DELETE':
                if ($id) {
                    // Endpoint: DELETE /api.php?endpoint=financeiro&id={id}
                    $this->controladorFinanceiro->excluir($id);
                } else {
                    $this->respostaMetodoNaoPermitido();
                }
                break;

            default:
                $this->respostaMetodoNaoPermitido();
        }
    }

    /**
     * Resposta para endpoint não encontrado
     */
    private function respostaErroEndpointNaoEncontrado() {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint não encontrado. Endpoints disponíveis: financeiro'
        ]);
    }

    /**
     * Resposta para método HTTP não permitido
     */
    private function respostaMetodoNaoPermitido() {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Método HTTP não permitido para este endpoint'
        ]);
    }
}

if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    $api = new ApiPrincipal();
    $api->processarRequisicao();
}