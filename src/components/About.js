import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Security as SecurityIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';

const About = () => {
  const values = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Security First',
      description: 'Enterprise-grade security with Firebase authentication and bank-level encryption.',
      color: '#667eea',
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
      title: 'AI-Powered',
      description: 'Cutting-edge artificial intelligence for content generation and voice cloning.',
      color: '#764ba2',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Optimized performance to handle all your social media needs in real-time.',
      color: '#f093fb',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'User-Centric',
      description: 'Designed with you in mind, beautiful UI and seamless user experience.',
      color: '#4facfe',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Growth Focused',
      description: 'Advanced analytics and insights to help you grow your social media presence.',
      color: '#43e97b',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40 }} />,
      title: 'Cloud-Based',
      description: 'Access your content and manage your accounts from anywhere, anytime.',
      color: '#fa709a',
    },
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Michael Brown',
      role: 'Head of AI',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Emily Davis',
      role: 'Head of Design',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About Avatar Social
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: '800px', mx: 'auto', mb: 2 }}
            >
              The Most Advanced Social Media Management Platform
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.1rem', lineHeight: 1.8 }}
            >
              Powered by cutting-edge AI technology and secured by Firebase, Avatar Social 
              is revolutionizing how creators, businesses, and influencers manage their 
              social media presence.
            </Typography>
          </Box>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              mb: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <Typography variant="h3" fontWeight="bold" mb={3} textAlign="center">
              Our Mission
            </Typography>
            <Typography variant="h6" textAlign="center" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.8 }}>
              To empower creators and businesses with intelligent tools that make social media 
              management effortless, secure, and incredibly powerful. We believe in combining 
              the best of AI technology with human creativity to unlock unlimited potential.
            </Typography>
          </Paper>
        </motion.div>

        {/* Values Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" mb={6}>
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
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
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          bgcolor: value.color,
                          width: 70,
                          height: 70,
                          mb: 3,
                        }}
                      >
                        {value.icon}
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold" mb={2}>
                        {value.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" mb={2}>
            Meet Our Team
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" mb={6}>
            Passionate professionals dedicated to your success
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      borderRadius: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                      />
                      <Typography variant="h6" fontWeight="bold" mb={1}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Paper elevation={0} sx={{ p: 6, borderRadius: 3 }}>
            <Typography variant="h3" fontWeight="bold" textAlign="center" mb={6}>
              Our Impact
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
                    10K+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
                    50K+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Content Generated
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
                    99.9%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Uptime
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
                    150+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Countries
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;


