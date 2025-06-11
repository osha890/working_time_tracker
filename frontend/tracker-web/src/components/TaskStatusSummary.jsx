import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { fetchStatuses, fetchReport } from '../utils/api';
import TaskItem from './ReportTaskItem';

const TaskStatusSummary = ({ taskId }) => {
    const [allStatuses, setAllStatuses] = useState([]);
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStatusData = async () => {
            try {
                const statusesFromAPI = await fetchStatuses();
                setAllStatuses(statusesFromAPI);

                const statusKeys = statusesFromAPI.map(s => s.key);
                const report = await fetchReport({ statuses: statusKeys });

                const taskEntry = report[0]?.tasks.find(t => t.task.id === taskId);
                setTaskStatuses(taskEntry?.statuses || []);
            } catch (error) {
                console.error('Failed to fetch report data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStatusData();
    }, [taskId]);

    const getStatusLabel = (key) => {
        const found = allStatuses.find((s) => s.key === key);
        return found ? found.label : key;
    };

    function formatDurationFromTimeString(timeStr) {
        if (typeof timeStr !== 'string') return '0s';

        const match = timeStr.match(/^(?:(\d+)\s+day(?:s)?,\s+)?(\d+):(\d+):(\d+(?:\.\d+)?)/);
        if (!match) return '0s';

        const [, dStr, hStr, mStr, sStr] = match;

        const d = parseInt(dStr || '0', 10);
        const h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        const s = Math.floor(parseFloat(sStr));

        const parts = [];
        if (d > 0) parts.push(`${d}d`);
        if (h > 0) parts.push(`${h}h`);
        if (m > 0) parts.push(`${m}m`);
        if (s > 0 || parts.length === 0) parts.push(`${s}s`);

        return parts.join(' ');
    }

    if (loading) return <CircularProgress size={20} />;

    return (
        <Box mt={2}>
            {taskStatuses.length > 0 ? (
                <TaskItem
                    task={{ id: taskId, title: 'Task' }}
                    statuses={taskStatuses}
                    getStatusLabel={getStatusLabel}
                    formatDuration={formatDurationFromTimeString}
                    compact
                />
            ) : (
                <Typography variant="body2">No status info available</Typography>
            )}
        </Box>
    );
};

export default TaskStatusSummary;
