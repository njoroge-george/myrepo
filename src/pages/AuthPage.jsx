// src/pages/AuthPage.jsx
import { useState } from "react";
import Login from "../components/auth/Login.jsx";
import Register from "../components/auth/Register.jsx";

export default function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {isLogin ? (
                <Login
                    onSwitch={() => setIsLogin(false)}
                    onLogin={onLogin}
                />
            ) : (
                <Register
                    onSwitch={() => setIsLogin(true)}
                />
            )}
        </div>
    );
}
