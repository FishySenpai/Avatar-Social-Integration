import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '50 AI tokens/month',
        '3 social accounts',
        'Basic analytics',
        'Caption generator',
        'Post scheduling',
        'Community support',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined',
    },
    {
      name: 'Basic',
      price: '$9.99',
      period: 'per month',
      description: 'For individuals & small teams',
      features: [
        '200 AI tokens/month',
        '10 social accounts',
        'Advanced analytics',
        'All AI features',
        'Priority scheduling',
        'Email support',
        'Voice cloning (basic)',
        'Avatar generation',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'contained',
      popular: false,
    },
    {
      name: 'Premium',
      price: '$29.99',
      period: 'per month',
      description: 'For professionals & agencies',
      features: [
        '1000 AI tokens/month',
        'Unlimited accounts',
        'Premium analytics',
        'All AI features',
        'Team collaboration',
        '24/7 priority support',
        'Advanced voice cloning',
        'Custom avatars',
        'API access',
        'White-label reports',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'contained',
      popular: true,
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
            💳 Simple, Transparent Pricing
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Choose the perfect plan for your needs. Upgrade or downgrade anytime.
          </Typography>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={plan.popular ? 8 : 3}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  position: 'relative',
                  border: plan.popular ? '3px solid #667eea' : 'none',
                  transform: plan.popular ? 'scale(1.05)' : 'none',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: plan.popular ? 'scale(1.08)' : 'scale(1.03)',
                  }
                }}
              >
                {plan.popular && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: -15, 
                    right: 20,
                    background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                    color: '#fff',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}>
                    <StarIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      MOST POPULAR
                    </Typography>
                  </Box>
                )}

                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                  {plan.description}
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {plan.period}
                  </Typography>
                </Box>

                <List sx={{ mb: 3 }}>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        <CheckCircleIcon sx={{ color: '#667eea', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button 
                  fullWidth
                  variant={plan.buttonVariant}
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    py: 1.5,
                    background: plan.buttonVariant === 'contained' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'transparent',
                    borderColor: '#667eea',
                    '&:hover': {
                      background: plan.buttonVariant === 'contained'
                        ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                        : 'rgba(102, 126, 234, 0.1)',
                    }
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            All plans include 14-day free trial
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            No credit card required. Cancel anytime. Upgrade or downgrade as you need.
          </Typography>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/contact')}
            sx={{ borderColor: '#667eea', color: '#667eea' }}
          >
            Contact Sales for Enterprise
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing;

