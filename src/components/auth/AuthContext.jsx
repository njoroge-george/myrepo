import { createContext, useState, useEffect, useContext } from "react";
import { getProfile, logoutUser } from "../../api/auth.jsx";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    id: null,
    role: null,
    name: null,
  });

  const isAuthenticated = !!auth.token;
  const isAdmin = auth.role === "admin";

  const logout = () => {
    setAuth({ token: null, id: null, role: null, name: null });
    logoutUser(); // clears localStorage
  };

  useEffect(() => {
    if (!auth.token) return;

    const fetchUser = async () => {
      try {
        const res = await getProfile(); // backend verifies token
        const user = res.data?.user;

        if (user) {
          setAuth((prev) => ({
            ...prev,
            id: user.id,
            role: user.role,
            name: user.name || "",
          }));
        }
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
        logout();
      }
    };

    fetchUser();
  }, [auth.token]);

  const setRole = (newRole) => {
    setAuth((prev) => ({ ...prev, role: newRole }));
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, setRole, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
