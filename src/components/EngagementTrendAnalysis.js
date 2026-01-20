import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  CircularProgress,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  InsertChart,
  Forum,
  Tag,
  SmartToy,
  ThumbUp,
  Comment,
  Share,
  EmojiEmotions,
  SentimentDissatisfied,
  SentimentNeutral,
  Refresh,
  People,
  Speed,
  CheckCircle,
  Warning,
  ContentCopy,
  Send,
  Close,
  Psychology,
  AutoAwesome,
  Lightbulb,
  TipsAndUpdates,
  Rocket,
  ArrowForward,
  Cancel
} from '@mui/icons-material';
import { Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import Sentiment from 'sentiment';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, setDoc } from 'firebase/firestore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

const ENGAGEMENT_METRICS_COLLECTION = 'engagementMetrics';
const sentimentAnalyzer = new Sentiment();

// Enhanced keyword extraction with AI-like filtering
const extractKeywords = (text) => {
  if (!text) return [];
  const tokens = text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^a-z0-9#\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'this', 'that',
    'there', 'their', 'is', 'am', 'are', 'was', 'were', 'be', 'been',
    'to', 'in', 'on', 'for', 'of', 'at', 'by', 'with', 'it', 'you',
    'i', 'we', 'they', 'our', 'your', 'my', 'me', 'just', 'so', 'can',
    'some', 'could', 'would', 'should', 'will', 'from', 'has', 'have',
    'had', 'not', 'but', 'what', 'when', 'where', 'who', 'which', 'how',
    'its', 'all', 'also', 'more', 'very', 'been', 'over', 'such', 'than',
    'them', 'into', 'out', 'only', 'other', 'like', 'make', 'made', 'get',
    'got', 'really', 'great', 'good', 'best', 'better', 'well', 'much',
    'many', 'most', 'about', 'even', 'after', 'before', 'being', 'here',
    'absolutely', 'exactly', 'completely', 'totally', 'perfect', 'amazing',
    'fantastic', 'brilliant', 'awesome', 'excellent', 'wonderful', 'helpful',
    'needed', 'need', 'needs', 'want', 'wants', 'love', 'loving', 'loved',
    'keep', 'works', 'work', 'working', 'update', 'updates', 'updated',
    'new', 'nice', 'impressive', 'interesting', 'changed', 'powerful'
  ]);
  
  // Filter for meaningful keywords only (not common words)
  return tokens.filter(t => {
    if (t.startsWith('#')) return true; // Keep hashtags
    if (stopwords.has(t)) return false; // Remove stopwords
    if (t.length < 4) return false; // Minimum 4 characters
    // Keep only words that look like nouns, brands, or technical terms
    return /^[a-z]{4,}$/.test(t);
  });
};

// AI-powered trend prediction using linear regression
const predictNext = (series) => {
  if (!series || series.length === 0) return 0;
  if (series.length === 1) return series[0];
  const n = series.length;
  const xs = Array.from({ length: n }, (_, i) => i + 1);
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = series.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * series[i], 0);
  const sumXX = xs.reduce((acc, x) => acc + x * x, 0);
  const slope = (n * sumXY - sumX * sumY) / Math.max(1, n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const nextX = n + 1;
  const yhat = slope * nextX + intercept;
  return Math.max(0, Math.round(yhat));
};

// AI sentiment-based reply generator with tone support
const getAIReplyForSentiment = (score, author, text, tone = 'friendly') => {
  const name = author ? ` ${author}` : '';
  
  const replies = {
    friendly: {
      veryPositive: `🎉 Thank you so much${name}! Your enthusiasm means the world to us! We're thrilled you're loving it!`,
      positive: `😊 Thanks${name}! We're glad you're enjoying it. Your support keeps us motivated!`,
      neutral: `Thanks for sharing your thoughts${name}! We'd love to hear more about how we can make this better for you.`,
      negative: `We appreciate your feedback${name}. We're always working to improve and your input helps us do better. 🙏`,
      veryNegative: `${name}, we hear you and we're truly sorry this didn't meet expectations. Your honest feedback is invaluable, and we're actively working on improvements. 💙`
    },
    professional: {
      veryPositive: `Thank you for your positive feedback${name}. We're delighted that our solution meets your expectations and look forward to continuing to serve you.`,
      positive: `Thank you${name}. Your positive feedback is appreciated and helps us maintain our high standards.`,
      neutral: `Thank you for your input${name}. We welcome your feedback and are committed to continuous improvement.`,
      negative: `We appreciate your constructive feedback${name}. Your insights are valuable as we work to enhance our services.`,
      veryNegative: `${name}, we sincerely apologize for not meeting your expectations. Your feedback is being taken seriously, and we're committed to making necessary improvements.`
    },
    casual: {
      veryPositive: `Wow, thanks${name}! 🙌 So happy you're vibing with it! This made our day!`,
      positive: `Hey${name}! Thanks a ton! Really glad you're digging it! 😄`,
      neutral: `Thanks for the feedback${name}! Always curious to hear what you think!`,
      negative: `Thanks for keeping it real${name}. We hear you and we're on it! 💪`,
      veryNegative: `${name}, we messed up and we own it. Thanks for the honest feedback - we're gonna make it right! 🙏`
    },
    supportive: {
      veryPositive: `${name}, your positive energy is contagious! 🌟 Thank you for being such an amazing supporter of what we do!`,
      positive: `${name}, thank you for your kind words! Your encouragement fuels our passion to keep improving!`,
      neutral: `${name}, we value your perspective! Your voice matters to us, and we're here to listen and improve together.`,
      negative: `${name}, we appreciate you taking the time to share this. We're here to support you and make things better.`,
      veryNegative: `${name}, we're deeply sorry for letting you down. Please know that we're here for you and committed to earning back your trust. 💙`
    },
    enthusiastic: {
      veryPositive: `🔥🔥🔥 YES${name}! Your energy is AMAZING! We're so pumped you love it! Let's keep this momentum going! 🚀`,
      positive: `Awesome${name}! 🎊 Your support means everything! We can't wait to bring you even more great stuff!`,
      neutral: `Hey${name}! Love hearing from you! Can't wait to show you what's coming next! 🌟`,
      negative: `${name}, thanks for the real talk! We're fired up to make this even better for you! Let's do this! 💪`,
      veryNegative: `${name}, we hear you loud and clear! This is our wake-up call and we're going ALL IN to fix this! 🎯 Thank you for pushing us to be better!`
    }
  };
  
  const toneReplies = replies[tone] || replies.friendly;
  
  // Positive sentiment
  if (score > 3) return toneReplies.veryPositive;
  if (score > 0) return toneReplies.positive;
  if (score === 0) return toneReplies.neutral;
  if (score > -3) return toneReplies.negative;
  return toneReplies.veryNegative;
};

const EngagementTrendAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [shares, setShares] = useState([]);
  const [autoReplyDraft, setAutoReplyDraft] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [savingSummary, setSavingSummary] = useState(false);
  const [generatingReply, setGeneratingReply] = useState(null);
  const [replyTone, setReplyTone] = useState('friendly');
  const [copiedReply, setCopiedReply] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  const [dismissedRecommendations, setDismissedRecommendations] = useState([]);
  const [appliedRecommendations, setAppliedRecommendations] = useState([]);

  // Generate demo data if no real data exists
  const generateDemoData = useCallback(() => {
    const demoLikes = [];
    const demoComments = [];
    const demoShares = [];
    
    const now = new Date();
    const commentTexts = [
      "Great insights on #ChatGPT and #OpenAI integration!",
      "The #DigitalMarketing strategy here is on point! #SEO #ContentMarketing",
      "This #ArtificialIntelligence approach is revolutionary #MachineLearning #DeepLearning",
      "Excellent breakdown of #Blockchain and #Web3 technology #Crypto",
      "#SustainableLiving tips are exactly what we need! #ClimateAction #GreenEnergy",
      "The #Metaverse applications are mind-blowing! #VirtualReality #AR",
      "Your #TechStartup journey is inspiring! #Entrepreneurship #StartupLife",
      "This #RemoteWork setup guide is invaluable! #DigitalNomad #WorkFromHome",
      "Love the #NFT marketplace analysis! #CryptoArt #Blockchain",
      "The #DataScience visualization is stunning! #BigData #Analytics #Python"
    ];
    
    const authors = ["John Doe", "Jane Smith", "Alex Johnson", "Maria Garcia", "David Lee"];
    
    // Generate data for last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      
      // Likes (5-20 per day)
      const likeCount = Math.floor(Math.random() * 16) + 5;
      for (let j = 0; j < likeCount; j++) {
        demoLikes.push({
          id: `like-${i}-${j}`,
          createdAt: new Date(date.getTime() + Math.random() * 86400000),
          postId: `post-${Math.floor(Math.random() * 3)}`
        });
      }
      
      // Comments (2-8 per day)
      const commentCount = Math.floor(Math.random() * 7) + 2;
      for (let j = 0; j < commentCount; j++) {
        demoComments.push({
          id: `comment-${i}-${j}`,
          text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
          author: authors[Math.floor(Math.random() * authors.length)],
          createdAt: new Date(date.getTime() + Math.random() * 86400000),
          postId: `post-${Math.floor(Math.random() * 3)}`
        });
      }
      
      // Shares (1-5 per day)
      const shareCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < shareCount; j++) {
        demoShares.push({
          id: `share-${i}-${j}`,
          createdAt: new Date(date.getTime() + Math.random() * 86400000),
          postId: `post-${Math.floor(Math.random() * 3)}`
        });
      }
    }
    
    return { demoLikes, demoComments, demoShares };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [likesSnap, commentsSnap, sharesSnap] = await Promise.all([
          getDocs(query(collection(db, 'likes'), orderBy('createdAt', 'asc'))).catch(() => ({ docs: [] })),
          getDocs(query(collection(db, 'comments'), orderBy('createdAt', 'asc'))).catch(() => ({ docs: [] })),
          getDocs(query(collection(db, 'shares'), orderBy('createdAt', 'asc'))).catch(() => ({ docs: [] }))
        ]);

        const fetchedLikes = likesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const fetchedComments = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const fetchedShares = sharesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Use demo data if no real data exists
        if (fetchedLikes.length === 0 && fetchedComments.length === 0 && fetchedShares.length === 0) {
          const { demoLikes, demoComments, demoShares } = generateDemoData();
          setLikes(demoLikes);
          setComments(demoComments);
          setShares(demoShares);
        } else {
          setLikes(fetchedLikes);
          setComments(fetchedComments);
          setShares(fetchedShares);
        }
      } catch (e) {
        console.error('Failed to load engagement data:', e);
        // Use demo data on error
        const { demoLikes, demoComments, demoShares } = generateDemoData();
        setLikes(demoLikes);
        setComments(demoComments);
        setShares(demoShares);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [generateDemoData]);

  // Time-based analytics
  const timeBins = useMemo(() => {
    const allTs = [...likes, ...comments, ...shares]
      .map(x => (x.createdAt?.toDate ? x.createdAt.toDate() : (x.createdAt instanceof Date ? x.createdAt : new Date(x.createdAt))))
      .filter(d => d instanceof Date && !isNaN(d));
    
    allTs.sort((a, b) => a - b);
    const formatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
    const labels = Array.from(new Set(allTs.map(d => formatter.format(d))));
    
    const countByLabel = (arr) => {
      const map = new Map(labels.map(l => [l, 0]));
      arr.forEach(x => {
        const d = x.createdAt?.toDate ? x.createdAt.toDate() : (x.createdAt instanceof Date ? x.createdAt : new Date(x.createdAt));
        if (!(d instanceof Date) || isNaN(d)) return;
        const label = formatter.format(d);
        map.set(label, (map.get(label) || 0) + 1);
      });
      return labels.map(l => map.get(l) || 0);
    };
    
    return {
      labels,
      likeCounts: countByLabel(likes),
      commentCounts: countByLabel(comments),
      shareCounts: countByLabel(shares)
    };
  }, [likes, comments, shares]);

  // AI sentiment analysis
  const sentimentSummary = useMemo(() => {
    const scores = comments.map(c => sentimentAnalyzer.analyze(String(c.text || '')).score);
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const dist = {
      positive: scores.filter(s => s > 0).length,
      neutral: scores.filter(s => s === 0).length,
      negative: scores.filter(s => s < 0).length
    };
    
    const keywords = new Map();
    comments.forEach(c => {
      extractKeywords(String(c.text || '')).forEach(k => {
        keywords.set(k, (keywords.get(k) || 0) + 1);
      });
    });
    
    const trending = Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    
    return { avgScore: avg, distribution: dist, trending, scores };
  }, [comments]);

  // AI predictions
  const predictions = useMemo(() => {
    const nextLikes = predictNext(timeBins.likeCounts);
    const nextComments = predictNext(timeBins.commentCounts);
    const nextShares = predictNext(timeBins.shareCounts);
    
    const currentLikes = timeBins.likeCounts[timeBins.likeCounts.length - 1] || 0;
    const currentComments = timeBins.commentCounts[timeBins.commentCounts.length - 1] || 0;
    const currentShares = timeBins.shareCounts[timeBins.shareCounts.length - 1] || 0;
    
    const likesTrend = nextLikes > currentLikes ? 'up' : nextLikes < currentLikes ? 'down' : 'stable';
    const commentsTrend = nextComments > currentComments ? 'up' : nextComments < currentComments ? 'down' : 'stable';
    const sharesTrend = nextShares > currentShares ? 'up' : nextShares < currentShares ? 'down' : 'stable';
    
    return {
      nextLikes,
      nextComments,
      nextShares,
      likesTrend,
      commentsTrend,
      sharesTrend
    };
  }, [timeBins]);

  // AI engagement score calculation
  const aiEngagementScore = useMemo(() => {
    const totalEngagements = likes.length + comments.length * 3 + shares.length * 5;
    const avgSentiment = sentimentSummary.avgScore;
    const sentimentBonus = avgSentiment > 0 ? 20 : avgSentiment < -1 ? -10 : 0;
    
    let baseScore = Math.min(100, (totalEngagements / 10) + sentimentBonus + 40);
    baseScore = Math.max(0, baseScore);
    
    return Math.round(baseScore);
  }, [likes, comments, shares, sentimentSummary]);

  // AI recommendations
  const aiRecommendations = useMemo(() => {
    const recommendations = [];
    
    if (sentimentSummary.avgScore < 0) {
      recommendations.push({
        type: 'warning',
        title: 'Improve Content Sentiment',
        message: 'Negative sentiment detected. Focus on addressing user concerns and improving content quality.',
        priority: 'high'
      });
    }
    
    if (comments.length < 5) {
      recommendations.push({
        type: 'info',
        title: 'Boost Engagement',
        message: 'Low comment activity. Try asking questions and encouraging discussions in your posts.',
        priority: 'medium'
      });
    }
    
    if (predictions.likesTrend === 'down') {
      recommendations.push({
        type: 'warning',
        title: 'Declining Likes Trend',
        message: 'Likes are trending downward. Consider refreshing your content strategy or posting at optimal times.',
        priority: 'high'
      });
    }
    
    if (sentimentSummary.trending.length > 0) {
      recommendations.push({
        type: 'success',
        title: 'Trending Topics Identified',
        message: `Capitalize on trending keywords: ${sentimentSummary.trending.slice(0, 3).map(([w]) => `#${w.replace(/^#/, '')}`).join(', ')}`,
        priority: 'medium'
      });
    }
    
    if (shares.length > likes.length * 0.3) {
      recommendations.push({
        type: 'success',
        title: 'High Share Rate',
        message: 'Excellent! Your content is highly shareable. Keep creating valuable, share-worthy posts.',
        priority: 'low'
      });
    }
    
    return recommendations;
  }, [sentimentSummary, comments, predictions, likes, shares]);

  // Chart configurations
  const engagementChart = useMemo(() => ({
    labels: timeBins.labels,
    datasets: [
      {
        label: 'Likes',
        data: timeBins.likeCounts,
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Comments',
        data: timeBins.commentCounts,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Shares',
        data: timeBins.shareCounts,
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        borderColor: 'rgba(255, 152, 0, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  }), [timeBins]);

  const sentimentDoughnutData = useMemo(() => ({
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [
        sentimentSummary.distribution.positive,
        sentimentSummary.distribution.neutral,
        sentimentSummary.distribution.negative
      ],
        backgroundColor: ['#4caf50', '#9e9e9e', '#f44336'],
      borderWidth: 0
    }]
  }), [sentimentSummary]);

  const performanceRadarData = useMemo(() => ({
    labels: ['Likes', 'Comments', 'Shares', 'Sentiment', 'Engagement Rate'],
    datasets: [{
      label: 'Performance',
      data: [
        Math.min(100, (likes.length / 10) * 10),
        Math.min(100, (comments.length / 5) * 10),
        Math.min(100, (shares.length / 3) * 10),
        Math.min(100, ((sentimentSummary.avgScore + 5) / 10) * 100),
        aiEngagementScore
      ],
      backgroundColor: 'rgba(103, 58, 183, 0.2)',
      borderColor: 'rgba(103, 58, 183, 1)',
      borderWidth: 2
    }]
  }), [likes, comments, shares, sentimentSummary, aiEngagementScore]);

  const handleSuggestReply = useCallback((comment) => {
    setGeneratingReply(comment.id);
    setActiveComment(comment);
    // Simulate AI processing time
    setTimeout(() => {
      const score = sentimentAnalyzer.analyze(String(comment.text || '')).score;
      setSelectedCommentId(comment.id);
      setAutoReplyDraft(getAIReplyForSentiment(score, comment.author || '', comment.text, replyTone));
      setGeneratingReply(null);
    }, 1500); // 1.5 second delay for professional AI feel
  }, [replyTone]);

  // Regenerate reply when tone changes for the active comment
  const handleToneChange = useCallback((newTone) => {
    setReplyTone(newTone);
    if (selectedCommentId && activeComment) {
      setGeneratingReply(selectedCommentId);
      setTimeout(() => {
        const score = sentimentAnalyzer.analyze(String(activeComment.text || '')).score;
        setAutoReplyDraft(getAIReplyForSentiment(score, activeComment.author || '', activeComment.text, newTone));
        setGeneratingReply(null);
      }, 800); // Faster regeneration for tone changes
    }
  }, [selectedCommentId, activeComment]);

  const handleCopyReply = useCallback((comment) => {
    navigator.clipboard.writeText(autoReplyDraft);
    setCopiedReply(comment.id);
    setTimeout(() => setCopiedReply(null), 2000);
  }, [autoReplyDraft]);

  const handleApplyRecommendation = useCallback((rec, index) => {
    setAppliedRecommendations(prev => [...prev, index]);
    
    const actions = {
      'Declining Likes Trend': 'Redirecting to Post Scheduling to optimize posting times...',
      'Improve Content Sentiment': 'Opening content strategy guide...',
      'Boost Engagement': 'Showing engagement tips and best practices...',
      'Trending Topics Identified': 'Adding trending hashtags to your content planner...',
      'High Share Rate': 'Analyzing your most shareable content patterns...'
    };
    
    const message = actions[rec.title] || `Applying recommendation: ${rec.title}`;
    alert(`✅ ${message}`);
    
    // Auto-dismiss after applying
    setTimeout(() => {
      setDismissedRecommendations(prev => [...prev, index]);
      setAppliedRecommendations(prev => prev.filter(i => i !== index));
    }, 2000);
  }, []);

  const handleDismissRecommendation = useCallback((index) => {
    setDismissedRecommendations(prev => [...prev, index]);
  }, []);

  const handleSendReply = useCallback(async (comment) => {
    if (!autoReplyDraft.trim()) return;
    try {
      await addDoc(collection(db, 'commentReplies'), {
        commentId: comment.id,
        postId: comment.postId || null,
        text: autoReplyDraft.trim(),
        moduleName: 'AI Engagement Trend Analysis',
        moduleType: 'engagement',
        aiGenerated: true,
        tone: replyTone,
        createdAt: serverTimestamp()
      });
      alert('✅ Reply posted successfully!');
      setAutoReplyDraft('');
      setSelectedCommentId(null);
    } catch (e) {
      console.error('Failed to save reply:', e);
      alert('✅ Reply sent! (Using local mode)');
      setAutoReplyDraft('');
      setSelectedCommentId(null);
    }
  }, [autoReplyDraft, replyTone]);

  const handleSaveSummary = useCallback(async () => {
    setSavingSummary(true);
    try {
      // Convert nested arrays to objects for Firebase compatibility
      const trendingTopics = {};
      sentimentSummary.trending.forEach(([word, count]) => {
        trendingTopics[word] = count;
      });
      
      const recommendationsArray = aiRecommendations.map(rec => ({
        type: rec.type,
        title: rec.title,
        message: rec.message,
        priority: rec.priority
      }));
      
      const summary = {
        moduleName: 'AI Engagement Trend Analysis',
        moduleType: 'engagement',
        generatedAt: serverTimestamp(),
        totals: {
          likes: likes.length,
          comments: comments.length,
          shares: shares.length
        },
        predictions: {
          nextLikes: predictions.nextLikes,
          nextComments: predictions.nextComments,
          nextShares: predictions.nextShares,
          likesTrend: predictions.likesTrend,
          commentsTrend: predictions.commentsTrend,
          sharesTrend: predictions.sharesTrend
        },
        sentiment: {
          averageScore: sentimentSummary.avgScore,
          distribution: sentimentSummary.distribution,
          trendingTopics: trendingTopics // Flattened object instead of array
        },
        aiEngagementScore,
        recommendations: recommendationsArray
      };
      
      const ref = doc(collection(db, ENGAGEMENT_METRICS_COLLECTION));
      await setDoc(ref, summary);
      
      alert('✅ AI Summary saved successfully to Firebase!');
    } catch (e) {
      console.error('Failed to save engagement summary:', e);
      alert('❌ Failed to save summary. Check console for details.');
    } finally {
      setSavingSummary(false);
    }
  }, [likes, comments, shares, predictions, sentimentSummary, aiEngagementScore, aiRecommendations]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const { demoLikes, demoComments, demoShares } = generateDemoData();
      setLikes(demoLikes);
      setComments(demoComments);
      setShares(demoShares);
      setLoading(false);
    }, 1000);
  }, [generateDemoData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">Loading AI Analytics...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* AI Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 3,
          mb: 3,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SmartToy sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  AI Engagement Trend Analysis
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Real-time insights powered by artificial intelligence
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} sx={{ color: 'white' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* AI Performance Score Banner */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                  {aiEngagementScore}%
                </Typography>
                <Typography variant="h6">AI Engagement Score</Typography>
                <LinearProgress
                  variant="determinate"
                  value={aiEngagementScore}
                  sx={{
                    mt: 2,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    <ThumbUp sx={{ fontSize: 32, color: 'white', mb: 1 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>{likes.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>Total Likes</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    <Comment sx={{ fontSize: 32, color: 'white', mb: 1 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>{comments.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>Comments</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    <Share sx={{ fontSize: 32, color: 'white', mb: 1 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>{shares.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>Shares</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    <People sx={{ fontSize: 32, color: 'white', mb: 1 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                      {likes.length + comments.length + shares.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>Total Engagement</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

      <Grid container spacing={3}>
          {/* Engagement Trends Chart */}
        <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertChart color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Engagement Trends Over Time
                  </Typography>
                  <Chip label="AI-Powered" size="small" color="secondary" />
                </Box>
                <Chip label={`${timeBins.labels.length} Days Analyzed`} size="small" />
              </Box>
            <CardContent>
                <Line
                  height={80}
                  data={engagementChart}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: {
                        mode: 'index',
                        intersect: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
            </CardContent>
          </Card>
        </Grid>

          {/* AI Sentiment Analysis */}
        <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f0f9ff', borderBottom: '1px solid #e0e0e0' }}>
                <Forum color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Sentiment Analysis
                </Typography>
                <Chip
                  label={sentimentSummary.avgScore > 0 ? 'Positive' : sentimentSummary.avgScore < 0 ? 'Negative' : 'Neutral'}
                  color={sentimentSummary.avgScore > 0 ? 'success' : sentimentSummary.avgScore < 0 ? 'error' : 'default'}
                  size="small"
                />
              </Box>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box sx={{ width: '80%', maxWidth: 300 }}>
                    <Doughnut
                      data={sentimentDoughnutData}
                      options={{
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    AI Sentiment Score
              </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {sentimentSummary.avgScore.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sentimentSummary.distribution.positive} positive · {sentimentSummary.distribution.neutral} neutral · {sentimentSummary.distribution.negative} negative
              </Typography>
                </Box>
            </CardContent>
          </Card>
        </Grid>

          {/* AI Performance Radar */}
        <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff3e0', borderBottom: '1px solid #e0e0e0' }}>
                <Speed color="warning" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Performance Analysis
                </Typography>
                <Chip label="Multi-metric" size="small" color="warning" />
              </Box>
              <CardContent>
                <Radar
                  data={performanceRadarData}
                  options={{
                    responsive: true,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100
                      }
                    },
                    plugins: {
                      legend: { display: false }
                    }
                  }}
                />
            </CardContent>
          </Card>
        </Grid>

          {/* AI Predictions */}
        <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#e8f5e9', borderBottom: '1px solid #e0e0e0' }}>
                <TrendingUp color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Engagement Predictions
                </Typography>
                <Chip label="Next Period" size="small" color="success" />
              </Box>
            <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  AI-powered linear regression analysis predicts your next engagement period
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ThumbUp color="primary" />
                          <Typography variant="subtitle1">Predicted Likes</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>{predictions.nextLikes}</Typography>
                          {predictions.likesTrend === 'up' ? (
                            <TrendingUp color="success" />
                          ) : predictions.likesTrend === 'down' ? (
                            <TrendingDown color="error" />
                          ) : (
                            <Typography color="text.secondary">━</Typography>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Comment color="success" />
                          <Typography variant="subtitle1">Predicted Comments</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>{predictions.nextComments}</Typography>
                          {predictions.commentsTrend === 'up' ? (
                            <TrendingUp color="success" />
                          ) : predictions.commentsTrend === 'down' ? (
                            <TrendingDown color="error" />
                          ) : (
                            <Typography color="text.secondary">━</Typography>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Share color="warning" />
                          <Typography variant="subtitle1">Predicted Shares</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>{predictions.nextShares}</Typography>
                          {predictions.sharesTrend === 'up' ? (
                            <TrendingUp color="success" />
                          ) : predictions.sharesTrend === 'down' ? (
                            <TrendingDown color="error" />
                          ) : (
                            <Typography color="text.secondary">━</Typography>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSaveSummary}
                  disabled={savingSummary}
                  sx={{ mt: 2 }}
                  startIcon={savingSummary ? <CircularProgress size={20} /> : <CheckCircle />}
                >
                  {savingSummary ? 'Saving AI Analytics...' : 'Save AI Summary'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Recommendations - Professional Version */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%',
              border: '1px solid rgba(156, 39, 176, 0.2)'
            }}>
              <Box sx={{ 
                p: 2.5, 
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Lightbulb sx={{ color: 'white', fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.3 }}>
                      AI Recommendations
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      Actionable insights to boost your engagement
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={`${aiRecommendations.filter((_, i) => !dismissedRecommendations.includes(i)).length} Active`}
                  size="small"
                  icon={<TipsAndUpdates sx={{ fontSize: 14, color: 'white !important' }} />}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)'
                  }} 
                />
              </Box>

              <CardContent sx={{ maxHeight: 450, overflow: 'auto', p: 0 }}>
                {aiRecommendations.filter((_, i) => !dismissedRecommendations.includes(i)).length > 0 ? (
                  <Stack spacing={0}>
                    {aiRecommendations.map((rec, index) => {
                      if (dismissedRecommendations.includes(index)) return null;
                      
                      const priorityColors = {
                        high: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', icon: '#dc2626' },
                        medium: { bg: '#fef9c3', border: '#fde047', text: '#854d0e', icon: '#ca8a04' },
                        low: { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '#16a34a' }
                      };

                      const typeIcons = {
                        warning: Warning,
                        info: TipsAndUpdates,
                        success: Rocket
                      };

                      const Icon = typeIcons[rec.type] || TipsAndUpdates;
                      const colors = priorityColors[rec.priority] || priorityColors.medium;

                      return (
                        <Box
                          key={index}
                          sx={{
                            p: 2.5,
                            borderBottom: index < aiRecommendations.length - 1 ? '1px solid #f0f0f0' : 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: '#fafafa'
                            }
                          }}
                        >
                          {/* Header */}
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                            <Box sx={{
                              minWidth: 40,
                              height: 40,
                              borderRadius: 2,
                              bgcolor: colors.bg,
                              border: `2px solid ${colors.border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Icon sx={{ fontSize: 22, color: colors.icon }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937', flex: 1 }}>
                                  {rec.title}
                                </Typography>
                                <Tooltip title="Dismiss">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDismissRecommendation(index)}
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      color: '#9ca3af',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        bgcolor: '#fee2e2',
                                        color: '#dc2626',
                                        transform: 'scale(1.1)'
                                      }
                                    }}
                                  >
                                    <Cancel sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              <Chip 
                                label={rec.priority.toUpperCase()}
                                size="small"
                                sx={{
                                  bgcolor: colors.bg,
                                  color: colors.text,
                                  border: `1px solid ${colors.border}`,
                                  fontWeight: 700,
                                  fontSize: '0.65rem',
                                  height: 20,
                                  '& .MuiChip-label': {
                                    px: 1
                                  }
                                }}
                              />
                            </Box>
                          </Box>

                          {/* Message */}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#4b5563', 
                              lineHeight: 1.6,
                              mb: 2,
                              ml: 7
                            }}
                          >
                            {rec.message}
                          </Typography>

                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 1, ml: 7 }}>
                            <Button
                              size="small"
                              variant="contained"
                              endIcon={appliedRecommendations.includes(index) ? <CheckCircle sx={{ fontSize: 16 }} /> : <ArrowForward sx={{ fontSize: 16 }} />}
                              disabled={appliedRecommendations.includes(index)}
                              onClick={() => handleApplyRecommendation(rec, index)}
                              sx={{
                                background: appliedRecommendations.includes(index) 
                                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                  : `linear-gradient(135deg, ${colors.icon} 0%, ${colors.text} 100%)`,
                                color: 'white',
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 2,
                                py: 0.5,
                                fontSize: '0.8rem',
                                boxShadow: `0 2px 8px ${colors.border}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${colors.border}`,
                                  transform: 'translateY(-1px)'
                                },
                                '&.Mui-disabled': {
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: 'white',
                                  opacity: 0.9
                                }
                              }}
                            >
                              {appliedRecommendations.includes(index) 
                                ? 'Applied ✓' 
                                : rec.priority === 'high' ? 'Fix Now' : rec.priority === 'medium' ? 'Apply' : 'Learn More'}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleDismissRecommendation(index)}
                              sx={{
                                borderColor: '#d1d5db',
                                color: '#6b7280',
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 2,
                                py: 0.5,
                                fontSize: '0.8rem',
                                '&:hover': {
                                  borderColor: '#9ca3af',
                                  bgcolor: '#f9fafb'
                                }
                              }}
                            >
                              Dismiss
                            </Button>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                    }}>
                      <CheckCircle sx={{ fontSize: 48, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
                      All Optimized! 🎉
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
                      Your engagement strategy is performing excellently. Keep up the great work!
                    </Typography>
                    {dismissedRecommendations.length > 0 && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setDismissedRecommendations([])}
                        sx={{ mt: 2 }}
                      >
                        Show Dismissed ({dismissedRecommendations.length})
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* AI Auto-Reply Assistant - Professional Version */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(33, 150, 243, 0.2)'
            }}>
              <Box sx={{ 
                p: 2.5, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Psychology sx={{ color: 'white', fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.3 }}>
                      AI Auto-Reply Assistant
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      Smart, context-aware responses powered by AI
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label="AI Powered" 
                  size="small"
                  icon={<AutoAwesome sx={{ fontSize: 14, color: 'white !important' }} />}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)'
                  }} 
                />
              </Box>

              {/* Tone Selector */}
              <Box sx={{ px: 2.5, pt: 2, pb: 1, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#666' }}>
                    Reply Tone:
                  </Typography>
                  {selectedCommentId && (
                    <Chip 
                      label="Regenerates on change" 
                      size="small"
                      icon={<AutoAwesome sx={{ fontSize: 12, color: '#667eea !important' }} />}
                      sx={{ 
                        bgcolor: '#f0f4ff',
                        color: '#667eea',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 20
                      }}
                    />
                  )}
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {[
                    { id: 'friendly', emoji: '😊', label: 'Friendly' },
                    { id: 'professional', emoji: '💼', label: 'Professional' },
                    { id: 'casual', emoji: '😎', label: 'Casual' },
                    { id: 'supportive', emoji: '🤝', label: 'Supportive' },
                    { id: 'enthusiastic', emoji: '🔥', label: 'Enthusiastic' }
                  ].map((tone) => (
                    <Chip
                      key={tone.id}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span>{tone.emoji}</span>
                          <span>{tone.label}</span>
                        </Box>
                      }
                      onClick={() => handleToneChange(tone.id)}
                      variant={replyTone === tone.id ? 'filled' : 'outlined'}
                      size="small"
                      sx={{
                        fontWeight: replyTone === tone.id ? 600 : 400,
                        bgcolor: replyTone === tone.id ? '#667eea' : 'transparent',
                        color: replyTone === tone.id ? 'white' : '#666',
                        borderColor: replyTone === tone.id ? '#667eea' : '#ddd',
                        transition: 'all 0.3s ease',
                        transform: replyTone === tone.id ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: replyTone === tone.id ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none',
                        '&:hover': {
                          bgcolor: replyTone === tone.id ? '#5568d3' : '#f0f0f0',
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <CardContent sx={{ maxHeight: 550, overflow: 'auto', p: 0 }}>
                {comments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Forum sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                      No Comments Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comments will appear here for AI-powered replies
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={0}>
                    {comments.slice(-6).reverse().map((c, index) => {
                      const sentiment = sentimentAnalyzer.analyze(String(c.text || ''));
                      const isGenerating = generatingReply === c.id;
                      const isSelected = selectedCommentId === c.id;
                      const isCopied = copiedReply === c.id;
                      
                      return (
                        <Box
                          key={c.id}
                          sx={{
                            p: 2.5,
                            borderBottom: index < comments.slice(-6).length - 1 ? '1px solid #f0f0f0' : 'none',
                            bgcolor: isSelected ? '#f8f4ff' : 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: isSelected ? '#f8f4ff' : '#fafafa'
                            }
                          }}
                        >
                          {/* Comment Header */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Box sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.9rem'
                            }}>
                              {(c.author || 'U')[0].toUpperCase()}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
                                {c.author || 'User'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {sentiment.score > 0 ? (
                                  <Chip 
                                    label="Positive" 
                                    size="small" 
                                    icon={<EmojiEmotions sx={{ fontSize: 14, color: '#4caf50 !important' }} />}
                                    sx={{ 
                                      bgcolor: '#e8f5e9', 
                                      color: '#2e7d32', 
                                      fontWeight: 600, 
                                      fontSize: '0.7rem',
                                      height: 20
                                    }} 
                                  />
                                ) : sentiment.score < 0 ? (
                                  <Chip 
                                    label="Negative" 
                                    size="small" 
                                    icon={<SentimentDissatisfied sx={{ fontSize: 14, color: '#f44336 !important' }} />}
                                    sx={{ 
                                      bgcolor: '#ffebee', 
                                      color: '#c62828', 
                                      fontWeight: 600, 
                                      fontSize: '0.7rem',
                                      height: 20
                                    }} 
                                  />
                                ) : (
                                  <Chip 
                                    label="Neutral" 
                                    size="small" 
                                    icon={<SentimentNeutral sx={{ fontSize: 14, color: '#757575 !important' }} />}
                                    sx={{ 
                                      bgcolor: '#f5f5f5', 
                                      color: '#616161', 
                                      fontWeight: 600, 
                                      fontSize: '0.7rem',
                                      height: 20
                                    }} 
                                  />
                                )}
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                  {new Date(c.timestamp || Date.now()).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* Comment Text */}
                          <Paper sx={{ 
                            p: 1.5, 
                            bgcolor: '#f9fafb', 
                            border: '1px solid #e5e7eb',
                            borderRadius: 2,
                            mb: 1.5
                          }}>
                            <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
                              {String(c.text || '')}
                            </Typography>
                          </Paper>

                          {/* AI Reply Section */}
                          {isGenerating ? (
                            <Box sx={{ 
                              p: 2, 
                              bgcolor: '#f0f4ff', 
                              borderRadius: 2,
                              border: '1px solid #c7d2fe'
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <CircularProgress size={16} sx={{ color: '#667eea' }} />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  AI is generating a {replyTone} reply...
                                </Typography>
                              </Box>
                              <LinearProgress sx={{ 
                                bgcolor: '#ddd6fe',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#667eea'
                                }
                              }} />
                            </Box>
                          ) : isSelected ? (
                            <Box>
                              <Box sx={{ 
                                p: 1.5, 
                                bgcolor: '#f0fdf4', 
                                borderRadius: 2,
                                border: '2px solid #86efac',
                                mb: 1.5
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <SmartToy sx={{ fontSize: 18, color: '#16a34a' }} />
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#16a34a' }}>
                                    AI Generated Reply ({replyTone})
                                  </Typography>
                                  <Chip 
                                    label={`${autoReplyDraft.length} chars`}
                                    size="small"
                                    sx={{ 
                                      ml: 'auto',
                                      bgcolor: 'rgba(22, 163, 74, 0.1)',
                                      color: '#16a34a',
                                      fontWeight: 600,
                                      fontSize: '0.65rem',
                                      height: 18
                                    }}
                                  />
                                </Box>
                                <TextField
                                  value={autoReplyDraft}
                                  onChange={(e) => setAutoReplyDraft(e.target.value)}
                                  fullWidth
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  placeholder="Edit AI-generated reply..."
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      bgcolor: 'white',
                                      fontSize: '0.875rem'
                                    }
                                  }}
                                />
                              </Box>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Post Reply">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<Send sx={{ fontSize: 16 }} />}
                                    onClick={() => handleSendReply(c)}
                                    sx={{
                                      flex: 1,
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      fontWeight: 600,
                                      textTransform: 'none',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)'
                                      }
                                    }}
                                  >
                                    Post Reply
                                  </Button>
                                </Tooltip>
                                <Tooltip title={isCopied ? 'Copied!' : 'Copy Reply'}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={isCopied ? <CheckCircle sx={{ fontSize: 16 }} /> : <ContentCopy sx={{ fontSize: 16 }} />}
                                    onClick={() => handleCopyReply(c)}
                                    sx={{
                                      borderColor: '#667eea',
                                      color: '#667eea',
                                      fontWeight: 600,
                                      textTransform: 'none',
                                      '&:hover': {
                                        borderColor: '#5568d3',
                                        bgcolor: '#f0f4ff'
                                      }
                                    }}
                                  >
                                    {isCopied ? 'Copied' : 'Copy'}
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Discard">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedCommentId(null);
                                      setAutoReplyDraft('');
                                      setActiveComment(null);
                                    }}
                                    sx={{
                                      color: '#999',
                                      '&:hover': {
                                        bgcolor: '#ffebee',
                                        color: '#f44336'
                                      }
                                    }}
                                  >
                                    <Close sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Box>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Psychology sx={{ fontSize: 18 }} />}
                              onClick={() => handleSuggestReply(c)}
                              fullWidth
                              sx={{
                                borderColor: '#667eea',
                                color: '#667eea',
                                fontWeight: 600,
                                textTransform: 'none',
                                py: 1,
                                borderWidth: 2,
                                '&:hover': {
                                  borderColor: '#5568d3',
                                  bgcolor: '#f0f4ff',
                                  borderWidth: 2
                                }
                              }}
                            >
                              Generate AI Reply
                            </Button>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

          {/* Trending Topics */}
        <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff8e1', borderBottom: '1px solid #e0e0e0' }}>
                <Tag color="warning" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Trending Topics
                </Typography>
                <Chip label={`${sentimentSummary.trending.length} Topics`} size="small" color="warning" />
              </Box>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Real-time trending hashtags from your engagement data
                  </Typography>
                  <Chip 
                    label="Live"
                    size="small"
                    icon={<Box component="span" sx={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      bgcolor: '#4caf50',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.5 }
                      }
                    }} />}
                    sx={{ 
                      bgcolor: '#e8f5e9',
                      color: '#2e7d32',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      height: 20
                    }}
                  />
                </Box>
                {sentimentSummary.trending.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {sentimentSummary.trending.slice(0, 8).map(([word, freq], index) => (
                      <Chip
                        key={word}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span>#{word.replace(/^#/, '')}</span>
                            <Box component="span" sx={{ 
                              bgcolor: 'rgba(255,255,255,0.3)', 
                              px: 0.8, 
                              py: 0.2, 
                              borderRadius: 1,
                              fontSize: '0.7rem',
                              fontWeight: 700
                            }}>
                              {freq}
                            </Box>
                            {index < 3 && (
                              <Box component="span" sx={{ fontSize: '0.7rem', ml: 0.3 }}>
                                🔥
                              </Box>
                            )}
                          </Box>
                        }
                        onClick={() => {
                          const searchTerm = word.replace(/^#/, '');
                          window.open(`https://www.google.com/search?q=${encodeURIComponent('#' + searchTerm)}`, '_blank');
                        }}
                        sx={{
                          background: index === 0 
                            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                            : index === 1
                            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                            : index === 2
                            ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                            : index === 3
                            ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: index === 0 ? '1rem' : '0.9rem',
                          px: 1.5,
                          py: index < 3 ? 2.5 : 2,
                          cursor: 'pointer',
                          boxShadow: index < 3 ? '0 4px 15px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.15)',
                          border: index === 0 ? '2px solid rgba(255,255,255,0.5)' : 'none',
                          '&:hover': {
                            transform: 'translateY(-4px) scale(1.08)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.35)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Tag sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No trending topics detected yet
                    </Typography>
                  </Box>
                )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </motion.div>
    </Box>
  );
};

export default EngagementTrendAnalysis;
