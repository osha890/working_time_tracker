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
        id: { width: '5%', minWidth: 40, textAlign: 'left' },
        username: { width: '15%', minWidth: 100, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        task: { width: '20%', minWidth: 140, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        project: { width: '20%', minWidth: 140, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        status: { width: '15%', minWidth: 100, textAlign: 'left', color: 'text.secondary' },
        timeFrom: { width: '10%', minWidth: 120, textAlign: 'left' },
        timeTo: { width: '10%', minWidth: 120, textAlign: 'left' },
    };

    return (
        <Container sx={{ width: '90%', maxWidth: '1200px', mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={700} color="primary.dark">Tracks</Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center" flexWrap="wrap">
                {[{
                    label: 'User',
                    value: userFilter,
                    onChange: (e) => setUserFilter(e.target.value),
                    options: getUniqueValues(tracks, 'user.username')
                }, {
                    label: 'Task',
                    value: taskFilter,
                    onChange: (e) => setTaskFilter(e.target.value),
                    options: getUniqueValues(tracks, 'task.title')
                }, {
                    label: 'Project',
                    value: projectFilter,
                    onChange: (e) => setProjectFilter(e.target.value),
                    options: getUniqueValues(tracks, 'task.project.title')
                }, {
                    label: 'Status',
                    value: statusFilter,
                    onChange: (e) => setStatusFilter(e.target.value),
                    options: getUniqueValues(tracks, 'status_display')
                }].map(({ label, value, onChange, options }) => (
                    <FormControl key={label} size="small" sx={{ minWidth: 140, flex: 1 }}>
                        <InputLabel>{label}</InputLabel>
                        <Select
                            value={value}
                            label={label}
                            onChange={onChange}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: 'background.paper',
                                boxShadow: '0 2px 5px rgb(0 0 0 / 0.05)'
                            }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {options.map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ))}

                <Button
                    variant="outlined"
                    onClick={() => {
                        setUserFilter('');
                        setTaskFilter('');
                        setStatusFilter('');
                        setProjectFilter('');
                    }}
                    sx={{
                        borderRadius: 2,
                        minWidth: 100,
                        textTransform: 'none',
                        color: 'text.secondary',
                        borderColor: 'divider',
                        '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main'
                        }
                    }}
                >
                    Clear
                </Button>
            </Stack>

            <Box display="flex" alignItems="center" fontWeight="bold" fontSize="1.1rem" px={3} py={1.5} bgcolor="grey.100" borderRadius={3} mb={1}>
                <Button
                    onClick={() => toggleSortOrder('id')}
                    size="small"
                    sx={{
                        ...columnStyles.id,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'text.primary',
                        '&:hover': { backgroundColor: 'transparent' }
                    }}
                >
                    ID {arrow('id')}
                </Button>
                <Typography sx={{ ...columnStyles.username, fontWeight: 600 }}>Username</Typography>
                <Typography sx={{ ...columnStyles.task, fontWeight: 600 }}>Task</Typography>
                <Typography sx={{ ...columnStyles.project, fontWeight: 600 }}>Project</Typography>
                <Typography sx={{ ...columnStyles.status, fontWeight: 600 }}>Status</Typography>
                <Button
                    onClick={() => toggleSortOrder('time_from')}
                    size="small"
                    sx={{
                        ...columnStyles.timeFrom,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'text.primary',
                        '&:hover': { backgroundColor: 'transparent' }
                    }}
                >
                    From {arrow('time_from')}
                </Button>
                <Button
                    onClick={() => toggleSortOrder('time_to')}
                    size="small"
                    sx={{
                        ...columnStyles.timeTo,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'text.primary',
                        '&:hover': { backgroundColor: 'transparent' }
                    }}
                >
                    To {arrow('time_to')}
                </Button>
            </Box>

            {sorted.map(track => (
                <Box
                    key={track.id}
                    display="flex"
                    alignItems="center"
                    borderBottom="1px solid"
                    borderColor="divider"
                    px={3}
                    py={1.5}
                    sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                        cursor: 'default',
                    }}
                >
                    <Typography sx={columnStyles.id}>{track.id}</Typography>
                    <Typography sx={columnStyles.username} title={track.user.username} noWrap>{track.user.username}</Typography>
                    <Typography sx={columnStyles.task} title={track.task.title} noWrap>{track.task.title}</Typography>
                    <Typography sx={columnStyles.project} title={track.task.project?.title || '—'} noWrap>{track.task.project?.title || '—'}</Typography>
                    <Typography sx={columnStyles.status} title={track.status_display} noWrap>{track.status_display}</Typography>
                    <Typography sx={columnStyles.timeFrom}>{formatDate(track.time_from)}</Typography>
                    <Typography sx={columnStyles.timeTo}>{formatDate(track.time_to)}</Typography>
                </Box>
            ))}
        </Container>
    );

}

export default Tracks;
