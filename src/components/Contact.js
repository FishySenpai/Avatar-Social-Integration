import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Email',
      details: 'support@avatarsocial.com',
      subtitle: 'We reply within 24 hours',
      color: '#667eea',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri 9am-6pm EST',
      color: '#764ba2',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40 }} />,
      title: 'Office',
      details: 'San Francisco, CA',
      subtitle: 'United States',
      color: '#f093fb',
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
              Get in Touch
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: '700px', mx: 'auto' }}
            >
              Have a question or need help? We're here for you!
            </Typography>
          </Box>
        </motion.div>

        {/* Contact Info Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} md={4} key={index}>
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
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        bgcolor: info.color,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        color: 'white',
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Typography variant="h5" fontWeight="bold" mb={1}>
                      {info.title}
                    </Typography>
                    <Typography variant="h6" color="primary" mb={1}>
                      {info.details}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {info.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" mb={3}>
                  Send us a Message
                </Typography>
                
                {submitted && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<SendIcon />}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Typography variant="h4" fontWeight="bold" mb={3}>
                  Why Contact Us?
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    💬 Quick Support
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Get fast responses from our dedicated support team available 24/7.
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    🎯 Custom Solutions
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Need a custom integration or enterprise solution? We're here to help.
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    🤝 Partnership Opportunities
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Interested in partnering with Avatar Social? Let's talk!
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    📚 Training & Onboarding
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Need help getting started? We offer comprehensive training and onboarding.
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Paper elevation={0} sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" mb={2}>
                Frequently Asked Questions
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Visit our Help Center for instant answers to common questions
              </Typography>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5568d3',
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                Visit Help Center
              </Button>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;


