import React, { useState, useEffect } from 'react';
import {
    TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Select, MenuItem, TableSortLabel, FormControl, Typography, Box
} from '@mui/material';
import { fetchUsers } from '../utils/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

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
        loadUsers();
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
                user.extension?.project_title === filterProject
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

    const projectTitles = [...new Set(users.map(u => u.extension?.project_title).filter(Boolean))];

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
                                        renderValue={(selected) => selected || 'All projects'}
                                    >
                                        <MenuItem value="">All projects</MenuItem>
                                        {projectTitles.map(title => (
                                            <MenuItem key={title} value={title}>{title}</MenuItem>
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
                                <TableCell>{user.extension?.project_title || '—'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Users;
