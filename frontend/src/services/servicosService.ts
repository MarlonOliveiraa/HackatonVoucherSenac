// IMPORTA A URL BASE  DA API
import { API_URL } from "./api";

// EXPORTA A FUNÇÃO criarServico 
export async function criarServico(dados: {
  nome: string;
  descricao: string;
}) {
  // ENVIA UM POST
  const req = await fetch(`${API_URL}/servicosControllers.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  // RETORNA A RESPOSTA
  return await req.json();
}
