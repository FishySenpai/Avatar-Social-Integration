import React from 'react';
import { Box, Typography, IconButton, Grid, Container, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => (
  <Box sx={{ 
    py: 4, 
    background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)', 
    color: '#fff', 
    width: '100%',
    marginTop: 'auto',
    flexShrink: 0,
    borderTop: '3px solid rgba(102, 126, 234, 0.5)',
    boxSizing: 'border-box'
  }}>
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Product Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#667eea' }}>
            Product
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <MuiLink component={Link} to="/features" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
              Features
            </MuiLink>
            <MuiLink component={Link} to="/pricing" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
              Pricing
            </MuiLink>
            <MuiLink component={Link} to="/security" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
              Security
            </MuiLink>
          </Box>
        </Grid>

        {/* Company Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#667eea' }}>
            Company
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <MuiLink component={Link} to="/about" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
              About
            </MuiLink>
            <MuiLink component={Link} to="/blog" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
              Blog
            </MuiLink>
            <MuiLink component={Link} to="/careers" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
              Careers
            </MuiLink>
            <MuiLink component={Link} to="/contact" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
              Contact
            </MuiLink>
          </Box>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#667eea' }}>
            Contact
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <EmailIcon sx={{ fontSize: '20px' }} />
            <MuiLink href="mailto:support@avatarsocial.co" sx={{ color: '#fff', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
              support@avatarsocial.co
            </MuiLink>
          </Box>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#667eea' }}>
            Follow Us
          </Typography>
          <Box>
            <IconButton href="https://facebook.com" target="_blank" sx={{ color: '#fff', '&:hover': { color: '#667eea' } }}>
              <FacebookIcon />
            </IconButton>
            <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#fff', '&:hover': { color: '#667eea' } }}>
              <TwitterIcon />
            </IconButton>
            <IconButton href="https://instagram.com" target="_blank" sx={{ color: '#fff', '&:hover': { color: '#667eea' } }}>
              <InstagramIcon />
            </IconButton>
            <IconButton href="https://linkedin.com" target="_blank" sx={{ color: '#fff', '&:hover': { color: '#667eea' } }}>
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Copyright */}
      <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} Avatar Social. All rights reserved. | AI-Powered Social Media Platform
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer; 