import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider } from '@mui/material';
import { Dashboard, Person, Settings, ExitToApp, AutoAwesome } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const drawerWidth = 220;

const Sidebar = ({ mobileOpen, handleDrawerToggle, currentSection, setCurrentSection, handleLogout }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#1a237e', color: '#fff' },
      display: { xs: 'none', sm: 'block' }
    }}
    open
  >
    <Box sx={{ p: 2, textAlign: 'center', fontWeight: 'bold', fontSize: 22, letterSpacing: 1 }}>
      My Dashboard
    </Box>
    <Divider sx={{ bgcolor: '#3949ab' }} />
    <List>
      <ListItem button selected={currentSection === 'overview'} onClick={() => setCurrentSection('overview')}>
        <ListItemIcon sx={{ color: '#fff' }}><Dashboard /></ListItemIcon>
        <ListItemText primary="Overview" />
      </ListItem>
      <ListItem button selected={currentSection === 'social-media'} onClick={() => setCurrentSection('social-media')}>
        <ListItemIcon sx={{ color: '#fff' }}><FacebookIcon /></ListItemIcon>
        <ListItemText primary="Social Media" />
      </ListItem>
      <ListItem button component="a" href="/profile-settings">
        <ListItemIcon sx={{ color: '#fff' }}><Person /></ListItemIcon>
        <ListItemText primary="Avatar Profile" />
      </ListItem>
      <ListItem button selected={currentSection === 'avatar-content'} onClick={() => setCurrentSection('avatar-content')}>
        <ListItemIcon sx={{ color: '#fff' }}><AutoAwesome /></ListItemIcon>
        <ListItemText primary="Avatar Content" />
      </ListItem>
      <ListItem button component="a" href="/profile-settings">
        <ListItemIcon sx={{ color: '#fff' }}><Settings /></ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
      <ListItem button onClick={handleLogout}>
        <ListItemIcon sx={{ color: '#fff' }}><ExitToApp /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
    <Divider sx={{ bgcolor: '#3949ab', mt: 2 }} />
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
      <IconButton href="https://facebook.com" target="_blank" sx={{ color: '#fff' }}><FacebookIcon /></IconButton>
      <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#fff' }}><TwitterIcon /></IconButton>
      <IconButton href="https://instagram.com" target="_blank" sx={{ color: '#fff' }}><InstagramIcon /></IconButton>
    </Box>
  </Drawer>
);

export default Sidebar; 