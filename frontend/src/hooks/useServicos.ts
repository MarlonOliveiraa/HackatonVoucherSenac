import { useState, useEffect } from 'react';
import { Servico } from '@/types';

const STORAGE_KEY = 'servicos';

const mockServicos: Servico[] = [
  {
    id: '1',
    clienteId: '1',
    nome: 'Consultoria de Marketing',
    valor: 2500,
    tempoEstimado: 8,
    status: 'concluido',
    data: '2024-11-10',
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    clienteId: '1',
    nome: 'Design de Logo',
    valor: 1200,
    tempoEstimado: 4,
    status: 'concluido',
    data: '2024-11-18',
    createdAt: '2024-11-15',
  },
  {
    id: '3',
    clienteId: '2',
    nome: 'Desenvolvimento Web',
    valor: 5000,
    tempoEstimado: 40,
    status: 'pendente',
    data: '2024-12-05',
    createdAt: '2024-11-20',
  },
];

export const useServicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setServicos(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockServicos));
      setServicos(mockServicos);
    }
  }, []);

  const saveServicos = (newServicos: Servico[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newServicos));
    setServicos(newServicos);
  };

  const addServico = (servico: Omit<Servico, 'id' | 'createdAt'>) => {
    const newServico: Servico = {
      ...servico,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveServicos([...servicos, newServico]);
  };

  const updateServico = (id: string, updates: Partial<Servico>) => {
    saveServicos(servicos.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteServico = (id: string) => {
    saveServicos(servicos.filter(s => s.id !== id));
  };

  return { servicos, addServico, updateServico, deleteServico };
};
