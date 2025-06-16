import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Box, Alert, IconButton, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateProject } from '../utils/api';

function EditProjectButton({ project, onProjectUpdated }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    useEffect(() => {
        if (open && project) {
            setTitle(project.title);
            setDescription(project.description);
        }
    }, [open, project]);

    const handleClose = () => {
        setOpen(false);
        setFieldErrors({});
        setGeneralError('');
    };

    const handleSubmit = async () => {
        try {
            const result = await updateProject(project.id, { title, description });
            if (onProjectUpdated) onProjectUpdated(result);
            handleClose();
        } catch (error) {
            const data = error.response?.data;
            const errors = {};
            if (data) {
                Object.keys(data).forEach(key => {
                    if (Array.isArray(data[key])) {
                        errors[key] = data[key].join(' ');
                    }
                });
                setFieldErrors(errors);
                if (typeof data.detail === 'string') {
                    setGeneralError(data.detail);
                }
            } else {
                setGeneralError(error.message || 'Failed to update project');
            }
        }
    };

    return (
        <>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                }}
                size="small"
                color="primary"
                sx={{ borderRadius: 2 }}
            >
                <EditIcon fontSize="small" />
            </IconButton>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" onClick={(e) => e.stopPropagation()}>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
                    {generalError && (
                        <Box mb={2}><Alert severity="error">{generalError}</Alert></Box>
                    )}
                    <TextField
                        autoFocus margin="dense" label="Title" fullWidth
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        error={!!fieldErrors.title} helperText={fieldErrors.title}
                    />
                    <TextField
                        margin="dense" label="Description" fullWidth multiline rows={12}
                        value={description} onChange={(e) => setDescription(e.target.value)}
                        error={!!fieldErrors.description} helperText={fieldErrors.description}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EditProjectButton;
