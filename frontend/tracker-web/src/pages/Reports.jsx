import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Autocomplete,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Stack,
} from '@mui/material';
import { fetchStatuses, fetchUsers, fetchReport } from '../utils/api';

const BASE_URL = 'http://127.0.0.1:8000/api';; // замените на реальный URL

// fetch функции (можно адаптировать под axios или fetch)
// async function fetchStatuses() {
//     const res = await fetch(`${BASE_URL}/statuses/`);
//     return res.json();
// }

// async function fetchUsers() {
//     const res = await fetch(`${BASE_URL}/users/`);
//     return res.json();
// }

// async function fetchReport(payload) {
//     const res = await fetch(`${BASE_URL}/reports/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//     });
//     return res.json();
// }

export default function ReportPage() {
    const [statuses, setStatuses] = useState([]);
    const [users, setUsers] = useState([]);

    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    // Загрузка данных для фильтров при монтировании
    useEffect(() => {
        fetchStatuses().then(setStatuses);
        fetchUsers().then(setUsers);
    }, []);

    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);

        // Формируем тело запроса согласно сериализатору
        const payload = {
            statuses: selectedStatuses.map((s) => s.key),
            user_ids: selectedUsers.map((u) => u.id),
            aggregate_total: false,  // если нужно, можно сделать UI для этого флага
        };

        try {
            const data = await fetchReport(payload);
            console.log("Report data:", data); // <--- вот тут добавь
            setReport(data);
        } catch (e) {
            setError('Ошибка при загрузке отчета');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2}>Формирование отчета по задачам</Typography>

            <Stack spacing={2} maxWidth={500} mb={3}>
                <Autocomplete
                    multiple
                    options={statuses}
                    getOptionLabel={(option) => option.label}
                    value={selectedStatuses}
                    onChange={(event, newValue) => setSelectedStatuses(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Статусы" placeholder="Выберите статусы" />
                    )}
                />

                <Autocomplete
                    multiple
                    options={users}
                    getOptionLabel={(option) => option.username}
                    value={selectedUsers}
                    onChange={(event, newValue) => setSelectedUsers(newValue)}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.username} ({option.extension?.project_title})
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Пользователи" placeholder="Выберите пользователей" />
                    )}
                />

                <Button variant="contained" onClick={handleGenerateReport} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Сформировать отчет'}
                </Button>

                {error && <Typography color="error">{error}</Typography>}
            </Stack>

            {report && (
                <Box>
                    {report.length === 0 ? (
                        <Typography>Нет данных для отображения.</Typography>
                    ) : (
                        report.map(({ user, tasks }) => (
                            <Box key={user.id} mb={4}>
                                <Typography variant="h6">{user.username}</Typography>
                                <List>
                                    {tasks.map(({ task, statuses }) => (
                                        <Box key={task.id} mb={2} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
                                            <Typography variant="subtitle1">{task.title}</Typography>
                                            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                                {statuses.map(({ status, total_time }) => {
                                                    // Найдём label для статуса
                                                    const label = statusesListLabel(statuses, status);
                                                    return (
                                                        <Chip
                                                            key={status}
                                                            label={`${label || status}: ${total_time}`}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    ))}
                                </List>
                                <Divider />
                            </Box>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
}

// Вспомогательная функция для отображения label статуса по ключу
function statusesListLabel(statuses, key) {
    const found = statuses.find((s) => s.key === key);
    return found ? found.label : null;
}
