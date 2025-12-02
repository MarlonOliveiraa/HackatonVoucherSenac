import { useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
}

interface StoredUser extends User {
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const getUsers = (): StoredUser[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const register = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Este email já está cadastrado' };
    }

    const newUser: StoredUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = { name, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    setUser(currentUser);
    
    return { success: true };
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const currentUser = { name: foundUser.name, email: foundUser.email };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setUser(currentUser);
      return { success: true };
    }
    
    // Fallback para demo
    if (password === 'demo') {
      const mockUser = { email, name: email.split('@')[0] };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    }
    
    return { success: false, error: 'Email ou senha incorretos' };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return { user, loading, login, logout, register };
};
