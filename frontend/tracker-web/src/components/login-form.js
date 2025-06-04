import React, { useState } from 'react';
import { saveTokens } from 'utils/auth';
import 'style/login-form.css';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const register = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Registration error');
        return res.json();
    };

    const login = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Login error');
        const data = await res.json();
        saveTokens({ access: data.access, refresh: data.refresh });
        onLoginSuccess();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isRegistering) {
                await register();
            }
            await login();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="formContainer">
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="login-input"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="login-input"
                    required
                />
                <button type="submit" className="login-submit">
                    {isRegistering ? 'Register' : 'Login'}
                </button>
                <button
                    type="button"
                    className="login-toggle"
                    onClick={() => setIsRegistering(!isRegistering)}
                >
                    {isRegistering ? 'Back to Login' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
