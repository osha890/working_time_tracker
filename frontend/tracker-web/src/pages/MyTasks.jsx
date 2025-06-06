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
import { fetchMyTasks, fetchStatuses, refuseTask, changeStatus } from '../utils/api';

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
                setStatuses(data);
            } catch (error) {
                console.error('Failed to load statuses:', error);
            }
        };
        loadStatuses();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await changeStatus(taskId, newStatus);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
        } catch (error) {
            console.error(`Failed to change status for task ${taskId}:`, error);
        }
    };

    const handleRefuseTask = async (taskId) => {
        try {
            await refuseTask(taskId);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error(`Failed to refuse task ${taskId}:`, error);
        }
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
        title: {
            width: '50%',
            minWidth: 180,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        status: { width: '20%', minWidth: 120, textAlign: 'left' },
        button: { width: '15%', minWidth: 120, textAlign: 'left', ml: 2 }
    };

    return (
        <Container sx={{ width: '90%', maxWidth: '900px', mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={700} color="primary.dark">My Tasks</Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            boxShadow: '0 2px 5px rgb(0 0 0 / 0.05)'
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {statuses.map(({ key, label }) => (
                            <MenuItem key={key} value={key}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
                    <InputLabel>Reporter</InputLabel>
                    <Select
                        value={reporterFilter}
                        label="Reporter"
                        onChange={(e) => setReporterFilter(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            boxShadow: '0 2px 5px rgb(0 0 0 / 0.05)'
                        }}
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

            <Box display="flex" alignItems="center" fontWeight="bold" fontSize="1.1rem" mb={1} px={2}>
                <Typography sx={columnStyles.id}>ID</Typography>
                <Typography sx={columnStyles.title}>Title</Typography>
                <Typography sx={columnStyles.status}>Status</Typography>
                <Box sx={columnStyles.button}></Box>
            </Box>

            {filteredTasks.map(task => (
                <Accordion
                    key={task.id}
                    sx={{
                        '&:before': { display: 'none' },
                        boxShadow: 'none',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-expanded': { margin: 'auto' }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            px: 2,
                            py: 1.5,
                            '&:hover': { bgcolor: 'action.hover' },
                            cursor: 'pointer',
                        }}
                    >
                        <Box display="flex" alignItems="center" width="100%" gap={2}>
                            <Typography sx={columnStyles.id} fontWeight={500}>{task.id}</Typography>
                            <Typography sx={columnStyles.title} title={task.title} noWrap>{task.title}</Typography>

                            <FormControl size="small" sx={columnStyles.status} onClick={e => e.stopPropagation()}>
                                <Select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    sx={{ minWidth: '100%' }}
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
                                        handleRefuseTask(task.id);
                                    }}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Refuse
                                </Button>
                            </Box>
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ px: 2, py: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', borderRadius: '0 0 12px 12px' }}>
                        <Typography><strong>Description:</strong> {task.description || '—'}</Typography>
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
