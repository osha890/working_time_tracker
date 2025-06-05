import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Stack,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchMyTasks, fetchStatuses } from '../utils/api';

function MyTasks() {
    const [statusFilter, setStatusFilter] = useState('');
    const [reporterFilter, setReporterFilter] = useState('');
    const [tasks, setTasks] = useState([]);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchMyTasks();
                setTasks(data);
            } catch (error) {
                console.error('Failed to load tasks:', error);
            }
        };
        loadTasks();
    }, []);

    useEffect(() => {
        const loadStatuses = async () => {
            try {
                const data = await fetchStatuses();
                setStatuses(data); // ожидается массив объектов { key: string, label: string }
            } catch (error) {
                console.error('Failed to load statuses:', error);
            }
        };
        loadStatuses();
    }, []);

    // Заглушки: изменения статуса и untake task не функциональны
    const handleStatusChange = (taskId, newStatus) => {
        console.log(`Change status requested for task ${taskId} to ${newStatus} (не функционально)`);

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    const handleUntakeTask = (taskId) => {
        console.log(`Untake task requested for task ${taskId} (не функционально)`);
        // ничего не делаем
    };

    const filteredTasks = tasks.filter(task => {
        return (
            (!statusFilter || task.status === statusFilter) &&
            (!reporterFilter || (task.reporter && task.reporter.username === reporterFilter))
        );
    });

    const getUniqueReporters = (tasks) => {
        const usernames = tasks
            .map(task => task.reporter?.username)
            .filter(Boolean);
        return [...new Set(usernames)];
    };

    const columnStyles = {
        id: { width: '5%', minWidth: 40, textAlign: 'left' },
        title: { width: '50%', minWidth: 180, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        status: { width: '20%', minWidth: 120, textAlign: 'left' },
        button: { width: '15%', minWidth: 120, textAlign: 'left', ml: 2 }
    };

    return (
        <Container>
            <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {statuses.map(({ key, label }) => (
                            <MenuItem key={key} value={key}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Reporter</InputLabel>
                    <Select
                        value={reporterFilter}
                        label="Reporter"
                        onChange={(e) => setReporterFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {getUniqueReporters(tasks).map(username => (
                            <MenuItem key={username} value={username}>{username}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    onClick={() => {
                        setStatusFilter('');
                        setReporterFilter('');
                    }}
                >
                    Clear
                </Button>
            </Stack>

            <Box display="flex" alignItems="center" fontWeight="bold" fontSize="1.1rem" mb={1}>
                <Typography sx={columnStyles.id}>ID</Typography>
                <Typography sx={columnStyles.title}>Title</Typography>
                <Typography sx={columnStyles.status}>Status</Typography>
                <Box sx={columnStyles.button}></Box>
            </Box>

            {filteredTasks.map(task => (
                <Accordion key={task.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" alignItems="center" width="100%">
                            <Typography sx={columnStyles.id}>{task.id}</Typography>
                            <Typography sx={columnStyles.title} title={task.title}>{task.title}</Typography>
                            <FormControl size="small" sx={columnStyles.status}>
                                <Select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()} // Остановка всплытия клика
                                >
                                    {statuses.map(({ key, label }) => (
                                        <MenuItem key={key} value={key}>{label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={columnStyles.button}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUntakeTask(task.id);
                                    }}
                                >
                                    Untake Task
                                </Button>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography><strong>Description:</strong> {task.description}</Typography>
                        <Typography><strong>Reporter:</strong> {task.reporter?.username || '—'}</Typography>
                        <Typography><strong>Created At:</strong> {new Date(task.created_at).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}

export default MyTasks;
