import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const fetchProjects = async () => {
    const response = await axios.get(`${BASE_URL}/projects/`, getAuthHeaders());
    return response.data;
};