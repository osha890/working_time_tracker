import axios from 'axios';
import { isAuthenticated } from './auth';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api`;

export const getAuthHeaders = async () => {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
        return {};
    }

    const token = localStorage.getItem('access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const fetchData = async (endpoint) => {
    const response = await axios.get(`${API_URL}/${endpoint}/`, await getAuthHeaders());
    return response.data;
};

const postData = async (url, data = {}) => {
    try {
        const response = await axios.post(url, data, await getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
};

const putData = async (url, data = {}) => {
    try {
        const response = await axios.put(url, data, await getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('PUT request error:', error);
        throw error;
    }
};

const deleteData = async (url) => {
    try {
        const response = await axios.delete(url, await getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('DELETE request error:', error);
        throw error;
    }
};


export const fetchProjects = () => fetchData('projects');

export const fetchTasks = () => fetchData('tasks');

export const fetchUsers = () => fetchData('users');

export const fetchAccessibleTasks = () => fetchData('tasks/accessible');

export const fetchMyTasks = () => fetchData('tasks/my');

export const fetchStatuses = () => fetchData('tasks/statuses');

export const fetchTracks = () => fetchData('tracks');


export const postProject = (projectData) => {
    return postData(`${API_URL}/projects/`, projectData);
};

export const postTask = async (taskData) => {
    return postData(`${API_URL}/tasks/`, taskData, await getAuthHeaders());
};


export const updateProject = (id, projectData) => {
    return putData(`${API_URL}/projects/${id}/`, projectData);
};

export const updateTask = (id, taskData) => {
    return putData(`${API_URL}/tasks/${id}/`, taskData);
};


export const deleteProject = (id) => {
    return deleteData(`${API_URL}/projects/${id}/`);
};

export const deleteTask = (id) => {
    return deleteData(`${API_URL}/tasks/${id}/`);
};


export const updateUserProject = async (userId, projectId) => {
    return axios.patch(`${API_URL}/user_extensions/${userId}/`, {
        project: projectId
    }, await getAuthHeaders());
};

export const takeTask = async (taskId) => {
    return axios.post(`${API_URL}/tasks/${taskId}/take/`, {}, await getAuthHeaders());
};

export const refuseTask = async (taskId) => {
    return axios.post(`${API_URL}/tasks/${taskId}/refuse/`, {}, await getAuthHeaders());
};

export const changeStatus = async (taskId, status) => {
    return axios.post(`${API_URL}/tasks/${taskId}/change_status/`, {
        status: status
    }, await getAuthHeaders());
};
