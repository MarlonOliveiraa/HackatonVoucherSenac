export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  observacoes?: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

export interface Servico {
  id: string;
  clienteId: string;
  nome: string;
  valor: number;
  tempoEstimado: number; // em horas
  status: 'pendente' | 'concluido' | 'cancelado';
  data: string;
  createdAt: string;
}

export interface Orcamento {
  id: string;
  clienteId: string;
  total: number;
  data: string;
  status: 'aprovado' | 'pendente' | 'rejeitado';
  createdAt: string;
}

export interface OrcamentoItem {
  id: string;
  orcamentoId: string;
  servicoId: string;
  valor: number;
}

export interface TimelineItem {
  id: string;
  tipo: 'servico' | 'orcamento';
  data: string;
  titulo: string;
  valor: number;
  status: string;
}
