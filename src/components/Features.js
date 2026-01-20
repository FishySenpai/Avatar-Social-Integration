import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ImageIcon from '@mui/icons-material/Image';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 50, color: '#667eea' }} />,
      title: 'AI-Powered Content Generation',
      description: 'Create engaging captions, hashtags, and posts with our advanced AI engine. Get multiple variations optimized for each platform.',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 50, color: '#764ba2' }} />,
      title: 'Smart Post Scheduling',
      description: 'AI calculates the best times to post on each platform. Schedule weeks in advance with our intelligent automation.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 50, color: '#f5576c' }} />,
      title: 'Advanced Analytics',
      description: 'Track engagement, reach, and performance across all platforms. Get actionable insights powered by AI.',
    },
    {
      icon: <PersonIcon sx={{ fontSize: 50, color: '#667eea' }} />,
      title: 'Avatar & Persona Management',
      description: 'Create and customize digital avatars with unique personalities, voices, and motion capture capabilities.',
    },
    {
      icon: <RecordVoiceOverIcon sx={{ fontSize: 50, color: '#764ba2' }} />,
      title: 'Voice Cloning',
      description: 'Clone voices with AI. Create authentic voice-overs for your content with multiple voice profiles.',
    },
    {
      icon: <ImageIcon sx={{ fontSize: 50, color: '#f5576c' }} />,
      title: 'AI Image & Video Generation',
      description: 'Generate professional images and videos for your posts. AI-powered content creation at your fingertips.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: '#667eea' }} />,
      title: 'Trend Analysis',
      description: 'Stay ahead with real-time trending topics and hashtag recommendations. AI tracks what\'s hot in your niche.',
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 50, color: '#764ba2' }} />,
      title: 'Smart Notifications',
      description: 'Get alerted about important engagement, mentions, and performance milestones. Never miss an opportunity.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: '#f5576c' }} />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, 2FA, and secure data handling. Your content and data are always protected.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: '#fff', 
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            🚀 Powerful Features
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
            Everything you need to manage your social media presence with AI
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/register')}
            sx={{ 
              bgcolor: '#fff', 
              color: '#667eea',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Ready to transform your social media?
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/pricing')}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 5,
              py: 2,
              fontSize: '1.1rem',
            }}
          >
            View Pricing
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Features;

