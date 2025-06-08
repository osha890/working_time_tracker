// components/TaskItem.jsx
import React from 'react';
import {
    Paper,
    Stack,
    Typography,
    List,
} from '@mui/material';
import { Assignment, AccessTime } from '@mui/icons-material';

export default function TaskItem({ task, statuses, getStatusLabel, formatDuration }) {
    return (
        <Paper
            key={task.id}
            elevation={1}
            sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: '#e3f2fd',
                },
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Assignment color="action" />
                <Typography variant="subtitle1" fontWeight="600">
                    {task.title}
                </Typography>
            </Stack>

            <List disablePadding>
                {statuses.map(({ status, total_time }) => (
                    <Stack
                        key={status}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mt={0.5}
                        sx={{
                            backgroundColor: '#e1f5fe',
                            p: 1,
                            borderRadius: 1,
                        }}
                    >
                        <AccessTime fontSize="small" color="disabled" />
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: '#0277bd' }}
                        >
                            {getStatusLabel(status)}: {formatDuration(total_time)}
                        </Typography>
                    </Stack>
                ))}
            </List>
        </Paper>
    );
}
