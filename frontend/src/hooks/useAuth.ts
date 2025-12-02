import { useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Mock authentication
    if (password === 'demo') {
      const mockUser = { email, name: email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, login, logout };
};
