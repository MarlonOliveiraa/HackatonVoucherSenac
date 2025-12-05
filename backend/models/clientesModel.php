<?php
class ClientesModel {
	private $pdo;

	public function __construct($pdo) {
		// Guarda a conexão
		$this->pdo = $pdo;
	}

	public function listar() {
		// Lista todos os clientes
		$stmt = $this->pdo->prepare("SELECT id, nome, telefone, email, observacoes, status FROM cliente ORDER BY nome");
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function buscar($id) {
		// Busca cliente pelo ID
		$stmt = $this->pdo->prepare("SELECT id, nome, telefone, email, observacoes, status FROM cliente WHERE id = ?");
		$stmt->execute([$id]);
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function criar($dados) {
		// Insere novo cliente
		$stmt = $this->pdo->prepare("INSERT INTO cliente (nome, telefone, email, observacoes, status) VALUES (?, ?, ?, ?, ?)");
		$nome = $dados['nome'] ?? '';
		$telefone = $dados['telefone'] ?? null;
		$email = $dados['email'] ?? null;
		$observacoes = $dados['observacoes'] ?? null;
		$status = $dados['status'] ?? 'ativo';

		$ok = $stmt->execute([$nome, $telefone, $email, $observacoes, $status]);
		return $ok ? $this->pdo->lastInsertId() : false;
	}

	public function atualizar($id, $dados) {
		// Monta atualização dinâmica
		$fields = [];
		$params = [];
		$map = ['nome','telefone','email','observacoes','status'];

		foreach ($map as $col) {
			if (isset($dados[$col])) {
				$fields[] = "$col = ?";
				$params[] = $dados[$col];
			}
		}

		if (empty($fields)) return false;

		$params[] = $id;
		$sql = "UPDATE cliente SET " . implode(', ', $fields) . " WHERE id = ?";
		$stmt = $this->pdo->prepare($sql);

		return $stmt->execute($params);
	}

	public function deletar($id) {
		// Exclui cliente
		$stmt = $this->pdo->prepare("DELETE FROM cliente WHERE id = ?");
		try {
			$ok = $stmt->execute([$id]);
			return $ok;
		} catch (PDOException $e) {
			// Registra erro e retorna mensagem tratada
			error_log('Erro ao deletar cliente ID ' . $id . ': ' . $e->getMessage());

			// Erro de chave estrangeira (cliente possui orçamentos)
			if ($e->getCode() === '23000') {
				return [
					'success' => false,
					'mensagem' => 'Não é possível excluir este cliente: existem registros vinculados (ex.: orçamentos).'
				];
			}

			return ['success' => false, 'mensagem' => $e->getMessage()];
		}
	}
}
?>
    