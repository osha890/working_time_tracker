import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
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

export default function Sidebar({ open, onClose }) {
    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
            <List subheader={<ListSubheader>User navigation</ListSubheader>}>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/project_tasks">
                        <ListItemIcon><ListAltIcon /></ListItemIcon>
                        <ListItemText primary="Project tasks" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/my_tasks">
                        <ListItemIcon><TaskIcon /></ListItemIcon>
                        <ListItemText primary="My tasks" />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />

            <List subheader={<ListSubheader>Admin navigation</ListSubheader>}>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/projects">
                        <ListItemIcon><ViewStreamIcon /></ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/tasks">
                        <ListItemIcon><TaskIcon /></ListItemIcon>
                        <ListItemText primary="All tasks" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/users">
                        <ListItemIcon><GroupIcon /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/tracks">
                        <ListItemIcon><TimelineIcon /></ListItemIcon>
                        <ListItemText primary="Tracks" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary="Reports" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Drawer open={open} onClose={onClose}>
            {DrawerList}
        </Drawer>
    );
}
