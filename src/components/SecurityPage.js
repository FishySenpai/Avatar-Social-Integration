import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ShieldIcon from '@mui/icons-material/Shield';
import HttpsIcon from '@mui/icons-material/Https';

const Security = () => {
  const securityFeatures = [
    {
      icon: <LockIcon sx={{ fontSize: 60, color: '#667eea' }} />,
      title: 'End-to-End Encryption',
      description: 'All your data is encrypted with bank-level AES-256 encryption both in transit and at rest.',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 60, color: '#764ba2' }} />,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account with 2FA. Support for authenticator apps and SMS.',
    },
    {
      icon: <CloudDoneIcon sx={{ fontSize: 60, color: '#f5576c' }} />,
      title: 'Secure Cloud Storage',
      description: 'Your content is stored on enterprise-grade Firebase infrastructure with 99.99% uptime.',
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 60, color: '#667eea' }} />,
      title: 'Regular Security Audits',
      description: 'We conduct regular third-party security audits to ensure your data is always protected.',
    },
    {
      icon: <HttpsIcon sx={{ fontSize: 60, color: '#764ba2' }} />,
      title: 'HTTPS & SSL',
      description: 'All connections are secured with HTTPS and SSL certificates for maximum protection.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 60, color: '#f5576c' }} />,
      title: 'GDPR Compliant',
      description: 'Fully compliant with GDPR, CCPA, and other data protection regulations worldwide.',
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
          <SecurityIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            🔒 Your Security is Our Priority
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Enterprise-grade security to protect your content and data
          </Typography>
        </Container>
      </Box>

      {/* Security Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {securityFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 6, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              🛡️ Trusted by Thousands
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              We take security seriously. Your data is protected with the same level of security used by banks and financial institutions.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              If you have any security concerns or questions, contact us at <strong>security@avatarsocial.co</strong>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Security;
