import React, { useState } from 'react';
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

const sampleTasks = [
    {
        id: 1,
        title: 'Fix login bug',
        project: 'Website Redesign',
        status: 'Open',
        created_at: '2025-06-01',
        description: 'Login button does not work on mobile devices.',
        reporter: 'Alice',
        assignee: 'Bob'
    },
    {
        id: 2,
        title: 'Add dark mode',
        project: 'Website Redesign',
        status: 'In Progress',
        created_at: '2025-06-02',
        description: 'Implement dark mode using Material UI theming.',
        reporter: 'Bob',
        assignee: 'Charlie'
    },
    {
        id: 3,
        title: 'Update dependencies',
        project: 'Admin Panel',
        status: 'Done',
        created_at: '2025-05-30',
        description: 'Upgrade all npm packages to latest stable versions.',
        reporter: 'Charlie',
        assignee: 'Alice'
    },
];

const getUniqueValues = (tasks, field) => {
    return [...new Set(tasks.map((task) => task[field]))];
};

function TaskList() {
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [projectFilter, setProjectFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [reporterFilter, setReporterFilter] = useState('');
    const [assigneeFilter, setAssigneeFilter] = useState('');

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

    const filteredTasks = sampleTasks.filter(task => {
        return (
            (!projectFilter || task.project === projectFilter) &&
            (!statusFilter || task.status === statusFilter) &&
            (!reporterFilter || task.reporter === reporterFilter) &&
            (!assigneeFilter || task.assignee === assigneeFilter)
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
                        {getUniqueValues(sampleTasks, 'project').map(project => (
                            <MenuItem key={project} value={project}>{project}</MenuItem>
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
                        {getUniqueValues(sampleTasks, 'status').map(status => (
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
                        {getUniqueValues(sampleTasks, 'reporter').map(reporter => (
                            <MenuItem key={reporter} value={reporter}>{reporter}</MenuItem>
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
                        {getUniqueValues(sampleTasks, 'assignee').map(assignee => (
                            <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
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
                            <Typography sx={columnStyles.project} title={task.project}>{task.project}</Typography>
                            <Typography sx={columnStyles.status}>{task.status}</Typography>
                            <Typography sx={columnStyles.created_at}>{task.created_at}</Typography>
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
                        <Typography><strong>Reporter:</strong> {task.reporter}</Typography>
                        <Typography><strong>Assignee:</strong> {task.assignee}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}

export default TaskList;
