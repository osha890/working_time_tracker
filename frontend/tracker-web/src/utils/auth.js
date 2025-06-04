import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'http://127.0.0.1:8000';

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/token/`, {
            username,
            password,
        });

        const { access, refresh } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.detail || 'Login failed. Please try again.',
        };
    }
};


export const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        const now = Date.now() / 1000;
        return exp > now;
    } catch (error) {
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};