import React, { useState } from "react";
import { Logout } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Sidebar from "./Sidebar";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
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
            onClick={toggleDrawer(true)} // При клике откроем Drawer
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            Working Time Tracker
          </Typography>
          <IconButton color="inherit">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Передаем состояние и колбек в Sidebar */}
      <Sidebar open={drawerOpen} onClose={toggleDrawer(false)} />
    </>
  );
}

export default Header;
