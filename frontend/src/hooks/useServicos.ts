import { useEffect, useState } from "react";
import { Servico } from "@/types";

const API_URL = "http://localhost/hackatonvouchersenac/backend/controllers/servicosControllers.php";

export const useServicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  // GET – listar
  const fetchServicos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setServicos(data);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    } finally {
      setLoading(false);
    }
  };

  // POST – criar
  const addServico = async (servico: Omit<Servico, "id">) => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(servico),
    });
    fetchServicos();
  };

  // PUT – editar
  const updateServico = async (id: string, updates: Partial<Servico>) => {
    await fetch(`${API_URL}?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id,
        ...updates,
      }),
    });
    fetchServicos();
  };

  // DELETE – apagar
  const deleteServico = async (id: string) => {
    await fetch(`${API_URL}?id=${id}`, {
      method: "DELETE",
    });
    fetchServicos();
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  return { servicos, loading, addServico, updateServico, deleteServico };
};
