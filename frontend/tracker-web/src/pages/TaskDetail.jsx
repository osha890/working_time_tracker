import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMyTasks } from '../utils/api';
import { Container, Typography, Box, Button } from '@mui/material';
import TaskStatusSummary from '../components/TaskStatusSummary';

function TaskDetail() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const loadTask = async () => {
            try {
                const data = await fetchMyTasks();
                const foundTask = data.find(t => t.id === parseInt(taskId));
                setTask(foundTask);
            } catch (error) {
                console.error('Failed to load task:', error);
            }
        };
        loadTask();
    }, [taskId]);

    if (!task) return <Typography>Loading...</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back
            </Button>

            <Typography variant="h4" gutterBottom>
                Task #{task.id}: {task.title}
            </Typography>

            <Typography><strong>Project:</strong> {task.project?.title || '—'}</Typography>
            <Typography><strong>Description:</strong> {task.description || '—'}</Typography>
            <Typography><strong>Reporter:</strong> {task.reporter?.username || '—'}</Typography>
            <Typography><strong>Created At:</strong> {new Date(task.created_at).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</Typography>

            <Box mt={4}>
                <TaskStatusSummary taskId={task.id} />
            </Box>
        </Container>
    );
}

export default TaskDetail;
