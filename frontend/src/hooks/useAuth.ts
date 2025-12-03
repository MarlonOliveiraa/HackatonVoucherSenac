import { useState, useEffect } from "react";
import { registerUser, loginUser } from "@/services/authService";

export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const register = async (nome: string, email: string, senha: string, confirmarSenha: string) => {
    const data = await registerUser({ nome, email, senha, confirmarSenha });
    return data;
  };

  const login = async (email: string, senha: string) => {
    const data = await loginUser(email, senha);

    if (data.status) { 
      localStorage.setItem("currentUser", JSON.stringify(data.dados));
      setUser(data.dados);
    }

    return data;
  };


  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return { user, loading, register, login, logout };
};
