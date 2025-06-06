import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Alert
} from '@mui/material';
import { postProject, updateProject } from '../utils/api';

function AddProjectButton({ onProjectAdded, editingProject, open, setOpen }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    useEffect(() => {
        if (open && editingProject) {
            setTitle(editingProject.title || '');
            setDescription(editingProject.description || '');
        } else if (open) {
            setTitle('');
            setDescription('');
        }
        setFieldErrors({});
        setGeneralError('');
    }, [open, editingProject]);

    const handleClose = () => {
        setFieldErrors({});
        setGeneralError('');
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const data = { title, description };
            let result;
            if (editingProject) {
                result = await updateProject(editingProject.id, data);
            } else {
                result = await postProject(data);
            }
            if (onProjectAdded) onProjectAdded(result);
            handleClose();
        } catch (error) {
            if (error.response && error.response.data) {
                const data = error.response.data;
                const errors = {};
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
            console.error(error);
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                {editingProject ? 'Edit project' : 'Add project'}
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogContent>
                    {generalError && (
                        <Box mb={2}>
                            <Alert severity="error">{generalError}</Alert>
                        </Box>
                    )}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!!fieldErrors.title}
                        helperText={fieldErrors.title}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={12}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!fieldErrors.description}
                        helperText={fieldErrors.description}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingProject ? 'Save' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddProjectButton;
