import React, { useState } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Box, Alert
} from '@mui/material';
import { postProject } from '../utils/api';

function AddProjectButton({ onProjectAdded }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setDescription('');
        setFieldErrors({});
        setGeneralError('');
    };

    const handleSubmit = async () => {
        try {
            const result = await postProject({ title, description });
            if (onProjectAdded) onProjectAdded(result);
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
                setGeneralError(error.message || 'Failed to save project');
            }
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Add Project
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Add New Project</DialogTitle>
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
                    <Button onClick={handleSubmit} variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddProjectButton;
