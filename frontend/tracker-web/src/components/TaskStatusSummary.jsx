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

                const matchingStatuses = [];

                for (const project of report) {
                    for (const user of project.users) {
                        const taskEntry = user.tasks.find(t => t.task.id === taskId);
                        if (taskEntry) {
                            for (const status of taskEntry.statuses) {
                                const existing = matchingStatuses.find(s => s.status === status.status);
                                if (existing) {
                                    existing.total_time = addDurations(existing.total_time, status.total_time);
                                } else {
                                    matchingStatuses.push({ ...status });
                                }
                            }
                        }
                    }
                }

                setTaskStatuses(matchingStatuses);
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

    function addDurations(a, b) {
        const toSeconds = (str) => {
            const match = str.match(/^(?:(\d+)\s+day(?:s)?,\s+)?(\d+):(\d+):(\d+(?:\.\d+)?)/);
            if (!match) return 0;
            const [, dStr, hStr, mStr, sStr] = match;
            const d = parseInt(dStr || '0', 10);
            const h = parseInt(hStr, 10);
            const m = parseInt(mStr, 10);
            const s = parseFloat(sStr);
            return (((d * 24 + h) * 60 + m) * 60) + s;
        };

        const totalSeconds = toSeconds(a) + toSeconds(b);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = (totalSeconds % 60).toFixed(6);

        const dayPart = days > 0 ? `${days} days, ` : '';
        return `${dayPart}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${seconds}`;
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
