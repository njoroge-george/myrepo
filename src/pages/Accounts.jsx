// src/pages/Accounts.jsx
import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Alert,
} from '@mui/material';

import {
    registerAccount,
    loginAccount,
    getBalance,
    depositMoney,
    withdrawMoney,
} from '../api/accountAPI';

const Accounts = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [balance, setBalance] = useState(null);
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Registration handler
    const handleRegister = async () => {
        try {
            const res = await registerAccount({ accountNumber, name, pin });
            setMessage(res.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    // Login handler
    const handleLogin = async () => {
        try {
            const res = await loginAccount({ accountNumber, pin });
            setToken(res.token);
            setIsAuthenticated(true);
            setMessage('Login successful');
            fetchBalance(res.token);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    // Fetch balance
    const fetchBalance = async (authToken) => {
        try {
            const res = await getBalance(authToken);
            setBalance(res.balance);
        } catch (err) {
            setError('Failed to fetch balance');
        }
    };

    // Deposit funds
    const handleDeposit = async () => {
        try {
            const res = await depositMoney({ amount }, token);
            setBalance(res.balance);
            setMessage(res.message);
        } catch (err) {
            setError('Deposit failed');
        }
    };

    // Withdraw funds
    const handleWithdraw = async () => {
        try {
            const res = await withdrawMoney({ amount }, token);
            setBalance(res.balance);
            setMessage(res.message);
        } catch (err) {
            setError('Withdrawal failed');
        }
    };

    // Logout
    const handleLogout = () => {
        setToken('');
        setIsAuthenticated(false);
        setBalance(null);
        setAccountNumber('');
        setName('');
        setPin('');
        setAmount('');
        setMessage('Logged out');
        setError('');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Bank Account Management
            </Typography>

            {error && (
                <Alert severity="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}
            {message && (
                <Alert severity="success" onClose={() => setMessage('')}>
                    {message}
                </Alert>
            )}

            {!isAuthenticated ? (
                // Show registration & login form
                <Box component={Paper} p={3} sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Register or Login
                    </Typography>
                    {/* Registration Fields */}
                    <TextField
                        label="Account Number"
                        fullWidth
                        margin="normal"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                    />
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="PIN"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleRegister}
                        sx={{ mt: 1 }}
                    >
                        Register
                    </Button>

                    {/* Login Fields */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Or Login
                    </Typography>
                    <TextField
                        label="Account Number"
                        fullWidth
                        margin="normal"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                    />
                    <TextField
                        label="PIN"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleLogin}
                        sx={{ mt: 1 }}
                    >
                        Login
                    </Button>
                </Box>
            ) : (
                // Show account actions
                <Box component={Paper} p={3} sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Welcome, {name || 'User'}
                    </Typography>
                    <Typography variant="subtitle1">Balance: {balance !== null ? `$${balance}` : 'Loading...'}</Typography>

                    {/* Deposit */}
                    <TextField
                        label="Amount to Deposit"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleDeposit}
                        sx={{ mt: 1 }}
                    >
                        Deposit
                    </Button>

                    {/* Withdraw */}
                    <TextField
                        label="Amount to Withdraw"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleWithdraw}
                        sx={{ mt: 1 }}
                    >
                        Withdraw
                    </Button>

                    {/* Logout */}
                    <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={handleLogout}
                        sx={{ mt: 2 }}
                    >
                        Logout
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Accounts;