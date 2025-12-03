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
--   TABELA USUARIOS
-- ===========================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
--   TABELA SERVICO / TAREFA
-- ===========================
CREATE TABLE servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT
);

-- ===========================
--   TABELA ORCAMENTO
-- ===========================
CREATE TABLE orcamento (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cliente_id INT NOT NULL,
    servico_id INT NOT NULL,

    detalhes TEXT NOT NULL,          -- O que será feito detalhado
    tempo_estimado VARCHAR(100),     -- Tempo médio de execução
    data_criacao DATE NOT NULL,      -- Quando o orçamento foi criado

    status ENUM('pendente', 'aprovado', 'cancelado')
           DEFAULT 'pendente',

    FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    FOREIGN KEY (servico_id) REFERENCES servico(id)
);

-- ===========================
--   TABELA ORCAMENTO_ITENS
-- ===========================
CREATE TABLE orcamento_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orcamento_id INT NOT NULL,
    servico_id INT NOT   NULL,
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
