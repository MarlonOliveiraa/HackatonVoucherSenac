import { useState, useEffect } from 'react';
import { Cliente } from '@/types';

const STORAGE_KEY = 'clientes';

const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva',
    telefone: '(11) 98765-4321',
    email: 'joao@email.com',
    observacoes: 'Cliente preferencial',
    status: 'ativo',
    createdAt: '2024-11-15',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    telefone: '(11) 91234-5678',
    email: 'maria@email.com',
    status: 'ativo',
    createdAt: '2024-11-20',
  },
];

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setClientes(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockClientes));
      setClientes(mockClientes);
    }
  }, []);

  const saveClientes = (newClientes: Cliente[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClientes));
    setClientes(newClientes);
  };

  const addCliente = (cliente: Omit<Cliente, 'id' | 'createdAt'>) => {
    const newCliente: Cliente = {
      ...cliente,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveClientes([...clientes, newCliente]);
  };

  const updateCliente = (id: string, updates: Partial<Cliente>) => {
    saveClientes(clientes.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCliente = (id: string) => {
    saveClientes(clientes.filter(c => c.id !== id));
  };

  return { clientes, addCliente, updateCliente, deleteCliente };
};
