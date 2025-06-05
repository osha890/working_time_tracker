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

const fetchData = async (endpoint) => {
    const response = await axios.get(`${BASE_URL}/${endpoint}/`, getAuthHeaders());
    return response.data;
};

export const fetchProjects = () => fetchData('projects');
export const fetchTasks = () => fetchData('tasks');
export const fetchUsers = () => fetchData('users');
