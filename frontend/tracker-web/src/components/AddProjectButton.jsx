import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { postProjects, updateProject } from '../utils/api';

function AddProjectButton({ onProjectAdded, editingProject, open, setOpen }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (open && editingProject) {
            setTitle(editingProject.title || '');
            setDescription(editingProject.description || '');
        } else if (open) {
            setTitle('');
            setDescription('');
        }
    }, [open, editingProject]);

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        try {
            const data = { title, description };
            let result;
            if (editingProject) {
                result = await updateProject(editingProject.id, data);
            } else {
                result = await postProjects(data);
            }
            if (onProjectAdded) onProjectAdded(result);
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {/* Кнопка Add project всегда видна */}
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Add project
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={12}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
