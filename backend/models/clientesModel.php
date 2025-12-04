<?php
public function __construct($conn) {
$this->conn = $conn;
}


// Lista todos os registros da tabela cliente
public function listar() {
$sql = "SELECT * FROM cliente";
return $this->conn->query($sql);
}


// Busca um cliente pelo ID
public function buscar($id)($id) {
$sql = "SELECT * FROM cliente WHERE id = $id";
return $this->conn->query($sql)->fetch_assoc();
}


// Cria um novo cliente usando os dados enviados
public function criar($dados)($dados) {
$nome = $dados['nome'];
$telefone = $dados['telefone'];
$email = $dados['email'];
$obs = $dados['observacoes'];
$status = $dados['status'];
$sql = "INSERT INTO cliente(nome, telefone, email, observacoes, status)
VALUES('$nome', '$telefone', '$email', '$obs', '$status')";
return $this->conn->query($sql);
}


// Atualiza um cliente existente pelo ID
public function atualizar($id, $dados)($id, $dados) {
$sql = "UPDATE cliente SET
nome='{$dados['nome']}',
telefone='{$dados['telefone']}',
email='{$dados['email']}',
observacoes='{$dados['observacoes']}',
status='{$dados['status']}'
WHERE id=$id";
return $this->conn->query($sql);
}


// Remove um cliente do banco pelo ID
public function deletar($id)($id) {
$sql = "DELETE FROM cliente WHERE id=$id";
return $this->conn->query($sql);
}

?>