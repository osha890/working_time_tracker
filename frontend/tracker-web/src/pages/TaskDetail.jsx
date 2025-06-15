import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAccessibleTasks, fetchTasks } from '../utils/api';
import { Container, Typography, Box, Button, Grid, Divider, Paper } from '@mui/material';
import TaskStatusSummary from '../components/TaskStatusSummary';
import { useUser } from '../UserContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function TaskDetail() {
    const { taskId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);

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

    if (!task) return <Typography>Loading...</Typography>;

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
                <Typography variant="h4" gutterBottom>
                    Task #{task.id}: {task.title}
                </Typography>

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

            {!user.is_staff && (
                <Box mt={4}>
                    <TaskStatusSummary taskId={task.id} />
                </Box>
            )}
        </Container>
    );
}

export default TaskDetail;
