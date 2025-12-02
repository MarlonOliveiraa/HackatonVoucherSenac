import { useState, useEffect } from 'react';
import { Financeiro } from '@/types';

const STORAGE_KEY = 'financeiro';

const mockFinanceiro: Financeiro[] = [
  {
    id: '1',
    servicoId: '1',
    dataPagamento: '2024-11-15',
    valorPago: 2500,
  },
  {
    id: '2',
    servicoId: '2',
    dataPagamento: '2024-11-20',
    valorPago: 1200,
  },
];

export const useFinanceiro = () => {
  const [registros, setRegistros] = useState<Financeiro[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRegistros(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFinanceiro));
      setRegistros(mockFinanceiro);
    }
  }, []);

  const saveRegistros = (newRegistros: Financeiro[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRegistros));
    setRegistros(newRegistros);
  };

  const addRegistro = (registro: Omit<Financeiro, 'id'>) => {
    const newRegistro: Financeiro = {
      ...registro,
      id: Date.now().toString(),
    };
    saveRegistros([...registros, newRegistro]);
  };

  const updateRegistro = (id: string, updates: Partial<Financeiro>) => {
    saveRegistros(registros.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRegistro = (id: string) => {
    saveRegistros(registros.filter(r => r.id !== id));
  };

  const getTotalRecebido = () => {
    return registros.reduce((acc, r) => acc + r.valorPago, 0);
  };

  return { registros, addRegistro, updateRegistro, deleteRegistro, getTotalRecebido };
};
