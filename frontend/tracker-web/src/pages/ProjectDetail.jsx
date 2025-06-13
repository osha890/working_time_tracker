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
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { retrieveMyProject, retrieveProject, takeTask } from '../utils/api';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../UserContext';


const getUniqueValues = (tasks, field, nestedField = null) => {
    const values = tasks.map(task => {
        if (!nestedField) return task[field];
        if (task[field]) return task[field][nestedField];
        return null;
    });
    return [...new Set(values.filter(Boolean))];
};

function ProjectDetail() {
    const { projectId } = useParams();
    const { user } = useUser();

    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [statusFilter, setStatusFilter] = useState('');
    const [reporterFilter, setReporterFilter] = useState('');
    const [project, setProject] = useState(null);

    const loadProject = async () => {
        try {
            const data = projectId
                ? await retrieveProject(projectId)
                : await retrieveMyProject();
            setProject(data);
        } catch (error) {
            console.error('Failed to load project:', error.response || error.message || error);
        }
    };

    useEffect(() => {
        loadProject();
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

    if (!project) return null;

    const tasks = project.tasks || [];

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
        title: {
            width: '35%',
            minWidth: 180,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        status: { width: '15%', minWidth: 80, textAlign: 'left' },
        created_at: { width: '15%', minWidth: 140, textAlign: 'left' },
        button: { width: '10%', minWidth: 120, textAlign: 'left', ml: 3 }
    };

    return (
        <Container sx={{ width: '90%', maxWidth: 1200, mt: 4 }}>
            <Box mb={3}>
                <Typography variant="h4" fontWeight={700} color="primary.dark">{project.title}</Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                    {project.description || 'No description provided.'}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    Created at: {new Date(project.created_at).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ borderRadius: 2, backgroundColor: 'background.paper', boxShadow: '0 2px 5px rgb(0 0 0 / 0.05)' }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {getUniqueStatusPairs(tasks).map(({ value, label }) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
                    <InputLabel>Reporter</InputLabel>
                    <Select
                        value={reporterFilter}
                        label="Reporter"
                        onChange={(e) => setReporterFilter(e.target.value)}
                        sx={{ borderRadius: 2, backgroundColor: 'background.paper', boxShadow: '0 2px 5px rgb(0 0 0 / 0.05)' }}
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

            <Box display="flex" alignItems="center" fontWeight="bold" fontSize="1.1rem" px={3} py={1.5} bgcolor="grey.100" borderRadius={2} mb={1}>
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
                <Typography sx={{ ...columnStyles.title, fontWeight: 600, pr: 1 }}>Title</Typography>
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
                <Box sx={{ flexGrow: 1 }} />
            </Box>

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
                            <Typography
                                component={Link}
                                to={`/tasks/${task.id}`}
                                sx={{
                                    ...columnStyles.title,
                                    textDecoration: 'none',
                                    color: 'primary.main',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                                title={task.title}
                                noWrap
                            >
                                {task.title}
                            </Typography>
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

                            {task.assignee === null && user && user.is_staff === false && (
                                <Box sx={columnStyles.button}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await takeTask(task.id);
                                                await loadProject();
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
                    <AccordionDetails sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', borderRadius: '0 0 12px 12px' }}>
                        <Typography paragraph><strong>Description:</strong> {task.description || '—'}</Typography>
                        <Typography><strong>Reporter:</strong> {task.reporter?.username || '—'}</Typography>
                        <Typography><strong>Assignee:</strong> {task.assignee?.username || '—'}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}

export default ProjectDetail;
