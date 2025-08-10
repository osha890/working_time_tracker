import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAccessibleTasks, fetchTasks, updateTask } from '../utils/api';
import { Container, Typography, Box, Button, Grid, Divider, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TaskStatusSummary from '../components/TaskStatusSummary';
import { useUser } from '../UserContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TaskDialog from '../components/TaskDialog';
import EditIcon from '@mui/icons-material/Edit';
import { fetchStatuses, changeStatus } from '../utils/api';

function TaskDetail() {
    const { taskId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        const loadTask = async () => {
            try {
                let data;
                if (user?.is_staff) {
                    data = await fetchTasks();
                } else {
                    data = await fetchAccessibleTasks();
                }
                const foundTask = data.find(t => t.id === parseInt(taskId));
                setTask(foundTask);
            } catch (error) {
                console.error('Failed to load task:', error);
            }
        };
        loadTask();
    }, [taskId, user]);

    useEffect(() => {
        const loadStatuses = async () => {
            try {
                const data = await fetchStatuses();
                setStatuses(data);
            } catch (error) {
                console.error('Failed to load statuses:', error);
            }
        };
        loadStatuses();
    }, []);

    if (!task) return <Typography>Loading...</Typography>;

    const handleEditClick = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogSubmit = async (formData) => {
        try {
            const updatedData = {
                ...formData,
                project: formData.project ?? task.project?.id,
            };

            await updateTask(task.id, updatedData);

            setTask(prev => ({
                ...prev,
                ...formData,
                project: prev.project,
            }));

            setDialogOpen(false);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await changeStatus(task.id, newStatus);
            setTask(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">
                        Task #{task.id}: {task.title}
                    </Typography>

                    {user?.is_staff ? (
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEditClick}
                        >
                            Edit Task
                        </Button>
                    ) : user?.username === task.assignee?.username ? (
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={task.status}
                                onChange={handleStatusChange}
                                label="Status"
                            >
                                {statuses.map(({ key, label }) => (
                                    <MenuItem key={key} value={key}>{label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : null}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">Project</Typography>
                        <Typography>{task.project?.title || '—'}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">Created At</Typography>
                        <Typography>
                            {new Date(task.created_at).toLocaleString('en-GB', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="text.secondary">Description</Typography>
                        <Typography>{task.description || '—'}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">Reporter</Typography>
                        <Typography>{task.reporter?.username || '—'}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">Assignee</Typography>
                        <Typography>{task.assignee?.username || '—'}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <TaskDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
                initialData={task}
            />

            {!user.is_staff && (
                <Box mt={4}>
                    <TaskStatusSummary taskId={task.id} />
                </Box>
            )}
        </Container>
    );
}

export default TaskDetail;
