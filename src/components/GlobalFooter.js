import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const GlobalFooter = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const footerLinks = {
    product: [
      { label: 'Features', path: '/#features' },
      { label: 'Pricing', path: '/#pricing' },
      { label: 'Security', path: '/security' },
    ],
    company: [
      { label: 'About', path: '/about' },
      { label: 'Blog', path: '/' },
      { label: 'Careers', path: '/' },
      { label: 'Contact', path: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <GitHubIcon />, url: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #4c5fd5 0%, #5a3880 100%)',
        color: '#ffffff',
        pt: 4,
        pb: 2,
        mt: 4,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              🚀 Avatar Social
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)" paragraph>
              The most advanced social media management platform powered by AI and secured by Firebase.
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ fontSize: 18, mr: 1, color: '#667eea' }} />
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  support@avatarsocial.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, mr: 1, color: '#667eea' }} />
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ fontSize: 18, mr: 1, color: '#667eea' }} />
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  San Francisco, CA 94103
                </Typography>
              </Box>
            </Box>

            {/* Social Links */}
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    '&:hover': { color: '#667eea', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s',
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Product Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#ffffff">
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.product.map((link) => (
                <Link
                  key={link.label}
                  onClick={() => handleNavigation(link.path)}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#667eea', textDecoration: 'underline' },
                    transition: 'color 0.3s',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#ffffff">
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  onClick={() => handleNavigation(link.path)}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#667eea', textDecoration: 'underline' },
                    transition: 'color 0.3s',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            © {new Date().getFullYear()} Avatar Social Platform. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              onClick={() => handleNavigation('/')}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                '&:hover': { color: '#667eea' },
              }}
            >
              Privacy
            </Link>
            <Link
              onClick={() => handleNavigation('/')}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                '&:hover': { color: '#667eea' },
              }}
            >
              Terms
            </Link>
            <Link
              onClick={() => handleNavigation('/')}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                '&:hover': { color: '#667eea' },
              }}
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default GlobalFooter;

