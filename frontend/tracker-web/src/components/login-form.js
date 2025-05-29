import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(res => {
                if (!res.ok) throw new Error('Authorization error');
                return res.json();
            })
            .then(data => {
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);;
                onLoginSuccess();
            })
            .catch(err => alert('Error: ' + err.message));
    };

    return (
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
                Login
            </button>
        </form>
    );
};

export default LoginForm;