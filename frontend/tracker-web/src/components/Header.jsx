import React, { useState } from "react";
import { Logout } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar, Typography, Box } from "@mui/material";
import Sidebar from "./Sidebar";
import { logout } from "../utils/auth";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            Working Time Tracker
          </Typography>

          {user && (
            <Box sx={{ mr: 2 }}>
              <Typography variant="h6" component="span">
                Hello, {user.username}
              </Typography>
            </Box>
          )}

          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar open={drawerOpen} onClose={toggleDrawer(false)} />
    </>
  );
}

export default Header;
