import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Autocomplete,
    TextField,
    List,
    Divider,
    Stack,
    Checkbox,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { fetchStatuses, fetchUsers, fetchProjects, fetchReport, downloadReportXLSX } from '../utils/api';
import { AccountCircle } from '@mui/icons-material';
import TaskItem from '../components/ReportTaskItem';
import { useUser } from '../UserContext';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ReportPage() {
    const { user } = useUser();

    const [statuses, setStatuses] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);

    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [aggregate, setAggregate] = useState(false);

    useEffect(() => {
        fetchStatuses().then(setStatuses);
        if (user?.is_staff) {
            fetchProjects().then(setProjects);
            fetchUsers().then(setUsers);
        }
    }, []);

    const handleOpenDialog = () => {
        setDialogOpen(true);
        setError(null);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleGenerateReport = async (reportFormat = "json") => {
        setLoading(true);
        setError(null);

        const payload = {
            statuses: selectedStatuses.map((s) => s.key),
            user_ids: selectedUsers.map((u) => u.id),
            project_ids: selectedProjects.map((p) => p.id),
            report_format: reportFormat,
            aggregate: aggregate,
        };

        try {
            const data = await fetchReport(payload);
            setReport(data);
            setDialogOpen(false);
        } catch (e) {
            setError('Error loading report');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadXLSX = () => {
        setLoading(true);
        setError(null);

        const payload = {
            statuses: selectedStatuses.map((s) => s.key),
            user_ids: selectedUsers.map((u) => u.id),
            project_ids: selectedProjects.map((p) => p.id),
            report_format: 'xlsx',
            aggregate: aggregate,
        };

        downloadReportXLSX(
            payload,
            (errMsg) => setError(errMsg),
            () => {
                setLoading(false);
                setDialogOpen(false);
            }
        );
    };

    const getStatusLabel = (key) => {
        const found = statuses.find((s) => s.key === key);
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

    return (
        <Box p={3}>
            <Typography variant="h4" mb={4} fontWeight="bold" color="primary">
                Reports
            </Typography>

            <Button variant="contained" onClick={handleOpenDialog}>
                Generate Report
            </Button>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Report Settings</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            options={statuses}
                            getOptionLabel={(option) => option.label}
                            value={selectedStatuses}
                            onChange={(event, newValue) => setSelectedStatuses(newValue)}
                            disabled={aggregate}
                            renderOption={(props, option, { selected }) => (
                                <li {...props} key={option.key}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        sx={{ mr: 1 }}
                                        checked={selected}
                                    />
                                    {option.label}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Statuses" placeholder="Select statuses" />
                            )}
                        />



                        <Stack direction="row" alignItems="center">
                            <Checkbox
                                checked={aggregate}
                                onChange={(e) => setAggregate(e.target.checked)}
                            />
                            <Typography>Aggregate</Typography>
                        </Stack>


                        {user?.is_staff && (
                            <>
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    options={projects}
                                    getOptionLabel={(option) => option.title}
                                    value={selectedProjects}
                                    onChange={(event, newValue) => setSelectedProjects(newValue)}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props} key={option.id}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                sx={{ mr: 1 }}
                                                checked={selected}
                                            />
                                            {option.title}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Projects" placeholder="Select projects" />
                                    )}
                                />
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    options={users}
                                    getOptionLabel={(option) => option.username}
                                    value={selectedUsers}
                                    onChange={(event, newValue) => setSelectedUsers(newValue)}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props} key={option.id}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                sx={{ mr: 1 }}
                                                checked={selected}
                                            />
                                            {option.username} {option.extension?.project_title && `(${option.extension.project_title})`}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Users" placeholder="Select users" />
                                    )}
                                />
                            </>
                        )}

                        {error && (
                            <Typography color="error" fontWeight="medium" mt={1}>
                                {error}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleDownloadXLSX}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate XLSX'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleGenerateReport("json")}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate'}
                    </Button>
                </DialogActions>
            </Dialog>

            {report && (
                <Box mt={5}>
                    {report.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            No data to display.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {report.map(({ project, users }) => (
                                <Box key={project.id} sx={{ mb: 5 }}>
                                    <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
                                        Project: {project.title} (ID: {project.id})
                                    </Typography>

                                    {users.map(({ user, tasks }) => (
                                        <Paper
                                            key={user.id}
                                            elevation={3}
                                            sx={{ mb: 4, p: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}
                                        >
                                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                                <AccountCircle fontSize="large" />
                                                <Typography variant="h6" fontWeight="bold">
                                                    {user.username} (ID: {user.id})
                                                </Typography>
                                            </Stack>
                                            <Divider sx={{ mb: 3 }} />

                                            <List disablePadding>
                                                {tasks.map(({ task, statuses }) => (
                                                    <TaskItem
                                                        key={task.id}
                                                        task={task}
                                                        statuses={statuses}
                                                        getStatusLabel={getStatusLabel}
                                                        formatDuration={formatDurationFromTimeString}
                                                    />
                                                ))}
                                            </List>
                                        </Paper>
                                    ))}
                                </Box>
                            ))}
                        </List>
                    )}
                </Box>
            )}
        </Box>
    );
}
