import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListAltIcon from '@mui/icons-material/ListAlt';
import TaskIcon from '@mui/icons-material/Task';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from 'react-router-dom';
import ListSubheader from '@mui/material/ListSubheader';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import ViewStreamIcon from '@mui/icons-material/ViewStream';

import { useUser } from '../UserContext';

export default function Sidebar({ open, onClose }) {
    const { user } = useUser();

    const userNavItems = [
        { to: "/project_tasks", icon: <ListAltIcon />, text: "Project tasks" },
        { to: "/my_tasks", icon: <TaskIcon />, text: "My tasks" },
        { to: "/reports", icon: <AssessmentIcon />, text: "Reports" },
    ];

    const adminNavItems = [
        { to: "/projects", icon: <ViewStreamIcon />, text: "Projects" },
        { to: "/tasks", icon: <TaskIcon />, text: "All tasks" },
        { to: "/users", icon: <GroupIcon />, text: "Users" },
        { to: "/tracks", icon: <TimelineIcon />, text: "Tracks" },
        { to: "/reports", icon: <AssessmentIcon />, text: "Reports" },
    ];

    const renderItems = (items) =>
        items.map(({ to, icon, text }) => (
            <ListItem disablePadding key={text}>
                <ListItemButton component={to ? Link : 'div'} to={to || undefined}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
        ));

    return (
        <Drawer open={open} onClose={onClose}>
            <Box sx={{ width: 250 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
                <List subheader={
                    <ListSubheader>
                        {user?.is_staff ? 'Admin navigation' : 'User navigation'}
                    </ListSubheader>
                }>
                    {renderItems(user?.is_staff ? adminNavItems : userNavItems)}
                </List>
            </Box>
        </Drawer>
    );
}
