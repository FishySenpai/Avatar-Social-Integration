import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Chip } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Careers = () => {
  const openPositions = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      description: 'Join our AI team to build next-generation social media automation tools.',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote / New York',
      type: 'Full-time',
      description: 'Create beautiful, intuitive user experiences for millions of users.',
    },
    {
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build scalable web applications with React, Node.js, and Firebase.',
    },
    {
      title: 'Content Marketing Manager',
      department: 'Marketing',
      location: 'Remote / Los Angeles',
      type: 'Full-time',
      description: 'Lead our content strategy and grow our brand presence worldwide.',
    },
    {
      title: 'Customer Success Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our customers succeed with personalized support and guidance.',
    },
    {
      title: 'Data Scientist',
      department: 'Engineering',
      location: 'Remote / Boston',
      type: 'Full-time',
      description: 'Analyze user data to improve AI models and product features.',
    },
  ];

  const benefits = [
    '💰 Competitive salary & equity',
    '🏥 Health, dental & vision insurance',
    '🌴 Unlimited PTO',
    '🏠 Remote-first culture',
    '💻 Latest tech equipment',
    '📚 Learning & development budget',
    '🎯 Career growth opportunities',
    '🤝 Collaborative team environment',
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
          <WorkIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            🚀 Join Our Team
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
            Help us build the future of AI-powered social media management
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            We're looking for talented, passionate people to join our growing team
          </Typography>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Why Work With Us?
        </Typography>
        <Grid container spacing={2}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1">{benefit}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Open Positions */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Open Positions
        </Typography>
        <Grid container spacing={3}>
          {openPositions.map((position, index) => (
            <Grid item xs={12} key={index}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(10px)',
                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {position.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={position.department} 
                        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: '#667eea' }} />
                        <Typography variant="body2">{position.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 18, color: '#667eea' }} />
                        <Typography variant="body2">{position.type}</Typography>
                      </Box>
                    </Box>

                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {position.description}
                    </Typography>
                  </Box>

                  <Button 
                    variant="contained"
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      px: 4,
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Don't See Position */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 6, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Don't see the right position?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </Typography>
            <Button 
              variant="outlined"
              size="large"
              sx={{ borderColor: '#667eea', color: '#667eea' }}
            >
              Send Resume to careers@avatarsocial.co
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Careers;

