import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const URL = "http://localhost/HackatonVoucherSenac/backend/controllers/servicosControllers.php";

export const useServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================
  // GET - LISTAR
  // =====================================
  const fetchServicos = async () => {
    try {
      setLoading(true);

      const res = await fetch(URL);
      const json = await res.json();

      if (!json.status) {
        toast({
          title: "Erro ao carregar",
          description: json.mensagem,
        });
        return;
      }

      setServicos(json.dados || []);

    } catch (err) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os serviços.",
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // POST - CRIAR
  // =====================================
  const addServico = async (dados) => {
    try {
      setLoading(true);

      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const json = await res.json();

      toast({
        title: json.status ? "Sucesso" : "Erro",
        description: json.mensagem,
      });

      if (json.status) fetchServicos();

    } catch (err) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível criar o serviço.",
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // PUT - EDITAR
  // =====================================
  const updateServico = async (id, dados) => {
    try {
      setLoading(true);

      const res = await fetch(`${URL}?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const json = await res.json();

      toast({
        title: json.status ? "Atualizado" : "Erro",
        description: json.mensagem,
      });

      if (json.status) fetchServicos();

    } catch (err) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível atualizar o serviço.",
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE
  // =====================================
  const deleteServico = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(`${URL}?id=${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      toast({
        title: json.status ? "Deletado" : "Erro",
        description: json.mensagem,
      });

      if (json.status) fetchServicos();

    } catch (err) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível deletar o serviço.",
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  return {
    servicos,
    loading,
    addServico,
    updateServico,
    deleteServico,
    fetchServicos,
  };
};
