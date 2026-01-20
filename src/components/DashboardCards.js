import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Person as PersonIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Insights as InsightsIcon,
  Face as FaceIcon,
  RecordVoiceOver as VoiceIcon,
  Videocam as VideocamIcon,
  TrendingUp as TrendingUpIcon,
  Token as TokenIcon,
  Notifications as NotificationsIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const modules = [
  {
    id: 1,
    title: 'Avatar Profile Management',
    description: 'Customize your digital avatar and personality traits',
    icon: PersonIcon,
    color: '#3f51b5',
    gradient: 'linear-gradient(135deg, rgba(63,81,181,0.9) 0%, rgba(48,63,159,0.9) 100%)',
    route: '/avatar-profile-manager',
    features: [
      'Profile Customization (Name, Bio, Personality Traits)',
      'Avatar Appearance Settings',
      'Simple Bio Setup',
      'Profile Recommendations',
      'User Data Privacy Security Settings'
    ],
    status: 'active',
    badge: 'Customizable'
  },
  {
    id: 2,
    title: 'Social Media Integration',
    description: 'Connect and manage multiple social media platforms',
    icon: ShareIcon,
    color: '#e91e63',
    gradient: 'linear-gradient(135deg, rgba(233,30,99,0.9) 0%, rgba(194,24,91,0.9) 100%)',
    route: '/social-media-hub',
    features: [
      'Multi-Platform Posting',
      'Post Optimization',
      'Auto-Hashtag Generation',
      'Smart Post Preview Before Publishing',
      'Content Performance Estimation'
    ],
    status: 'active',
    badge: 'Connected'
  },
  {
    id: 3,
    title: 'Post Scheduling Automation',
    description: 'Automate your social media posts with smart scheduling',
    icon: ScheduleIcon,
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, rgba(156,39,176,0.9) 0%, rgba(123,31,162,0.9) 100%)',
    route: '/post-scheduling',
    features: [
      'Best Posting Time Prediction',
      'Multi-Platform Post Scheduling',
      'Auto-Queue for Posts',
      'Content Calendar',
      'Automated Rescheduling Based on Engagement'
    ],
    status: 'active',
    badge: 'Automated'
  },
  {
    id: 4,
    title: 'Caption Generation',
    description: 'Generate engaging captions and hashtags with AI',
    icon: AutoAwesomeIcon,
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, rgba(255,152,0,0.9) 0%, rgba(245,124,0,0.9) 100%)',
    route: '/caption-generator',
    features: [
      'Caption Hashtag Suggestions',
      'Trending Keywords Integration',
      'Auto-Generated Post Descriptions',
      'Image Video Title Generation',
      'Content Tone Adjustment (Casual, Professional, etc.)'
    ],
    status: 'active',
    badge: 'AI-Powered'
  },
  {
    id: 5,
    title: 'Business Insights',
    description: 'Access analytics, engagement metrics, and audience analysis',
    icon: InsightsIcon,
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, rgba(33,150,243,0.9) 0%, rgba(25,118,210,0.9) 100%)',
    route: '/business-insights',
    features: [
      'Analytics Dashboard',
      'Engagement Metrics Tracking',
      'Demographic-Based Audience Analysis',
      'Marketing Recommendations',
      'Competitor Performance Comparison'
    ],
    status: 'active',
    badge: 'Analytics'
  },
  {
    id: 6,
    title: 'Avatar Virtual Influencer',
    description: 'Create and customize your virtual influencer avatar',
    icon: FaceIcon,
    color: '#00bcd4',
    gradient: 'linear-gradient(135deg, rgba(0,188,212,0.9) 0%, rgba(0,151,167,0.9) 100%)',
    route: '/persona-manager',
    features: [
      'Avatar Customization (Hair, Skin, Clothes)',
      'Motion Capture for Realistic Movements',
      'Multi-Persona Avatar Management',
      'Voice Matching',
      'Avatar Predefined Poses'
    ],
    status: 'active',
    badge: 'Virtual'
  },
  {
    id: 7,
    title: 'Voice Cloning and Animation',
    description: 'Clone voices and sync lip movements with AI',
    icon: VoiceIcon,
    color: '#f44336',
    gradient: 'linear-gradient(135deg, rgba(244,67,54,0.9) 0%, rgba(211,47,47,0.9) 100%)',
    route: '/voice-cloning',
    features: [
      'Deepfake-Based Voice Cloning',
      'Lip-Syncing',
      'Emotion Detection Expression Adjustment',
      'Multi-Language Voice Synthesis',
      'Text-to-Speech (TTS) for Realistic Voiceovers'
    ],
    status: 'active',
    badge: 'AI Voice'
  },
  {
    id: 8,
    title: 'Avatar Content Generation',
    description: 'Generate AI images, videos, scripts, and captions',
    icon: VideocamIcon,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, rgba(76,175,80,0.9) 0%, rgba(56,142,60,0.9) 100%)',
    route: '/avatar-content-generation',
    features: [
      'Image Content',
      'Background Scene Customization',
      'Text-to-Video Conversion',
      'Storytelling Scripts',
      'Auto-Caption Subtitle Generation'
    ],
    status: 'active',
    badge: 'AI Content'
  },
  {
    id: 9,
    title: 'Engagement Trend Analysis',
    description: 'Track engagement, analyze sentiment, and predict trends',
    icon: TrendingUpIcon,
    color: '#673ab7',
    gradient: 'linear-gradient(135deg, rgba(103,58,183,0.9) 0%, rgba(81,45,168,0.9) 100%)',
    route: '/engagement-trend-analysis',
    features: [
      'Like, Comment Share Analytics',
      'Sentiment Analysis on User Comments',
      'Engagement Prediction',
      'Auto-Reply Smart Responses',
      'Trending Topic Alerts'
    ],
    status: 'active',
    badge: 'Trending'
  },
  {
    id: 10,
    title: 'Token-Based Subscription',
    description: 'Manage your plan, tokens, and auto-renewal',
    icon: TokenIcon,
    color: '#ff5722',
    gradient: 'linear-gradient(135deg, rgba(255,87,34,0.9) 0%, rgba(244,81,30,0.9) 100%)',
    route: '/token-subscription',
    features: [
      'Token-Based Feature Access (Basic vs. Premium)',
      'Subscription Recommendation',
      'Secure Payment Integration',
      'Auto-Renewal Subscription Management',
      'Free Trial Limited Access Mode'
    ],
    status: 'active',
    badge: 'Premium'
  },
  {
    id: 11,
    title: 'Feedback and Notification',
    description: 'Performance reports and personalized recommendations',
    icon: NotificationsIcon,
    color: '#607d8b',
    gradient: 'linear-gradient(135deg, rgba(96,125,139,0.9) 0%, rgba(69,90,100,0.9) 100%)',
    route: '/feedback-notification',
    features: [
      'Performance Reports',
      'Personalized Recommendations for Improvement',
      'Real-Time Push Notifications',
      'User Feedback Collection AI-Based Analysis',
      'Alert System for Content Issues (Copyright, Low Engagement, etc.)'
    ],
    status: 'active',
    badge: 'Alerts'
  }
];

const ModuleCard = ({ module }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const IconComponent = module.icon;

  const handleClick = () => {
    navigate(module.route);
  };

  const cardVariants = {
    hover: { 
      y: -8, 
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      whileHover="hover"
      variants={cardVariants}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          background: '#fff',
          '&:hover': {
            '& .module-header': {
              background: module.gradient,
            }
          }
        }}
        onClick={handleClick}
      >
        {/* Header with Icon */}
        <Box
          className="module-header"
          sx={{
            background: `linear-gradient(135deg, ${module.color}20 0%, ${module.color}10 100%)`,
            p: 3,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <Box sx={{ 
              background: module.gradient,
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${module.color}40`
            }}>
              <IconComponent sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Chip
              label={module.badge}
              size="small"
              sx={{
                background: module.gradient,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 1,
              color: '#1a1a1a'
            }}
          >
            {module.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2 }}
          >
            {module.description}
          </Typography>

          {/* Features List */}
          <Box>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 1,
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600, 
                  color: module.color,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                Features ({module.features.length})
              </Typography>
              <IconButton 
                size="small"
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  color: module.color
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>

            <Collapse in={expanded} timeout="auto">
              <List dense sx={{ py: 0 }}>
                {module.features.map((feature, idx) => (
                  <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: module.color 
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature}
                      primaryTypographyProps={{
                        variant: 'caption',
                        sx: { fontSize: '0.75rem', lineHeight: 1.4 }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>

          {/* Action Button */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: module.color,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              Open Module
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </Typography>
          </Box>
          </CardContent>
        </Card>
    </motion.div>
  );
};

const DashboardCards = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          All Modules
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Explore all available modules and features
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <ModuleCard module={module} />
      </Grid>
    ))}
  </Grid>
    </Box>
);
};

export default DashboardCards; 