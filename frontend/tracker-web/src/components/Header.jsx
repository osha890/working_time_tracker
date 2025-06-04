import React, { useState } from "react";
import { Logout } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import { logout } from "../utils/auth";
import { useNavigate } from 'react-router-dom';

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

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
          <IconButton color="inherit">
            <Logout onClick={handleLogout} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar open={drawerOpen} onClose={toggleDrawer(false)} />
    </>
  );
}

export default Header;
