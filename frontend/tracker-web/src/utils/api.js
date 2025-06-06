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
export const fetchAccessibleTasks = () => fetchData('tasks/accessible');
export const fetchMyTasks = () => fetchData('tasks/my');
export const fetchStatuses = () => fetchData('tasks/statuses');

const postData = async (url, data = {}, config = {}) => {
    try {
        const response = await axios.post(url, data, config);
        return response.data;
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
};

export const postProjects = (projectData) => {
    return postData(`${BASE_URL}/projects/`, projectData, getAuthHeaders());
};