import { useState, useEffect } from 'react';
import { Cliente } from '@/types';

const API_BASE = 'http://localhost/hackatonvouchersenac/backend/router/clientesRouter.php';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [refresh, setRefresh] = useState(0);

  // Força atualização geral
  const forceRefresh = () => setRefresh(r => r + 1);

  // Carrega clientes sempre que refresh mudar
  useEffect(() => {
    fetchClientes();
  }, [refresh]);

  // Busca lista no backend
  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_BASE}?acao=listar`);
      const json = await res.json();
      setClientes(json.status === 'sucesso' ? json.data : []);
    } catch {
      setClientes([]);
    }
  };

  // Cria cliente
  const addCliente = async (cliente: Omit<Cliente, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}?acao=criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      const json = await res.json();

      if (json.status === 'sucesso') {
        forceRefresh(); // recarrega lista com ID real
      }
    } catch (e) {
      console.error("Erro ao criar cliente", e);
    }
  };

  // Atualiza cliente
  const updateCliente = async (id: string, updates: Partial<Cliente>) => {
    try {
      const res = await fetch(`${API_BASE}?acao=atualizar&id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const json = await res.json();

      if (json.status === 'sucesso') {
        forceRefresh();
      }
    } catch {
      console.error("Erro ao atualizar cliente");
    }
  };

  // Deleta cliente
  const deleteCliente = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}?acao=deletar&id=${id}`, {
        method: 'DELETE'
      });
      const json = await res.json();

      if (json.status === 'sucesso') {
        forceRefresh();
      } else {
        alert(json.mensagem || "Erro ao excluir.");
      }

    } catch (e) {
      alert("Erro ao excluir cliente.");
      console.error(e);
    }
  };

  return { clientes, addCliente, updateCliente, deleteCliente, refresh, forceRefresh };
};
