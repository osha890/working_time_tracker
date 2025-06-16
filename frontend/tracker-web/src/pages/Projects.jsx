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
    TextField,
    Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchProjects, deleteProject } from '../utils/api';
import AddProjectButton from '../components/AddProjectButton';
import EditProjectButton from '../components/EditProjectButton';

function Projects() {
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects();
                setProjects(data);
            } catch (error) {
                console.error('Failed to load projects', error);
            }
        };

        loadProjects();
    }, []);

    const handleProjectAdded = (newProject) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
    };

    const handleProjectUpdated = (updatedProject) => {
        setProjects((prevProjects) =>
            prevProjects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
        );
    };

    const toggleSortOrder = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedProjects = [...filteredProjects].sort((a, b) => {
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

    const arrow = (field) => {
        if (sortField !== field) return '';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const columnStyles = {
        id: { minWidth: 90, textAlign: 'left', fontWeight: 600, color: '#1976d2' },
        title: { minWidth: 420, textAlign: 'left', fontWeight: 600 },
        created_at: { minWidth: 160, textAlign: 'left', color: '#666666' },
        actions: { width: 110, textAlign: 'right', color: '#666666' },
    };

    return (
        <Container sx={{ width: '90%', maxWidth: '1200px', mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={700} color="primary.dark">
                    Projects
                </Typography>
                <AddProjectButton onProjectAdded={handleProjectAdded} />
            </Box>

            <Box
                display="flex"
                alignItems="center"
                fontWeight="bold"
                fontSize="1.1rem"
                px={3}
                py={1.5}
                bgcolor="grey.100"
                borderRadius={3}
                mb={1}
            >
                <Button
                    onClick={() => toggleSortOrder('id')}
                    size="small"
                    sx={{
                        minWidth: 90,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'text.primary',
                        '&:hover': { backgroundColor: 'transparent' },
                        ...columnStyles.id,
                    }}
                >
                    ID {arrow('id')}
                </Button>

                <TextField
                    label="Search by title"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        minWidth: 320,
                        maxWidth: 400,
                        mx: 2,
                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        flexGrow: 1,
                    }}
                />

                <Button
                    onClick={() => toggleSortOrder('created_at')}
                    size="small"
                    sx={{
                        minWidth: 160,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'text.primary',
                        '&:hover': { backgroundColor: 'transparent' },
                        ...columnStyles.created_at,
                    }}
                >
                    Created at {arrow('created_at')}
                </Button>

                <Box sx={{ width: 400, textAlign: 'right', fontWeight: 600, mr: 3 }}>Actions</Box>
            </Box>

            <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {sortedProjects.map((project) => (
                    <Accordion
                        key={project.id}
                        sx={{
                            '&:before': { display: 'none' },
                            boxShadow: 'none',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&.Mui-expanded': { margin: 'auto' },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                px: 3,
                                py: 1.5,
                                '&:hover': { bgcolor: 'action.hover' },
                                cursor: 'pointer',
                                '& .MuiAccordionSummary-content': {
                                    margin: 0,
                                    alignItems: 'center',
                                    width: '100%',
                                    display: 'flex',
                                    gap: 2,
                                },
                            }}
                        >
                            <Typography sx={{ ...columnStyles.id, fontWeight: 500 }}>{project.id}</Typography>
                            <Typography sx={{ ...columnStyles.title, fontWeight: 500 }} title={project.title} noWrap>
                                {project.title}
                            </Typography>
                            <Typography sx={{ ...columnStyles.created_at, color: 'text.secondary' }} noWrap>
                                {new Date(project.created_at).toLocaleString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ ml: 'auto', width: 110, justifyContent: 'flex-end' }}>
                                <EditProjectButton
                                    project={project}
                                    onProjectUpdated={handleProjectUpdated}
                                />
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Are you sure you want to delete this project?')) {
                                            try {
                                                await deleteProject(project.id);
                                                setProjects((prev) => prev.filter((p) => p.id !== project.id));
                                            } catch (error) {
                                                console.error('Failed to delete project', error);
                                            }
                                        }
                                    }}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </AccordionSummary>

                        <AccordionDetails
                            sx={{
                                px: 3,
                                py: 2,
                                bgcolor: 'grey.50',
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '0 0 12px 12px',
                                fontStyle: 'italic',
                                color: 'text.secondary',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {project.description || 'No description provided.'}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Paper>
        </Container>
    );
}

export default Projects;
