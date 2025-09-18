// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    setAuth({
      token,
      role: payload.role,
      id: payload.id, // ✅ Add this line
    name: payload.name, // optional, if available
    });
    localStorage.setItem("userId", payload.id); // ✅ Set for legacy access
  }
}, []);


    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
