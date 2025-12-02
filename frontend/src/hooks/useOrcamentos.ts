import { useState, useEffect } from 'react';
import { Orcamento, OrcamentoItem } from '@/types';

const STORAGE_KEY = 'orcamentos';
const ITEMS_KEY = 'orcamento_items';

const mockOrcamentos: Orcamento[] = [
  {
    id: '1',
    clienteId: '1',
    total: 3700,
    data: '2024-11-05',
    status: 'aprovado',
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    clienteId: '2',
    total: 5000,
    data: '2024-11-25',
    status: 'pendente',
    createdAt: '2024-11-20',
  },
];

const mockItems: OrcamentoItem[] = [
  { id: '1', orcamentoId: '1', servicoId: '1', valor: 2500 },
  { id: '2', orcamentoId: '1', servicoId: '2', valor: 1200 },
  { id: '3', orcamentoId: '2', servicoId: '3', valor: 5000 },
];

export const useOrcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [items, setItems] = useState<OrcamentoItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedItems = localStorage.getItem(ITEMS_KEY);
    
    if (stored) {
      setOrcamentos(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrcamentos));
      setOrcamentos(mockOrcamentos);
    }

    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      localStorage.setItem(ITEMS_KEY, JSON.stringify(mockItems));
      setItems(mockItems);
    }
  }, []);

  const saveOrcamentos = (newOrcamentos: Orcamento[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrcamentos));
    setOrcamentos(newOrcamentos);
  };

  const saveItems = (newItems: OrcamentoItem[]) => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(newItems));
    setItems(newItems);
  };

  const addOrcamento = (orcamento: Omit<Orcamento, 'id' | 'createdAt'>, selectedItems: OrcamentoItem[]) => {
    const newOrcamento: Orcamento = {
      ...orcamento,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    const newItems = selectedItems.map(item => ({
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      orcamentoId: newOrcamento.id,
    }));

    saveOrcamentos([...orcamentos, newOrcamento]);
    saveItems([...items, ...newItems]);
  };

  const updateOrcamento = (id: string, updates: Partial<Orcamento>) => {
    saveOrcamentos(orcamentos.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOrcamento = (id: string) => {
    saveOrcamentos(orcamentos.filter(o => o.id !== id));
    saveItems(items.filter(i => i.orcamentoId !== id));
  };

  const getOrcamentoItems = (orcamentoId: string) => {
    return items.filter(i => i.orcamentoId === orcamentoId);
  };

  return { orcamentos, addOrcamento, updateOrcamento, deleteOrcamento, getOrcamentoItems };
};
