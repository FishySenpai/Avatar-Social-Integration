import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  VpnKey as VpnKeyIcon,
  Schedule as ScheduleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Insights as BusinessInsightsIcon,
  RecordVoiceOver as VoiceIcon,
  TrendingUp as TrendingUpIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Token as TokenIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';

// Components
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import Footer from './Footer';
import DashboardCards from './DashboardCards';
import SocialMediaDashboard from './SocialMediaDashboard';
import AvatarContentGeneration from './AvatarContentGeneration';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [securitySettings, setSecuritySettings] = useState({ twoFactorEnabled: false, loginAlerts: true });
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('overview');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchProfileData = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && isMounted) {
          setProfileData(userDocSnap.data());
        }
        
        // Load security settings from localStorage
        if (isMounted) {
          const savedSettings = localStorage.getItem(`userSettings_${currentUser.uid}`);
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            if (parsed.security) {
              setSecuritySettings(parsed.security);
            }
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching profile data:', error);
          setLoading(false);
        }
      }
    };

    if (currentUser?.uid) {
      fetchProfileData();
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [currentUser, currentSection]); // Refresh when section changes to update avatar

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: theme.palette.background.default
      }}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64,
              background: theme.palette.primary.main
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
        </motion.div>
      </Box>
    );
  }

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'social-media':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <SocialMediaDashboard />
          </motion.div>
        );
      case 'avatar-content':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <AvatarContentGeneration />
          </motion.div>
        );
      case 'overview':
      default:
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <Box sx={{ p: { xs: 1, md: 3 } }}>
              {/* Welcome Card */}
              <Card sx={{ 
                borderRadius: 4, 
                boxShadow: 3,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(63,81,181,0.1) 0%, rgba(171,71,188,0.1) 100%)'
              }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    flexDirection: isMobile ? 'column' : 'row',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    <Avatar 
                      src={profileData?.photoURL || currentUser?.photoURL || ''} 
                      alt={currentUser?.displayName || 'User'}
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mr: isMobile ? 0 : 3,
                        mb: isMobile ? 2 : 0,
                        border: '3px solid',
                        borderColor: 'primary.main'
                      }}
                    >
                      {currentUser?.displayName?.[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        Welcome back, {currentUser?.displayName || 'User'}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Dashboard Cards */}
              <DashboardCards />

              {/* Quick Actions Section - COMMENTED OUT (duplicates module cards above) */}
              {/* <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ y: -5 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-5px)'
                        },
                      }}
                      onClick={() => handleNavigation('/post-scheduling')}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ScheduleIcon sx={{ 
                            fontSize: 40, 
                            mr: 2, 
                            color: 'primary.main',
                            background: 'rgba(63,81,181,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }} />
                          <Typography variant="h6" component="h2">
                            Post Scheduling
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Automate your social media posts with smart scheduling and content calendar.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label="New Feature"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ y: -5 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-5px)'
                        },
                      }}
                      onClick={() => handleNavigation('/token-subscription')}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WorkspacePremiumIcon sx={{ 
                            fontSize: 40, 
                            mr: 2, 
                            color: 'secondary.main',
                            background: 'rgba(171,71,188,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }} />
                          <Typography variant="h6" component="h2">
                            Token-Based Subscription
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Manage your plan, tokens, and auto-renewal.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            icon={<TokenIcon />}
                            label="View Status"
                            color="secondary"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleNavigation('/token-subscription')}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ y: -5 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-5px)'
                        },
                      }}
                      onClick={() => handleNavigation('/engagement-trend-analysis')}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TrendingUpIcon sx={{ 
                            fontSize: 40, 
                            mr: 2, 
                            color: 'primary.main',
                            background: 'rgba(63,81,181,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }} />
                          <Typography variant="h6" component="h2">
                            Engagement Trend Analysis
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Track engagement, analyze sentiment, and predict trends in your posts.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label="Open Module"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleNavigation('/engagement-trend-analysis')}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ y: -5 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-5px)'
                        },
                      }}
                      onClick={() => handleNavigation('/caption-generator')}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AutoAwesomeIcon sx={{ 
                            fontSize: 40, 
                            mr: 2, 
                            color: 'secondary.main',
                            background: 'rgba(171,71,188,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }} />
                          <Typography variant="h6" component="h2">
                            Caption Generator
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Generate engaging captions and hashtags with AI-powered suggestions.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label="AI-Powered"
                            color="secondary"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ y: -5 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-5px)'
                        },
                      }}
                      onClick={() => window.location.href = '/profile-settings'}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PersonIcon sx={{ 
                            fontSize: 40, 
                            mr: 2, 
                            color: 'success.main',
                            background: 'rgba(76,175,80,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }} />
                          <Typography variant="h6" component="h2">
                            Avatar Profile
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Customize your digital avatar and personality traits.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label="Customizable"
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ y: -5 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-5px)'
                        },
                      }}
                      onClick={() => handleNavigation('/business-insights')}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <BusinessInsightsIcon sx={{ 
                            fontSize: 40, 
                            mr: 2, 
                            color: 'info.main',
                            background: 'rgba(33,150,243,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }} />
                          <Typography variant="h6" component="h2">
                            Business Insights
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Access analytics, engagement metrics, audience analysis, and more.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label="Analytics"
                            color="info"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ y: -5 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-5px)'
                        },
                      }}
                      onClick={() => handleNavigation('/voice-cloning')}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <VoiceIcon sx={{ 
                            fontSize: 40, 
                            mr: 2, 
                            color: 'warning.main',
                            background: 'rgba(255,152,0,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }} />
                          <Typography variant="h6" component="h2">
                            Voice Cloning
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Clone voices and sync lip movements with AI-powered voice cloning technology.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label="AI Voice"
                            color="warning"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label="New"
                            color="error"
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ y: -5 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-5px)'
                        },
                      }}
                      onClick={() => setCurrentSection('avatar-content')}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AutoAwesomeIcon sx={{ 
                            fontSize: 40, 
                            mr: 2, 
                            color: 'info.main',
                            background: 'rgba(33,150,243,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }} />
                          <Typography variant="h6" component="h2">
                            Avatar Content Generation
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Generate AI images, videos, scripts, and captions for your avatar content.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label="AI Content"
                            color="info"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label="Module 8"
                            color="success"
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              </Grid> */}

              {/* Profile Summary Section */}
              <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                Your Profile Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                      Personal Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Email"
                          secondary={currentUser?.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Role"
                          secondary={profileData?.role || 'Basic User'}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                      Security Status
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SecurityIcon color={currentUser?.emailVerified ? "success" : "error"} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Email Verification"
                          secondary={currentUser?.emailVerified ? "Verified" : "Not Verified"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <VpnKeyIcon color={securitySettings.twoFactorEnabled ? "success" : "warning"} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="2FA Status"
                          secondary={securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        );
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: theme.palette.background.default
    }}>
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        handleLogout={handleLogout}
      />
      
      <Box sx={{ 
        flexGrow: 1, 
        ml: { sm: '220px', xs: '0' }, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <HeaderBar 
          currentUser={currentUser} 
          handleLogout={handleLogout}
        />
        
        <Box component="main" sx={{ 
          flexGrow: 1, 
          pt: 8, 
          pb: 8, 
          px: { xs: 2, md: 4 },
          background: theme.palette.background.default,
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: '80px' // Space for footer
        }}>
          {renderContent()}
        </Box>
        
        <Box sx={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;