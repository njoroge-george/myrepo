// src/api/accountAPI.jsx
import apiClient from "./apiClient"; // your base Axios instance

// Register
export const registerAccount = async ({ accountNumber, name, pin }) => {
    const res = await apiClient.post("/register", { accountNumber, name, pin });
    return res.data;
};

// Login
export const loginAccount = async ({ accountNumber, pin }) => {
    const res = await apiClient.post("/login", { accountNumber, pin });
    return res.data;
};

// Get balance
export const getBalance = async (token) => {
    const res = await apiClient.get("/balance", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Deposit
export const depositMoney = async ({ amount }, token) => {
    const res = await apiClient.post("/deposit", { amount }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Withdraw
export const withdrawMoney = async ({ amount }, token) => {
    const res = await apiClient.post("/withdraw", { amount }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};