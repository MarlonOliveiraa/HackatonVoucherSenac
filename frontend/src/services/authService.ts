import { API_URL } from "./api";

export async function registerUser(dados: {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}) {
  const req = await fetch(`${API_URL}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  return await req.json();
}

export async function loginUser(email: string, senha: string) {
  const req = await fetch(`${API_URL}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  return await req.json();
}
