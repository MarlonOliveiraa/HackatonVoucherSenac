import { useEffect, useState } from "react";

const URL = "http://localhost/HackatonVoucherSenac/controllers/servicosControllers.php";

export const useServicos = () => {
  const [servicos, setServicos] = useState([]);

  // GET
  const fetchServicos = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    setServicos(data);
  };

  // POST (criar)
  const addServico = async (dados) => {
    await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    fetchServicos();
  };

  // PUT (editar)
  const updateServico = async (id, dados) => {
    await fetch(`${URL}?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    fetchServicos();
  };

  // DELETE
  const deleteServico = async (id) => {
    await fetch(`${URL}?id=${id}`, {
      method: "DELETE",
    });
    fetchServicos();
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  return {
    servicos,
    addServico,
    updateServico,
    deleteServico,
  };
};
