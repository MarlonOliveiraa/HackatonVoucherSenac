<?php
require_once __DIR__ . "/../models/clientesModel.php";

class ClientesController {
	private $model;

	public function __construct($pdo) {
		$this->model = new ClientesModel($pdo);
	}

	public function index() {
		$lista = $this->model->listar();
		return ['status' => 'sucesso', 'data' => $lista];
	}

	public function show($id) {
		if (!$id) return ['status' => 'erro', 'mensagem' => 'ID não fornecido'];
		$cliente = $this->model->buscar($id);
		if (!$cliente) return ['status' => 'erro', 'mensagem' => 'Cliente não encontrado'];
		return ['status' => 'sucesso', 'data' => $cliente];
	}

	public function store($dados) {
		if (empty($dados['nome'])) return ['status' => 'erro', 'mensagem' => 'Nome é obrigatório'];
		$id = $this->model->criar($dados);
		if ($id) return ['status' => 'sucesso', 'id' => $id];
		return ['status' => 'erro', 'mensagem' => 'Erro ao criar cliente'];
	}

	public function update($id, $dados) {
		if (!$id) return ['status' => 'erro', 'mensagem' => 'ID não fornecido'];
		$ok = $this->model->atualizar($id, $dados);
		return $ok ? ['status' => 'sucesso'] : ['status' => 'erro', 'mensagem' => 'Erro ao atualizar'];
	}

	public function destroy($id) {
		if (!$id) return ['status' => 'erro', 'mensagem' => 'ID não fornecido'];
		$ok = $this->model->deletar($id);
		return $ok ? ['status' => 'sucesso'] : ['status' => 'erro', 'mensagem' => 'Erro ao deletar'];
	}
}

?>