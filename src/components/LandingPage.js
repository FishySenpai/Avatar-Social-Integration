import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Smartphone as SmartphoneIcon,
  Lock as LockIcon,
  TrendingUp as TrendingUpIcon,
  AutoAwesome as AutoAwesomeIcon,
  RecordVoiceOver as VoiceIcon,
  Dashboard as DashboardIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, 2FA, and advanced security features to keep your data safe.',
      color: '#FF6B6B',
    },
    {
      icon: <VoiceIcon sx={{ fontSize: 40 }} />,
      title: 'AI Voice Cloning',
      description: 'Clone voices and create realistic speech with cutting-edge AI technology.',
      color: '#4ECDC4',
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
      title: 'Avatar Content',
      description: 'Generate AI-powered images, videos, and scripts for your social media.',
      color: '#95E1D3',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Business Insights',
      description: 'Track engagement, analyze trends, and grow your social media presence.',
      color: '#F38181',
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      title: 'Unified Dashboard',
      description: 'Manage all your social media accounts from one beautiful dashboard.',
      color: '#AA96DA',
    },
    {
      icon: <SmartphoneIcon sx={{ fontSize: 40 }} />,
      title: 'Phone Verification',
      description: 'SMS OTP verification for enhanced account security and authentication.',
      color: '#FCBAD3',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '50K+', label: 'Content Generated' },
    { number: '24/7', label: 'Support' },
  ];

  const pricing = [
    {
      title: 'Basic',
      price: 'Free',
      features: [
        'Email Authentication',
        'Basic Avatar Customization',
        'Limited Content Generation',
        'Community Support',
        'Basic Analytics',
      ],
      buttonText: 'Get Started',
      highlighted: false,
    },
    {
      title: 'Premium',
      price: '$29/mo',
      features: [
        'All Basic Features',
        'Unlimited Content Generation',
        'Advanced AI Features',
        'Priority Support',
        'Advanced Analytics',
        'Voice Cloning',
        'Phone Verification',
      ],
      buttonText: 'Start Free Trial',
      highlighted: true,
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      features: [
        'All Premium Features',
        'Custom Integration',
        'Dedicated Account Manager',
        'SLA Guarantee',
        'Advanced Security',
        'API Access',
      ],
      buttonText: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <Box sx={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.1,
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'white',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'white',
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    mb: 3,
                  }}
                >
                  Welcome to the Future of
                  <Box component="span" sx={{ color: '#FFD93D', display: 'block' }}>
                    Social Media
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Powered by AI. Secured by Firebase. Built for You.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    mb: 5,
                    fontSize: '1.1rem',
                  }}
                >
                  Create stunning avatars, generate AI content, clone voices, and manage your social media presence all in one place.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: '#f0f0f0',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  <img
                    src="https://illustrations.popsy.co/amber/web-design.svg"
                    alt="Hero Illustration"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 'bold',
                        color: '#667eea',
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              textAlign="center"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Everything you need to succeed in social media
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          bgcolor: feature.color,
                          width: 70,
                          height: 70,
                          mb: 3,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold" mb={2}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 10, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              textAlign="center"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Choose Your Plan
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Start free, upgrade as you grow
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {pricing.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: plan.highlighted ? '3px solid #667eea' : 'none',
                      transform: plan.highlighted ? 'scale(1.05)' : 'none',
                      position: 'relative',
                    }}
                  >
                    {plan.highlighted && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -15,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: '#667eea',
                          color: 'white',
                          px: 3,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                        }}
                      >
                        MOST POPULAR
                      </Box>
                    )}
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" mb={2}>
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="primary"
                        mb={3}
                      >
                        {plan.price}
                      </Typography>
                      <Box sx={{ mb: 4, textAlign: 'left' }}>
                        {plan.features.map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: '#4CAF50', mr: 1, fontSize: 20 }}
                            />
                            <Typography variant="body1">{feature}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Button
                        variant={plan.highlighted ? 'contained' : 'outlined'}
                        fullWidth
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, background: 'linear-gradient(135deg, #4c5fd5 0%, #5a3880 100%)', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Avatar Social Platform
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                The most advanced social media management platform powered by AI and secured by Firebase.
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Product
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#667eea' } }}>
                  Features
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#667eea' } }}>
                  Pricing
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#667eea' } }}>
                  Security
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#667eea' } }}>
                  About
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#667eea' } }}>
                  Blog
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#667eea' } }}>
                  Careers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Contact
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                support@avatarsocial.com
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography variant="body2" color="rgba(255,255,255,0.5)">
              © 2025 Avatar Social Platform. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

