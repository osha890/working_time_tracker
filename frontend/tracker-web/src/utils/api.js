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

const postData = async (url, data = {}) => {
    try {
        const response = await axios.post(url, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
};

const putData = async (url, data = {}) => {
    try {
        const response = await axios.put(url, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('PUT request error:', error);
        throw error;
    }
};

const deleteData = async (url) => {
    try {
        const response = await axios.delete(url, getAuthHeaders());
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
    return postData(`${BASE_URL}/projects/`, projectData);
};

export const postTask = (taskData) => {
    return postData(`${BASE_URL}/tasks/`, taskData, getAuthHeaders());
};


export const updateProject = (id, projectData) => {
    return putData(`${BASE_URL}/projects/${id}/`, projectData);
};

export const updateTask = (id, taskData) => {
    return putData(`${BASE_URL}/tasks/${id}/`, taskData);
};


export const deleteProject = (id) => {
    return deleteData(`${BASE_URL}/projects/${id}/`);
};

export const deleteTask = (id) => {
    return deleteData(`${BASE_URL}/tasks/${id}/`);
};


export const updateUserProject = (userId, projectId) => {
    return axios.patch(`${BASE_URL}/user_extensions/${userId}/`, {
        project: projectId
    }, getAuthHeaders());
};

export const takeTask = (taskId) => {
    return axios.post(`${BASE_URL}/tasks/${taskId}/take/`, {}, getAuthHeaders());
};

export const refuseTask = (taskId) => {
    return axios.post(`${BASE_URL}/tasks/${taskId}/refuse/`, {}, getAuthHeaders());
};

export const changeStatus = (taskId, status) => {
    return axios.post(`${BASE_URL}/tasks/${taskId}/change_status/`, {
        status: status
    }, getAuthHeaders());
};
