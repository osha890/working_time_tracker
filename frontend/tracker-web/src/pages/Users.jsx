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
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight={700} color="primary.dark">
                Users
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell
                                sortDirection={sortOrder}
                                sx={{
                                    width: 100,
                                    minWidth: 100,
                                    maxWidth: 100,
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    pl: 3,
                                }}
                            >
                                <TableSortLabel
                                    active
                                    direction={sortOrder}
                                    onClick={toggleSortOrder}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: 200,
                                    minWidth: 200,
                                    maxWidth: 200,
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    pl: 1,
                                }}
                            >
                                <TextField
                                    placeholder="Search by username"
                                    variant="standard"
                                    fullWidth
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    InputProps={{ disableUnderline: true }}
                                    sx={{
                                        backgroundColor: 'grey.50',
                                        borderRadius: 1,
                                        px: 1,
                                    }}
                                />
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: 250,
                                    minWidth: 250,
                                    maxWidth: 250,
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    pr: 3,
                                }}
                            >
                                <FormControl variant="standard" fullWidth>
                                    <Select
                                        value={filterProject}
                                        displayEmpty
                                        onChange={(e) => setFilterProject(e.target.value)}
                                        renderValue={(selected) => {
                                            const selectedProject = projectOptions.find(p => p.id === Number(selected));
                                            return selectedProject ? selectedProject.title : 'All projects';
                                        }}
                                        sx={{
                                            backgroundColor: 'grey.50',
                                            borderRadius: 1,
                                            px: 1,
                                            py: '6px',
                                            '& .MuiSelect-icon': { color: 'text.secondary' },
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
                            <TableRow key={user.id} hover>
                                <TableCell sx={{ pl: 3, fontWeight: 500, color: 'primary.main' }}>
                                    {user.id}
                                </TableCell>
                                <TableCell sx={{ pl: 1, fontWeight: 500 }}>
                                    {user.username}
                                </TableCell>
                                <TableCell sx={{ pr: 3 }}>
                                    {!user.is_staff ? (
                                        <FormControl variant="standard" fullWidth>
                                            <Select
                                                value={user.extension?.project || ''}
                                                onChange={(e) => handleProjectChange(user.id, e.target.value)}
                                                displayEmpty
                                                sx={{
                                                    backgroundColor: 'grey.50',
                                                    borderRadius: 1,
                                                    px: 1,
                                                    py: '6px',
                                                    '& .MuiSelect-icon': { color: 'text.secondary' },
                                                }}
                                            >
                                                <MenuItem value="">No project</MenuItem>
                                                {projects.map(project => (
                                                    <MenuItem key={project.id} value={project.id}>
                                                        {project.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Admin
                                        </Typography>
                                    )}
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
