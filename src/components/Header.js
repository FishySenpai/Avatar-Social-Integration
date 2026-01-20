import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Fetch user profile data to get updated avatar
  useEffect(() => {
    let isMounted = true;
    
    const fetchProfileData = async () => {
      if (currentUser?.uid) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists() && isMounted) {
            setProfileData(userDocSnap.data());
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching profile data in Header:', error);
          }
        }
      }
    };

    fetchProfileData();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      handleClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
    setMobileMenuOpen(false);
  };

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactIcon /> },
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    ...(currentUser?.role === 'admin' ? [{ label: 'Admin', path: '/admin', icon: <AdminIcon /> }] : []),
  ];

  // Navigation items for public pages
  const publicNavItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactIcon /> },
  ];

  const mobileMenu = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250 }} onClick={() => setMobileMenuOpen(false)}>
        <List>
          <ListItem>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Menu
            </Typography>
          </ListItem>
          {currentUser ? (
            <>
              {authenticatedNavItems.map((item) => (
                <ListItem button key={item.path} onClick={() => handleNavigation(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
              <ListItem button onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              {publicNavItems.map((item) => (
                <ListItem button key={item.path} onClick={() => handleNavigation(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
              <ListItem button onClick={() => handleNavigation('/login')}>
                <ListItemIcon><LoginIcon /></ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => handleNavigation('/register')}>
                <ListItemIcon><RegisterIcon /></ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(135deg, #4c5fd5 0%, #5a3880 100%)',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            {isMobile && (
                <IconButton
                  onClick={() => setMobileMenuOpen(true)}
                  sx={{ mr: 2, color: '#ffffff' }}
                >
                  <MenuIcon />
                </IconButton>
            )}

            {/* Logo/Brand */}
            <Box
              onClick={() => handleNavigation(currentUser ? '/dashboard' : '/')}
              sx={{
                flexGrow: { xs: 1, md: 0 },
                cursor: 'pointer',
                mr: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src="/logo.svg"
                alt="Avatar Social Logo"
                sx={{
                  height: 45,
                  width: 45,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'block' },
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                }}
              >
                Avatar Social
              </Typography>
            </Box>

            {/* Spacer to push everything to right */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Right Side - Navigation + User Menu or Auth Buttons */}
            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Desktop Navigation - Far Right (Authenticated) */}
                {!isMobile && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {authenticatedNavItems.map((item) => (
                        <Button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          sx={{
                            color: '#ffffff',
                            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                            borderBottom: location.pathname === item.path ? '2px solid #667eea' : 'none',
                          }}
                        >
                          {item.label}
                        </Button>
                    ))}
                  </Box>
                )}
                
                {/* User Avatar & Menu */}
                {!isMobile && (
                  <Typography variant="body2" sx={{ mr: 1, color: '#ffffff' }}>
                    {currentUser.displayName || currentUser.email}
                  </Typography>
                )}
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar 
                    src={profileData?.photoURL || currentUser.photoURL} 
                    alt={currentUser.displayName}
                    sx={{ width: 40, height: 40 }}
                  >
                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    <PersonIcon sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/security')}>
                    <SecurityIcon sx={{ mr: 1 }} /> Security
                  </MenuItem>
                  {currentUser?.role === 'admin' && (
                    <MenuItem onClick={() => handleNavigation('/admin')}>
                      <AdminIcon sx={{ mr: 1 }} /> Admin
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              !isMobile && (
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  {publicNavItems.map((item) => (
                    <Button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        color: '#ffffff',
                        fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        px: 2,
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <Button
                    onClick={() => handleNavigation('/login')}
                    sx={{ 
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem',
                      px: 2,
                      fontWeight: location.pathname === '/login' ? 'bold' : 'normal',
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/register')}
                    sx={{ 
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem',
                      px: 2,
                      fontWeight: location.pathname === '/register' ? 'bold' : 'normal',
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {mobileMenu}
    </>
  );
};

export default Header;
