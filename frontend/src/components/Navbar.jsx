import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItemText,
  Box,
  Collapse,
  ListItemButton,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 220;

const Navbar = ({ setToken, activeTab }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('user_role');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openBooks, setOpenBooks] = useState(false);

  useEffect(() => {
    if (activeTab === 'Book List' || activeTab === 'Book Borrowed') {
      setOpenBooks(true);
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate('/');
  };

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false); // close drawer on mobile
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, color: '#fff', background: '#1976d2', height: '100%', pt: isMobile ? '64px' : 0, }}>
      <List>
        <ListItemButton selected={activeTab === 'Dashboard'} onClick={() => handleNav('/dashboard')}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton onClick={() => setOpenBooks(!openBooks)}>
          <ListItemText primary="Books" />
          {openBooks ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openBooks} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} selected={activeTab === 'Book List'} onClick={() => handleNav('/booklist')}>
              <ListItemText primary="Book List" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} selected={activeTab === 'Book Borrowed'} onClick={() => handleNav('/bookborrowed')}>
              <ListItemText primary={userRole === 'librarian' ? 'Borrowed Books' : 'My Borrowed Books'} />
            </ListItemButton>
          </List>
        </Collapse>

        {userRole === 'librarian' && (
          <ListItemButton selected={activeTab === 'User List'} onClick={() => handleNav('/users')}>
            <ListItemText primary="Members" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout <LogoutIcon sx={{ ml: 1 }} />
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, marginTop: '64px' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
