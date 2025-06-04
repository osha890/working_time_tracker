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

const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    try {
        const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
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

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};
