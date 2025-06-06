import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'http://127.0.0.1:8000';
const AUTH_URL = `${BASE_URL}/auth`;

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${AUTH_URL}/token/`, {
            username,
            password,
        });

        const { access, refresh } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        const userRes = await axios.get(`${BASE_URL}/api/users/me/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        return {
            success: true,
            user: userRes.data,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.detail || 'Login failed. Please try again.',
        };
    }
};

const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    try {
        const response = await axios.post(`${AUTH_URL}/token/refresh/`, { refresh });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        console.log("refreshed")
        return true;
    } catch (error) {
        logout();
        console.log("not refreshed")
        return false;
    }
};


export const isAuthenticated = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    console.log("isAuth");

    try {
        const { exp } = jwtDecode(token);
        const now = Date.now() / 1000;
        if (exp > now) {
            return true;
        } else {
            return await refreshAccessToken();
        }
    } catch (error) {
        return false;
    }
};

export const logout = async (onLogoutSuccess) => {
    const refresh = localStorage.getItem('refresh_token');
    const access = localStorage.getItem('access_token');

    if (refresh) {
        try {
            await axios.post(
                `${AUTH_URL}/logout/`,
                { refresh },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}`,
                    },
                }
            );
        } catch (error) {
            console.error('Logout error:', error.response?.data || error.message);
        }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    if (onLogoutSuccess) {
        onLogoutSuccess();
    }
};
