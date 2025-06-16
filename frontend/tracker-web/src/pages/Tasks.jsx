import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Button, Stack, FormControl, InputLabel, Select, MenuItem,
    Accordion, AccordionSummary, AccordionDetails, IconButton, Paper, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTasks, postTask, updateTask, deleteTask } from '../utils/api';
import TaskDialog from '../components/TaskDialog';

const getUniqueValues = (tasks, field, nestedField = null) => {
    const values = tasks.map(task => {
        if (!nestedField) return task[field];
        if (task[field]) return task[field][nestedField];
        return null;
    });
    return [...new Set(values.filter(Boolean))];
};

function Tasks() {
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [projectFilter, setProjectFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [reporterFilter, setReporterFilter] = useState('');
    const [assigneeFilter, setAssigneeFilter] = useState('');
    const [tasks, setTasks] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks();
                setTasks(data);
            } catch (error) {
                console.error('Failed to load tasks:', error);
            }
        };

        loadTasks();
    }, []);

    const handleAddClick = () => {
        setEditingTask(null);
        setDialogOpen(true);
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogSubmit = async (formData) => {
        try {
            if (editingTask) {
                await updateTask(editingTask.id, formData);
            } else {
                await postTask(formData);
            }
            const updated = await fetchTasks();
            setTasks(updated);
            setDialogOpen(false);
        } catch (error) {
            throw error;
        }
    };

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
        <Container sx={{ width: '90%', maxWidth: '1200px' , mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={700} color="primary.dark">Tasks</Typography>
                <Button
                    variant="contained"
                    onClick={handleAddClick}
                    sx={{ borderRadius: 2, px: 3, py: 1.25, textTransform: 'none', boxShadow: 3 }}
                >
                    Add Task
                </Button>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center">
                {[{
                    label: 'Project',
                    value: projectFilter,
                    onChange: (e) => setProjectFilter(e.target.value),
                    options: getUniqueValues(tasks, 'project', 'title')
                }, {
                    label: 'Status',
                    value: statusFilter,
                    onChange: (e) => setStatusFilter(e.target.value),
                    options: getUniqueStatusPairs(tasks),
                    isStatus: true
                }, {
                    label: 'Reporter',
                    value: reporterFilter,
                    onChange: (e) => setReporterFilter(e.target.value),
                    options: getUniqueValues(tasks, 'reporter', 'username')
                }, {
                    label: 'Assignee',
                    value: assigneeFilter,
                    onChange: (e) => setAssigneeFilter(e.target.value),
                    options: getUniqueValues(tasks, 'assignee', 'username')
                }].map(({ label, value, onChange, options, isStatus }) => (
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
                            {isStatus
                                ? options.map(({ value, label }) => (
                                    <MenuItem key={value} value={value}>{label}</MenuItem>
                                ))
                                : options.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                ))}

                <Button
                    variant="outlined"
                    onClick={() => {
                        setProjectFilter('');
                        setStatusFilter('');
                        setReporterFilter('');
                        setAssigneeFilter('');
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

            <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box display="flex" alignItems="center" fontWeight="bold" fontSize="1.1rem" px={3} py={1.5} bgcolor="grey.100">
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
                    <Typography sx={{ ...columnStyles.title, fontWeight: 600 }}>Title</Typography>
                    <Typography sx={{ ...columnStyles.project, fontWeight: 600 }}>Project</Typography>
                    <Typography sx={{ ...columnStyles.status, fontWeight: 600 }}>Status</Typography>
                    <Button
                        onClick={() => toggleSortOrder('created_at')}
                        size="small"
                        sx={{
                            ...columnStyles.created_at,
                            textTransform: 'none',
                            fontWeight: 600,
                            color: 'text.primary',
                            '&:hover': { backgroundColor: 'transparent' }
                        }}
                    >
                        Created At {arrow('created_at')}
                    </Button>
                    <Box sx={columnStyles.actions}>Actions</Box>
                </Box>
                <Divider />

                {sortedTasks.map(task => (
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
                                px: 3,
                                py: 1.5,
                                '&:hover': { bgcolor: 'action.hover' },
                                cursor: 'pointer',
                            }}
                        >
                            <Box display="flex" alignItems="center" width="100%" gap={2}>
                                <Typography sx={columnStyles.id} fontWeight={500}>{task.id}</Typography>
                                <Typography sx={columnStyles.title} title={task.title} noWrap>{task.title}</Typography>
                                <Typography sx={columnStyles.project} title={task.project?.title} noWrap>{task.project?.title}</Typography>
                                <Typography sx={columnStyles.status} color="text.secondary" noWrap>{task.status_display}</Typography>
                                <Typography sx={columnStyles.created_at} color="text.secondary" noWrap>
                                    {new Date(task.created_at).toLocaleString('en-GB', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ ml: 'auto', ...columnStyles.actions }}>
                                    <IconButton
                                        onClick={(e) => { e.stopPropagation(); handleEditClick(task); }}
                                        size="small"
                                        color="primary"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this task?')) {
                                                try {
                                                    await deleteTask(task.id);
                                                    setTasks((prev) => prev.filter((t) => t.id !== task.id));
                                                } catch (error) {
                                                    console.error('Failed to delete task', error);
                                                }
                                            }
                                        }}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', borderRadius: '0 0 12px 12px' }}>
                            <Typography paragraph><strong>Description:</strong> {task.description || '—'}</Typography>
                            <Typography><strong>Reporter:</strong> {task.reporter?.username || '—'}</Typography>
                            <Typography><strong>Assignee:</strong> {task.assignee?.username || '—'}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Paper>

            <TaskDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
                initialData={editingTask}
            />
        </Container>
    );
}

export default Tasks;
