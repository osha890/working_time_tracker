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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchProjects, deleteProject } from '../utils/api';
import AddProjectButton from '../components/AddProjectButton';

function Projects() {
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

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
        if (editingProject) {
            setProjects((prevProjects) =>
                prevProjects.map((p) => (p.id === newProject.id ? newProject : p))
            );
        } else {
            setProjects((prevProjects) => [...prevProjects, newProject]);
        }
        setEditingProject(null);
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

    const handleEditClick = (project) => {
        setEditingProject(project);
        setDialogOpen(true);
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Projects</Typography>
                <AddProjectButton
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    editingProject={editingProject}
                    setEditingProject={setEditingProject}
                    onProjectAdded={handleProjectAdded}
                />
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ fontWeight: 'bold', fontSize: '1.2rem', mb: 1, userSelect: 'none' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 4,
                        flexGrow: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    <Button
                        onClick={() => toggleSortOrder('id')}
                        size="small"
                        sx={{ minWidth: 100, textTransform: 'none', fontSize: '1.2rem' }}
                    >
                        ID {arrow('id')}
                    </Button>

                    <TextField
                        label="Search by title"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ minWidth: 350 }}
                    />

                    <Button
                        onClick={() => toggleSortOrder('created_at')}
                        size="small"
                        sx={{ minWidth: 180, textTransform: 'none', fontSize: '1.2rem' }}
                    >
                        Created at {arrow('created_at')}
                    </Button>
                </Box>

                <Box sx={{ width: 100, textAlign: 'right', color: 'text.secondary', fontSize: '1.2rem' }}>
                    Actions
                </Box>
            </Box>

            {sortedProjects.map((project) => (
                <Accordion key={project.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                            sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.1rem' }}
                        >
                            <Box
                                component="div"
                                sx={{
                                    display: 'flex',
                                    gap: 4,
                                    flexGrow: 1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                <Typography sx={{ minWidth: 100, textAlign: 'left' }}>{project.id}</Typography>
                                <Typography sx={{ minWidth: 350, textAlign: 'left' }}>{project.title}</Typography>
                                <Typography sx={{ minWidth: 180, textAlign: 'left' }}>
                                    {new Date(project.created_at).toLocaleString('en-GB', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} sx={{ ml: 2, width: 100, justifyContent: 'flex-end' }}>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(project);
                                    }}
                                    size="small"
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Are you sure you want to delete this project?')) {
                                            try {
                                                await deleteProject(project.id);
                                                // Обновляем список, удаляя удалённый проект из состояния
                                                setProjects((prev) => prev.filter((p) => p.id !== project.id));
                                            } catch (error) {
                                                console.error('Failed to delete project', error);
                                            }
                                        }
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography sx={{ fontSize: '1rem' }}>{project.description}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}

export default Projects;
