import { useEffect, useState } from 'react';
import { Financeiro } from '@/types';
import { toast } from 'sonner';

const API_URL = "http://localhost/hackatonvouchersenac/backend/router/financeiroRouter.php";

export const useFinanceiro = () => {
  const [registros, setRegistros] = useState<Financeiro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistros = async () => {
    try {
      const res = await fetch(`${API_URL}?acao=listar`);
      const data = await res.json();

      if (data.success) {
        setRegistros(data.data);
      } else {
        toast.error(data.message || "Erro ao carregar registros");
      }
    } catch (error) {
      toast.error("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  const addRegistro = async (registro: Omit<Financeiro, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}?acao=criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registro),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Registro criado!");
        fetchRegistros();
      } else {
        toast.error(data.message || "Erro ao criar registro");
      }
    } catch {
      toast.error("Erro ao conectar ao servidor");
    }
  };

  const updateRegistro = async (id: string, updates: Partial<Financeiro>) => {
    try {
      const res = await fetch(`${API_URL}?acao=atualizar&id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Registro atualizado!");
        fetchRegistros();
      } else {
        toast.error(data.message || "Erro ao atualizar registro");
      }
    } catch {
      toast.error("Erro ao conectar ao servidor");
    }
  };

  const deleteRegistro = async (id: string) => {
    if (!confirm("Tem certeza?")) return;

    try {
      const res = await fetch(`${API_URL}?acao=deletar&id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Registro excluído!");
        fetchRegistros();
      } else {
        toast.error(data.message || "Erro ao excluir registro");
      }
    } catch {
      toast.error("Erro ao conectar ao servidor");
    }
  };

  const getTotalRecebido = () =>
    registros.reduce((a, b) => a + Number(b.valorPago || 0), 0);

  return {
    registros,
    loading,
    addRegistro,
    updateRegistro,
    deleteRegistro,
    getTotalRecebido,
    fetchRegistros,
  };
};
