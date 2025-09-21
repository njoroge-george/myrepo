import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    id: null,
    role: null,
    name: null,
  });

  const isAuthenticated = !!auth.token;
  const isAdmin = auth.role === 'admin';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setAuth({
        token,
        id: payload.id || null,
        role: payload.role || null,
        name: payload.name || null,
      });

      localStorage.setItem('userId', payload.id || '');
      console.log('✅ Decoded token payload:', payload);
    } catch (err) {
      console.error('❌ Invalid token:', err);
      localStorage.removeItem('token');
    }
  }, []);

  const setRole = (newRole) => {
    setAuth((prev) => ({ ...prev, role: newRole }));
  };

  const logout = () => {
    setAuth({ token: null, id: null, role: null, name: null });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, setRole, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
