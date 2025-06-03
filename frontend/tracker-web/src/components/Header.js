import { Logout } from "@mui/icons-material"
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"

function Header() {
    return (
        <AppBar>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    component="span"
                    sx={{ flexGrow: 1 }}
                >
                    Working Time Tracker
                </Typography>
                <IconButton
                    color="inherit"
                >
                    <Logout />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header
