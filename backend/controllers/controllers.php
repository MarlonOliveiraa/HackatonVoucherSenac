<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../models/models.php';

/**
 * Controlador para API de Financeiro
 * Gerencia as operações CRUD dos registros financeiros via API REST
 */
class FinanceiroController {
    private $modelo; 

    /**
     * Construtor da classe - inicializa o modelo
     */
    public function __construct() {
        $this->modelo = new FinanceiroModel();
    }

    /**
     * Processa a requisição HTTP e direciona para o método apropriado
     * Suporta os métodos GET, POST, PUT, DELETE e OPTIONS
     */
    public function processarRequisicao() {
        $metodo = $_SERVER['REQUEST_METHOD'];
        $caminho = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        if ($metodo === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $id = null;
        if (preg_match('/\/financeiro\/(\d+)/', $caminho, $matches)) {
            $id = $matches[1];
        }

        switch ($metodo) {
            case 'GET':
                if ($id) {
                    $this->obterPorId($id);
                } elseif (strpos($caminho, '/total') !== false) {
                    $this->obterTotal();
                } else {
                    $this->obterTodos();
                }
                break;
            case 'POST':
                $this->criar();
                break;
            case 'PUT':
                if ($id) {
                    $this->atualizar($id);
                } else {
                    $this->metodoNaoPermitido();
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->excluir($id);
                } else {
                    $this->metodoNaoPermitido();
                }
                break;
            default:
                $this->metodoNaoPermitido();
        }
    }

    /**
     * Método específico para obter o total recebido (usado pela API)
     * Endpoint: GET /api.php?endpoint=financeiro&action=total
     */
    public function processarRequisicaoTotal() {
        $this->obterTotal();
    }

    /**
     * Obtém todos os registros financeiros
     * Endpoint: GET /financeiro
     */
    private function obterTodos() {
        try {
            $registros = $this->modelo->obterTodos();
            echo json_encode(['success' => true, 'data' => $registros]);
        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    /**
     * Obtém um registro financeiro específico pelo ID
     * Endpoint: GET /financeiro/{id}
     */
    private function obterPorId($id) {
        try {
            $registro = $this->modelo->obterPorId($id);
            if ($registro) {
                echo json_encode(['success' => true, 'data' => $registro]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Registro não encontrado']);
            }
        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    /**
     * Calcula e retorna o total recebido de todos os pagamentos
     * Endpoint: GET /financeiro/total
     */
    private function obterTotal() {
        try {
            $total = $this->modelo->obterTotalRecebido();
            echo json_encode(['success' => true, 'total' => $total]);
        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    /**
     * Cria um novo registro financeiro
     * Endpoint: POST /financeiro
     */
    private function criar() {
        try {
            $entrada = json_decode(file_get_contents('php://input'), true);
            if (!$this->validarEntrada($entrada)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
                return;
            }

            $id = $this->modelo->criar($entrada);
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Registro criado com sucesso']);
        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    /**
     * Atualiza um registro financeiro existente
     * Endpoint: PUT /financeiro/{id}
     */
    private function atualizar($id) {
        try {
            $entrada = json_decode(file_get_contents('php://input'), true);
            if (!$this->validarEntrada($entrada)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
                return;
            }

            $linhasAfetadas = $this->modelo->atualizar($id, $entrada);
            if ($linhasAfetadas > 0) {
                echo json_encode(['success' => true, 'message' => 'Registro atualizado com sucesso']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Registro não encontrado']);
            }
        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    /**
     * Exclui um registro financeiro
     * Endpoint: DELETE /financeiro/{id}
     */
    private function excluir($id) {
        try {
            $linhasAfetadas = $this->modelo->excluir($id);
            if ($linhasAfetadas > 0) {
                echo json_encode(['success' => true, 'message' => 'Registro excluído com sucesso']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Registro não encontrado']);
            }
        } catch (Exception $e) {
            $this->respostaErro($e->getMessage());
        }
    }

    /**
     * Valida os dados de entrada para criação/atualização
     * @param array $entrada Dados recebidos da requisição
     * @return bool Verdadeiro se os dados são válidos
     */
    private function validarEntrada($entrada) {
        return isset($entrada['servicoId']) &&
               isset($entrada['valorPago']) &&
               is_numeric($entrada['valorPago']) &&
               $entrada['valorPago'] >= 0;
    }

    /**
     * Resposta para métodos HTTP não permitidos
     */
    private function metodoNaoPermitido() {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    }

    /**
     * Resposta padrão para erros internos do servidor
     * @param string $mensagem Mensagem de erro específica
     */
    private function respostaErro($mensagem) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro interno do servidor: ' . $mensagem]);
    }
}

if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    $controller = new FinanceiroController();
    $controller->handleRequest();
}