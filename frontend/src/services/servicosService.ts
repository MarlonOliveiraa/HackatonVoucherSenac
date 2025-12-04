import { API_URL } from "./api";

export async function criarServico(dados: {
  nome: string;
  descricao: string;
}) {
  const req = await fetch(`${API_URL}/servicosControllers.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  return await req.json();
}
