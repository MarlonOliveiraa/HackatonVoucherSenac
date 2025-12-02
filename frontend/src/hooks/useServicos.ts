import { useState, useEffect } from 'react';
import { Servico } from '@/types';

const STORAGE_KEY = 'servicos';

const mockServicos: Servico[] = [
  {
    id: '1',
    nome: 'Consultoria de Marketing',
    descricao: 'Análise completa de estratégia de marketing digital',
  },
  {
    id: '2',
    nome: 'Design de Logo',
    descricao: 'Criação de identidade visual completa',
  },
  {
    id: '3',
    nome: 'Desenvolvimento Web',
    descricao: 'Desenvolvimento de sites e aplicações web',
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

  const addServico = (servico: Omit<Servico, 'id'>) => {
    const newServico: Servico = {
      ...servico,
      id: Date.now().toString(),
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
