import React from 'react';
import { Container, Typography, Box, Grid, Paper, Chip, Button } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

const Blog = () => {
  const blogPosts = [
    {
      title: '10 AI-Powered Strategies to Boost Your Social Media Engagement',
      excerpt: 'Discover how artificial intelligence can transform your social media strategy and increase engagement by up to 300%.',
      author: 'Sarah Johnson',
      date: 'Oct 20, 2025',
      category: 'AI & Social Media',
      readTime: '5 min read',
    },
    {
      title: 'The Future of Avatar Technology in Digital Marketing',
      excerpt: 'Explore how digital avatars are revolutionizing brand presence and customer engagement in the modern era.',
      author: 'Mike Chen',
      date: 'Oct 18, 2025',
      category: 'Technology',
      readTime: '8 min read',
    },
    {
      title: 'Best Practices for Voice Cloning in Content Creation',
      excerpt: 'Learn the ethical and effective ways to use voice cloning technology for your content marketing campaigns.',
      author: 'Emily Davis',
      date: 'Oct 15, 2025',
      category: 'Voice Tech',
      readTime: '6 min read',
    },
    {
      title: 'How to Schedule Social Media Posts Like a Pro',
      excerpt: 'Master the art of social media scheduling with our comprehensive guide to optimal posting times and strategies.',
      author: 'David Park',
      date: 'Oct 12, 2025',
      category: 'Social Media',
      readTime: '7 min read',
    },
    {
      title: 'Analytics That Matter: Tracking ROI on Social Media',
      excerpt: 'Understand which metrics truly matter for your business and how to track them effectively.',
      author: 'Lisa Wang',
      date: 'Oct 10, 2025',
      category: 'Analytics',
      readTime: '10 min read',
    },
    {
      title: 'Creating Engaging Content with AI: A Beginner\'s Guide',
      excerpt: 'Step-by-step guide for beginners to leverage AI tools for creating compelling social media content.',
      author: 'Tom Martinez',
      date: 'Oct 8, 2025',
      category: 'AI & Content',
      readTime: '5 min read',
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
          <ArticleIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            📝 Avatar Social Blog
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Insights, tips, and strategies for modern social media management
          </Typography>
        </Container>
      </Box>

      {/* Blog Posts Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {blogPosts.map((post, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                    cursor: 'pointer',
                  }
                }}
              >
                <Chip 
                  label={post.category} 
                  sx={{ 
                    mb: 2, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    alignSelf: 'flex-start',
                  }}
                />
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {post.title}
                </Typography>
                
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>
                  {post.excerpt}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 18, color: '#667eea' }} />
                    <Typography variant="body2">{post.author}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, color: '#667eea' }} />
                    <Typography variant="body2">{post.date}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {post.readTime}
                  </Typography>
                </Box>

                <Button 
                  sx={{ mt: 2 }}
                  variant="outlined"
                  fullWidth
                >
                  Read More
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Newsletter Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 6, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              📬 Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Get the latest insights, tips, and updates delivered to your inbox weekly.
            </Typography>
            <Button 
              variant="contained"
              size="large"
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
              }}
            >
              Subscribe Now
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Blog;

