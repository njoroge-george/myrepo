import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

export const ProtectedRoute = ({ children, allowedRoles = ["admin", "participant"] }) => {
    const { auth } = useContext(AuthContext); // ✅ make sure AuthContext provides { auth }
    const location = useLocation();

    if (!auth || !allowedRoles.includes(auth.role)) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};
