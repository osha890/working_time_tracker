import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    IconButton,
    Stack,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTasks } from '../utils/api';

const getUniqueValues = (tasks, field, nestedField = null) => {
    const values = tasks.map(task => {
        if (!nestedField) return task[field];
        if (task[field]) return task[field][nestedField];
        return null;
    });
    return [...new Set(values.filter(Boolean))];
};

function TaskList() {
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [projectFilter, setProjectFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [reporterFilter, setReporterFilter] = useState('');
    const [assigneeFilter, setAssigneeFilter] = useState('');
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks();
                console.log(data);
                setTasks(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load tasks');
            }
        };

        loadTasks();
    }, []);

    if (error) return <div>{error}</div>;

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
            (!projectFilter || (task.project && task.project.title === projectFilter)) &&
            (!statusFilter || task.status === statusFilter) &&
            (!reporterFilter || (task.reporter && task.reporter.username === reporterFilter)) &&
            (!assigneeFilter || (task.assignee && task.assignee.username === assigneeFilter))
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
        title: { width: '25%', minWidth: 180, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        project: { width: '20%', minWidth: 140, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        status: { width: '10%', minWidth: 80, textAlign: 'left' },
        created_at: { width: '15%', minWidth: 120, textAlign: 'left' },
        actions: { width: '15%', minWidth: 120, textAlign: 'right' }
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Tasks</Typography>
                <Button variant="contained">Add Task</Button>
            </Box>

            <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Project</InputLabel>
                    <Select
                        value={projectFilter}
                        label="Project"
                        onChange={(e) => setProjectFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {getUniqueValues(tasks, 'project', 'title').map(title => (
                            <MenuItem key={title} value={title}>{title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {getUniqueValues(tasks, 'status').map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
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

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Assignee</InputLabel>
                    <Select
                        value={assigneeFilter}
                        label="Assignee"
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {getUniqueValues(tasks, 'assignee', 'username').map(username => (
                            <MenuItem key={username} value={username}>{username}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    onClick={() => {
                        setProjectFilter('');
                        setStatusFilter('');
                        setReporterFilter('');
                        setAssigneeFilter('');
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
                <Typography sx={columnStyles.project}>Project</Typography>
                <Typography sx={columnStyles.status}>Status</Typography>
                <Button
                    onClick={() => toggleSortOrder('created_at')}
                    size="small"
                    sx={columnStyles.created_at}
                >
                    Created At {arrow('created_at')}
                </Button>
                <Box sx={columnStyles.actions}>Actions</Box>
            </Box>

            {sortedTasks.map(task => (
                <Accordion key={task.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" alignItems="center" width="100%">
                            <Typography sx={columnStyles.id}>{task.id}</Typography>
                            <Typography sx={columnStyles.title} title={task.title}>{task.title}</Typography>
                            <Typography sx={columnStyles.project} title={task.project?.title}>{task.project?.title}</Typography>
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
                            <Stack direction="row" spacing={1} sx={{ ml: 'auto', ...columnStyles.actions }}>
                                <IconButton onClick={(e) => e.stopPropagation()} size="small">
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton color="error" onClick={(e) => e.stopPropagation()} size="small">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Stack>
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

export default TaskList;
