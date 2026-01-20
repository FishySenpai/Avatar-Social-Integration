import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const HeaderBar = ({ currentUser, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, background: 'linear-gradient(135deg, #4c5fd5 0%, #5a3880 100%)' }}>
      <Toolbar>
        <Box
          component="img"
          src="/logo.svg"
          alt="Avatar Social"
          sx={{
            height: 40,
            width: 40,
            mr: 2,
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
            },
          }}
          onClick={() => navigate('/dashboard')}
        />
        <Avatar src={currentUser?.photoURL} sx={{ mr: 2 }} />
        <Typography variant="h6">
          Welcome, {currentUser?.displayName || 'User'}
        </Typography>
        
        {/* Spacer to push navigation to right */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Navigation Links - Right Side */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Home
          </Button>
          <Button
            startIcon={<InfoIcon />}
            onClick={() => navigate('/about')}
            sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            About
          </Button>
          <Button
            startIcon={<ContactMailIcon />}
            onClick={() => navigate('/contact')}
            sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Contact
          </Button>
          
          <IconButton color="inherit" onClick={handleLogout} title="Logout" sx={{ ml: 1 }}>
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar; 