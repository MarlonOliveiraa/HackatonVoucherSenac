INSERT INTO cliente (nome, telefone, email, observacoes, status) VALUES
('João da Silva', '11987654321', 'joao@gmail.com', 'Cliente antigo, indicações frequentes.', 'ativo'),
('Maria Oliveira', '21999887766', 'maria.oliveira@yahoo.com', 'Prefere contato por WhatsApp.', 'ativo'),
('Carlos Pereira', '31988774455', 'carlos.pereira@outlook.com', 'Solicitou urgência no último serviço.', 'ativo'),
('Fernanda Costa', '11911223344', 'fernanda.costa@gmail.com', 'Cliente nova, serviço simples.', 'inativo');

INSERT INTO servico (nome, descricao) VALUES
('Instalação de Ar-Condicionado', 'Instalação completa de ar-condicionado split.'),
('Manutenção Elétrica', 'Revisão e reparo de fiação elétrica.'),
('Troca de Tomadas e Interruptores', 'Substituição completa de tomadas e interruptores.'),
('Instalação de Iluminação LED', 'Instalação de luminárias e fitas LED.');

INSERT INTO orcamento
(cliente_id, servico_id, detalhes, tempo_estimado, data_criacao, status)
VALUES
(1, 1, 'Instalação de ar-condicionado 12.000 BTUs no quarto.', '3 horas', '2025-01-12', 'aprovado'),
(2, 2, 'Revisão completa da parte elétrica, troca de disjuntores.', '2 dias', '2025-01-15', 'pendente'),
(3, 4, 'Instalação de iluminação LED na sala com fita decorativa.', '5 horas', '2025-01-10', 'aprovado'),
(1, 3, 'Troca de 8 tomadas e 3 interruptores queimados.', '4 horas', '2025-01-08', 'cancelado');

INSERT INTO orcamento_itens (orcamento_id, servico_id, valor) VALUES
(1, 1, 850.00), 
(1, 3, 120.00), 

(2, 2, 1500.00),
(2, 3, 300.00), 

(3, 4, 700.00), 

(4, 3, 400.00); 

INSERT INTO financeiro (servico_id, data_pagamento, valor_pago) VALUES
(1, '2025-01-13', 850.00),  
(4, '2025-01-11', 700.00),  
(3, '2025-01-05', 400.00);  