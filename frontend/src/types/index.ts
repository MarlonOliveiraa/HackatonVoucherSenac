export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  observacoes?: string;
  status: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao?: string;
}

export interface Orcamento {
  id: string;
  clienteId: string;
  servicoId: string;
  detalhes: string;
  tempoEstimado?: string;
  dataCriacao: string;
  status: 'pendente' | 'aprovado' | 'cancelado';
}

export interface OrcamentoItem {
  id: string;
  orcamentoId: string;
  nomeItem: string;
  valor: number;
}

export interface Financeiro {
  id: string;
  servicoId: string;
  dataPagamento?: string;
  valorPago: number;
}
