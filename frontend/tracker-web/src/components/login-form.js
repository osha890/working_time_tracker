import React, { useState } from 'react';
import { saveTokens } from '../utils/auth';  // путь может отличаться, проверь структуру проекта

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isRegistering
            ? `${process.env.REACT_APP_API_BASE_URL}/auth/register/`
            : `${process.env.REACT_APP_API_BASE_URL}/auth/token/`;

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(res => {
                if (!res.ok) throw new Error('Error');
                return res.json();
            })
            .then(data => {
                if (isRegistering) {
                    fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/token/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    })
                        .then(res => {
                            if (!res.ok) throw new Error('Login error');
                            return res.json();
                        })
                        .then(data => {
                            saveTokens({ access: data.access, refresh: data.refresh });
                            onLoginSuccess();
                        });
                } else {
                    saveTokens({ access: data.access, refresh: data.refresh });
                    onLoginSuccess();
                }
            })
            .catch(err => alert('Error: ' + err.message));
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
