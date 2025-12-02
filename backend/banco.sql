-- ===========================
--   TABELA CLIENTE
-- ===========================
CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30),
    email VARCHAR(150),
    observacoes TEXT,
    status VARCHAR(30)
);

-- ===========================
--   TABELA SERVICO / TAREFA
-- ===========================
CREATE TABLE servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    valor DECIMAL(10,2),
    tempo_estimado VARCHAR(100),
    status VARCHAR(30),
    data DATE,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- ===========================
--   TABELA ORCAMENTO
-- ===========================
CREATE TABLE orcamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    total DECIMAL(10,2),
    data DATE,
    status VARCHAR(30),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- ===========================
--   TABELA ORCAMENTO_ITENS
-- ===========================
CREATE TABLE orcamento_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orcamento_id INT NOT NULL,
    servico_id INT NOT NULL,
    valor DECIMAL(10,2),
    FOREIGN KEY (orcamento_id) REFERENCES orcamento(id),
    FOREIGN KEY (servico_id) REFERENCES servico(id)
);

-- ===========================
--   TABELA FINANCEIRO
-- ===========================
CREATE TABLE financeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servico_id INT NOT NULL,
    data_pagamento DATE,
    valor_pago DECIMAL(10,2),
    FOREIGN KEY (servico_id) REFERENCES servico(id)
);
