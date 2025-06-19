import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { fetchProjects } from '../utils/api';

function TaskDialog({ open, onClose, onSubmit, initialData = null }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [project, setProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects();
                setProjects(data);
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        };
        loadProjects();
    }, []);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setProject(initialData.project?.id || '');
        } else {
            setTitle('');
            setDescription('');
            setProject('');
        }
        setErrors({});
    }, [initialData, open]);

    const handleSubmit = async () => {
        const formData = { title, description, project };
        try {
            await onSubmit(formData);
            setErrors({});
        } catch (error) {
            if (error.response?.data) {
                setErrors(error.response.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{initialData ? 'Edit Task' : 'Add Task'}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title?.[0] || ''}
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.[0] || ''}
                />
                {!initialData && (
                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.project}
                    >
                        <InputLabel>Project</InputLabel>
                        <Select
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            label="Project"
                        >
                            {projects.map((proj) => (
                                <MenuItem key={proj.id} value={proj.id}>
                                    {proj.title}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.project && (
                            <FormHelperText>{errors.project[0]}</FormHelperText>
                        )}
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {initialData ? 'Save' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TaskDialog;
