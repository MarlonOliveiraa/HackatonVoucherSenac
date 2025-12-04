import { useState, useEffect, useCallback } from 'react';
import { Financeiro } from '@/types';

const API_BASE_URL = 'http://localhost/hackatonvouchersenac/backend/router/financeiroRouter.php';

export const useFinanceiro = () => {
  const [registros, setRegistros] = useState<Financeiro[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar registros do backend
  const fetchRegistros = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?acao=listar`);
      if (!response.ok) {
        throw new Error('Falha ao buscar registros financeiros.');
      }
      const fetchedRegistros: Financeiro[] = await response.json();
      // Converte id e servicoId para string
      const converted = fetchedRegistros.map(r => ({
        ...r,
        id: r.id.toString(),
        servicoId: r.servicoId.toString(),
        valorPago: r.valorPago || 0,
      }));
      setRegistros(converted);
    } catch (error) {
      console.error("Erro ao carregar registros financeiros:", error);
      setRegistros([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carrega os dados na montagem
  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]);

  // Adicionar registro
  const addRegistro = async (registro: Omit<Financeiro, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}?acao=criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro),
      });

      const result = await response.json();

      if (result.success) {
        await fetchRegistros(); // Recarrega os dados
        return result;
      } else {
        throw new Error(result.mensagem || "Falha ao criar registro.");
      }
    } catch (error) {
      console.error("Erro ao criar registro:", error);
      throw error;
    }
  };

  // Atualizar registro
  const updateRegistro = async (id: string, updates: Partial<Financeiro>) => {
    try {
      const response = await fetch(`${API_BASE_URL}?acao=atualizar&id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (result.success) {
        await fetchRegistros(); // Recarrega os dados
        return result;
      } else {
        throw new Error(result.mensagem || "Falha ao atualizar registro.");
      }
    } catch (error) {
      console.error("Erro ao atualizar registro:", error);
      throw error;
    }
  };

  // Deletar registro
  const deleteRegistro = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}?acao=deletar&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchRegistros(); // Recarrega os dados
      } else {
        throw new Error(result.mensagem || "Falha ao deletar registro.");
      }
    } catch (error) {
      console.error("Erro ao deletar registro:", error);
      throw error;
    }
  };

  // Calcular total recebido
  const getTotalRecebido = () => {
    return registros.reduce((acc, r) => acc + r.valorPago, 0);
  };

  return { registros, isLoading, addRegistro, updateRegistro, deleteRegistro, getTotalRecebido };
};
