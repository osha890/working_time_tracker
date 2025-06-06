import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from '@mui/material';
import { fetchTracks } from '../utils/api';

const getUniqueValues = (items, path) => {
    const values = items.map(item => {
        const keys = path.split('.');
        return keys.reduce((obj, key) => obj?.[key], item);
    });
    return [...new Set(values.filter(Boolean))];
};

function formatDate(dateString) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function Tracks() {
    const [tracks, setTracks] = useState([]);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

    const [userFilter, setUserFilter] = useState('');
    const [taskFilter, setTaskFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTracks();
                setTracks(data);
            } catch (err) {
                console.error('Failed to fetch tracks', err);
            }
        };
        load();
    }, []);

    const toggleSortOrder = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const arrow = (field) => {
        if (sortField !== field) return '';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const filtered = tracks.filter(track =>
        (!userFilter || track.user.username === userFilter) &&
        (!taskFilter || track.task.title === taskFilter) &&
        (!statusFilter || track.status_display === statusFilter) &&
        (!projectFilter || track.task.project?.title === projectFilter)
    );

    const sorted = [...filtered].sort((a, b) => {
        const getValue = (item, field) => {
            const val = item[field];
            if (field.includes('time') && val) return new Date(val).getTime();
            return val ?? null;
        };

        const valA = getValue(a, sortField);
        const valB = getValue(b, sortField);

        if (sortField === 'time_to') {
            if (valA === null && valB !== null) return sortOrder === 'asc' ? 1 : -1;
            if (valA !== null && valB === null) return sortOrder === 'asc' ? -1 : 1;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const columnStyles = {
        id: { width: '5%', minWidth: 40 },
        username: { width: '15%', minWidth: 100 },
        task: { width: '20%', minWidth: 140 },
        project: { width: '20%', minWidth: 140 },
        status: { width: '15%', minWidth: 100 },
        time: { width: '20%', minWidth: 160 },
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Tracks</Typography>

            <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>User</InputLabel>
                    <Select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} label="User">
                        <MenuItem value="">All</MenuItem>
                        {getUniqueValues(tracks, 'user.username').map(username => (
                            <MenuItem key={username} value={username}>{username}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Task</InputLabel>
                    <Select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)} label="Task">
                        <MenuItem value="">All</MenuItem>
                        {getUniqueValues(tracks, 'task.title').map(title => (
                            <MenuItem key={title} value={title}>{title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Project</InputLabel>
                    <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} label="Project">
                        <MenuItem value="">All</MenuItem>
                        {getUniqueValues(tracks, 'task.project.title').map(title => (
                            <MenuItem key={title} value={title}>{title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                        <MenuItem value="">All</MenuItem>
                        {getUniqueValues(tracks, 'status_display').map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setUserFilter('');
                        setTaskFilter('');
                        setStatusFilter('');
                        setProjectFilter('');
                    }}
                >
                    Clear
                </Button>
            </Stack>

            <Box display="flex" fontWeight="bold" mb={1}>
                <Button onClick={() => toggleSortOrder('id')} size="small" sx={columnStyles.id}>ID {arrow('id')}</Button>
                <Typography sx={columnStyles.username}>Username</Typography>
                <Typography sx={columnStyles.task}>Task</Typography>
                <Typography sx={columnStyles.project}>Project</Typography>
                <Typography sx={columnStyles.status}>Status</Typography>
                <Button onClick={() => toggleSortOrder('time_from')} size="small" sx={columnStyles.time}>From {arrow('time_from')}</Button>
                <Button onClick={() => toggleSortOrder('time_to')} size="small" sx={columnStyles.time}>To {arrow('time_to')}</Button>
            </Box>

            {sorted.map(track => (
                <Box key={track.id} display="flex" borderBottom="1px solid #ccc" py={1}>
                    <Typography sx={columnStyles.id}>{track.id}</Typography>
                    <Typography sx={columnStyles.username}>{track.user.username}</Typography>
                    <Typography sx={columnStyles.task}>{track.task.title}</Typography>
                    <Typography sx={columnStyles.project}>{track.task.project?.title || '—'}</Typography>
                    <Typography sx={columnStyles.status}>{track.status_display}</Typography>
                    <Typography sx={columnStyles.time}>{formatDate(track.time_from)}</Typography>
                    <Typography sx={columnStyles.time}>{formatDate(track.time_to)}</Typography>
                </Box>
            ))}
        </Container>
    );
}

export default Tracks;
