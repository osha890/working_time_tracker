import React, { useState, useEffect } from 'react';
import {
    TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Select, MenuItem, TableSortLabel, FormControl,
    Typography, Box
} from '@mui/material';
import { fetchUsers, fetchProjects, updateUserProject } from '../utils/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterProject, setFilterProject] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await fetchUsers();
                setUsers(users);
            } catch (error) {
                console.error('Failed to load users:', error);
            }
        };

        const loadProjects = async () => {
            try {
                const projects = await fetchProjects();
                setProjects(projects);
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        };

        loadUsers();
        loadProjects();
    }, []);

    useEffect(() => {
        let result = [...users];

        if (search) {
            result = result.filter(user =>
                user.username.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filterProject) {
            result = result.filter(user =>
                user.extension?.project === Number(filterProject)
            );
        }

        result.sort((a, b) =>
            sortOrder === 'asc' ? a.id - b.id : b.id - a.id
        );

        setFilteredUsers(result);
    }, [users, search, filterProject, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const handleProjectChange = async (userId, newProjectId) => {
        try {
            await updateUserProject(userId, newProjectId);
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? {
                            ...user,
                            extension: {
                                ...user.extension,
                                project: newProjectId,
                                project_title:
                                    projects.find(p => p.id === newProjectId)?.title || '—',
                            },
                        }
                        : user
                )
            );
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const projectOptions = projects.map(project => ({
        id: project.id,
        title: project.title
    }));

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Users
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sortDirection={sortOrder}
                                sx={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}
                            >
                                <TableSortLabel
                                    active
                                    direction={sortOrder}
                                    onClick={toggleSortOrder}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>
                                <TextField
                                    placeholder="Search by username"
                                    variant="standard"
                                    fullWidth
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </TableCell>

                            <TableCell sx={{ width: '250px', minWidth: '250px', maxWidth: '250px' }}>
                                <FormControl variant="standard" fullWidth>
                                    <Select
                                        value={filterProject}
                                        displayEmpty
                                        onChange={(e) => setFilterProject(e.target.value)}
                                        renderValue={(selected) => {
                                            const selectedProject = projectOptions.find(p => p.id === Number(selected));
                                            return selectedProject ? selectedProject.title : 'All projects';
                                        }}
                                    >
                                        <MenuItem value="">All projects</MenuItem>
                                        {projectOptions.map(p => (
                                            <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.extension?.project || ''}
                                        onChange={(e) => handleProjectChange(user.id, e.target.value)}
                                        variant="standard"
                                        fullWidth
                                        displayEmpty
                                    >
                                        <MenuItem value="">No project</MenuItem>
                                        {projects.map(project => (
                                            <MenuItem key={project.id} value={project.id}>
                                                {project.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Users;
