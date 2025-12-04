<?php
// Controller recebe requisições e chama o Model
class ClienteController {
private $model;


public function __construct($conn) {
$this->model = new Cliente($conn);
}


// Retorna todos os clientes em formato JSON
public function index() {
$clientes = $this->model->listar();
while ($c = $clientes->fetch_assoc()) {
echo json_encode($c);
}
}


// Retorna um cliente específico
public function show($id)($id) {
echo json_encode($this->model->buscar($id));
}


// Cria um novo cliente
public function store() {
$dados = $_POST;
$this->model->criar($dados);
echo json_encode(["mensagem" => "Criado com sucesso"]);
}


// Atualiza um cliente
public function update($id)($id) {
$dados = $_POST;
$this->model->atualizar($id, $dados);
echo json_encode(["mensagem" => "Atualizado com sucesso"]);
}


// Deleta um cliente
public function destroy($id)($id) {
$this->model->deletar($id);
echo json_encode(["mensagem" => "Excluído com sucesso"]);
}
}
?>