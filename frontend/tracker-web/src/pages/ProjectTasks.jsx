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
import { fetchAccessibleTasks, takeTask } from '../utils/api'; // Импортируем takeTask

const getUniqueValues = (tasks, field, nestedField = null) => {
    const values = tasks.map(task => {
        if (!nestedField) return task[field];
        if (task[field]) return task[field][nestedField];
        return null;
    });
    return [...new Set(values.filter(Boolean))];
};

function ProjectTasks() {
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [statusFilter, setStatusFilter] = useState('');
    const [reporterFilter, setReporterFilter] = useState('');
    const [tasks, setTasks] = useState([]);

    const loadTasks = async () => {
        try {
            const data = await fetchAccessibleTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const getUniqueStatusPairs = (tasks) => {
        const pairs = tasks
            .filter(task => task.status && task.status_display)
            .map(task => ({ value: task.status, label: task.status_display }));

        const seen = new Set();
        return pairs.filter(pair => {
            if (seen.has(pair.value)) return false;
            seen.add(pair.value);
            return true;
        });
    };

    const toggleSortOrder = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const arrow = (field) => {
        if (sortField !== field) return '';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const filteredTasks = tasks.filter(task => {
        return (
            (!statusFilter || task.status === statusFilter) &&
            (!reporterFilter || (task.reporter && task.reporter.username === reporterFilter))
        );
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'created_at') {
            valA = new Date(valA);
            valB = new Date(valB);
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const columnStyles = {
        id: { width: '5%', minWidth: 40, textAlign: 'left' },
        title: { width: '35%', minWidth: 180, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        status: { width: '15%', minWidth: 80, textAlign: 'left' },
        created_at: { width: '15%', minWidth: 140, textAlign: 'left' },
        button: { width: '10%', minWidth: 120, textAlign: 'left', ml: 20 }
    };

    const projectTitle = sortedTasks.length > 0 ? sortedTasks[0].project?.title || 'Project' : 'Project';

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">{projectTitle}</Typography>
            </Box>

            <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {getUniqueStatusPairs(tasks).map(({ value, label }) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
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
                        {getUniqueValues(tasks, 'reporter', 'username').map(username => (
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
                <Button
                    onClick={() => toggleSortOrder('id')}
                    size="small"
                    sx={columnStyles.id}
                >
                    ID {arrow('id')}
                </Button>
                <Typography sx={columnStyles.title}>Title</Typography>
                <Typography sx={columnStyles.status}>Status</Typography>
                <Button
                    onClick={() => toggleSortOrder('created_at')}
                    size="small"
                    sx={columnStyles.created_at}
                >
                    Created At {arrow('created_at')}
                </Button>
            </Box>

            {sortedTasks.map(task => (
                <Accordion key={task.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" alignItems="center" width="100%">
                            <Typography sx={columnStyles.id}>{task.id}</Typography>
                            <Typography sx={columnStyles.title} title={task.title}>{task.title}</Typography>
                            <Typography sx={columnStyles.status}>{task.status_display}</Typography>
                            <Typography sx={columnStyles.created_at}>
                                {new Date(task.created_at).toLocaleString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                            {task.assignee === null && (
                                <Box sx={columnStyles.button}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await takeTask(task.id);
                                                console.log(`Task ${task.id} taken`);
                                                await loadTasks(); // 🔄 Обновляем список задач
                                            } catch (error) {
                                                console.error(`Failed to take task ${task.id}`, error);
                                            }
                                        }}
                                    >
                                        Take Task
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography><strong>Description:</strong> {task.description}</Typography>
                        <Typography><strong>Reporter:</strong> {task.reporter?.username || '—'}</Typography>
                        <Typography><strong>Assignee:</strong> {task.assignee?.username || '—'}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}

export default ProjectTasks;
