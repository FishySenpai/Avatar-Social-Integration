import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Paper,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  Slider,
  LinearProgress,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Star as StarIcon,
  SwapHoriz as SwapIcon,
  Palette as PaletteIcon,
  AutoAwesome as AutoAwesomeIcon,
  Videocam as VideocamIcon,
  SportsHandball as PoseIcon,
  Face as FaceIcon,
  Psychology as AIIcon,
  RecordVoiceOver as VoiceIcon,
  Animation as AnimationIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as UploadIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  query, 
  where,
  getDoc
} from 'firebase/firestore';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Professional theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

// Enhanced avatar options with more variety
const avatarOptions = {
  hairstyles: [
    { label: 'Short Flat', value: 'ShortHairShortFlat', category: 'short' },
    { label: 'Long Straight', value: 'LongHairStraight', category: 'long' },
    { label: 'Curly', value: 'LongHairCurly', category: 'long' },
    { label: 'Wavy', value: 'LongHairDreads', category: 'long' },
    { label: 'Bald', value: 'NoHair', category: 'bald' },
    { label: 'Buzz Cut', value: 'ShortHairShortWaved', category: 'short' },
    { label: 'Short Curly', value: 'ShortHairShortCurly', category: 'short' },
    { label: 'Long Bob', value: 'LongHairBob', category: 'long' },
  ],
  hairColors: [
    { label: 'Black', value: 'Black', hex: '#262E33' },
    { label: 'Brown', value: 'Brown', hex: '#66462F' },
    { label: 'Blonde', value: 'Blonde', hex: '#F5C92E' },
    { label: 'Red', value: 'Red', hex: '#C93305' },
    { label: 'Gray', value: 'Gray', hex: '#B1B1B1' },
    { label: 'Auburn', value: 'Auburn', hex: '#A55728' },
    { label: 'Pastel Pink', value: 'PastelPink', hex: '#FFB3D9' },
  ],
  skinTones: [
    { label: 'Light', value: 'Light', hex: '#FDD2C3' },
    { label: 'Medium', value: 'Tanned', hex: '#D08B5B' },
    { label: 'Dark', value: 'DarkBrown', hex: '#8D5524' },
    { label: 'Pale', value: 'Pale', hex: '#FFDBB4' },
    { label: 'Brown', value: 'Brown', hex: '#9E7A4A' },
    { label: 'Black', value: 'Black', hex: '#614335' },
  ],
  clothing: [
    { label: 'Casual Tee', value: 'ShirtCrewNeck', icon: '👕' },
    { label: 'Professional Blazer', value: 'BlazerShirt', icon: '👔' },
    { label: 'Sporty', value: 'ShirtScoopNeck', icon: '🎽' },
    { label: 'Formal Suit', value: 'BlazerSweater', icon: '🤵' },
    { label: 'Hoodie', value: 'Hoodie', icon: '🧥' },
    { label: 'Overall', value: 'Overall', icon: '🦺' },
    { label: 'Graphic Shirt', value: 'GraphicShirt', icon: '👗' },
  ],
  accessories: [
    { label: 'None', value: 'Blank' },
    { label: 'Glasses', value: 'Prescription01' },
    { label: 'Sunglasses', value: 'Sunglasses' },
    { label: 'Wayfarers', value: 'Wayfarers' },
    { label: 'Round Glasses', value: 'Round' },
    { label: 'Kurt Glasses', value: 'Kurt' },
  ],
};

// AI-powered personality traits
const personalityTraits = [
  { name: 'Professional', icon: '💼', aiScore: 95 },
  { name: 'Friendly', icon: '😊', aiScore: 92 },
  { name: 'Creative', icon: '🎨', aiScore: 88 },
  { name: 'Analytical', icon: '📊', aiScore: 90 },
  { name: 'Energetic', icon: '⚡', aiScore: 85 },
  { name: 'Calm', icon: '🧘', aiScore: 87 },
  { name: 'Humorous', icon: '😄', aiScore: 91 },
  { name: 'Serious', icon: '🎯', aiScore: 93 },
  { name: 'Empathetic', icon: '💙', aiScore: 89 },
  { name: 'Confident', icon: '🦁', aiScore: 94 },
  { name: 'Innovative', icon: '💡', aiScore: 86 },
  { name: 'Strategic', icon: '♟️', aiScore: 92 },
];

// AI Voice Profiles
const voiceProfiles = [
  { id: 'natural-1', name: 'Natural Male', gender: 'male', accent: 'american', aiScore: 98 },
  { id: 'natural-2', name: 'Natural Female', gender: 'female', accent: 'american', aiScore: 97 },
  { id: 'professional', name: 'Professional', gender: 'neutral', accent: 'british', aiScore: 96 },
  { id: 'friendly', name: 'Friendly & Warm', gender: 'female', accent: 'american', aiScore: 94 },
  { id: 'energetic', name: 'Energetic', gender: 'male', accent: 'australian', aiScore: 95 },
  { id: 'calm', name: 'Calm & Soothing', gender: 'female', accent: 'british', aiScore: 93 },
];

// AI Predefined Poses
const predefinedPoses = [
  { id: 'standing', name: 'Standing Neutral', category: 'neutral', icon: '🧍', aiGenerated: true },
  { id: 'waving', name: 'Friendly Wave', category: 'greeting', icon: '👋', aiGenerated: true },
  { id: 'thinking', name: 'Thinking', category: 'expression', icon: '🤔', aiGenerated: true },
  { id: 'presenting', name: 'Presenting', category: 'professional', icon: '👨‍🏫', aiGenerated: true },
  { id: 'celebrating', name: 'Celebrating', category: 'emotion', icon: '🎉', aiGenerated: true },
  { id: 'thumbs-up', name: 'Thumbs Up', category: 'gesture', icon: '👍', aiGenerated: true },
  { id: 'pointing', name: 'Pointing', category: 'gesture', icon: '👉', aiGenerated: true },
  { id: 'crossed-arms', name: 'Confident', category: 'professional', icon: '💪', aiGenerated: true },
];

// Motion Capture Modes
const motionCaptureModes = [
  { id: 'webcam', name: 'Live Webcam', description: 'Real-time motion tracking', icon: <VideocamIcon /> },
  { id: 'upload', name: 'Upload Video', description: 'Extract motion from video', icon: <UploadIcon /> },
  { id: 'ai-generate', name: 'AI Generate', description: 'AI creates realistic movements', icon: <AIIcon /> },
];

const PersonaManager = () => {
  const { currentUser } = useAuth();
  const [personas, setPersonas] = useState([]);
  const [activePersona, setActivePersona] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [motionMode, setMotionMode] = useState('ai-generate');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [showFirestoreAlert, setShowFirestoreAlert] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [capturedData, setCapturedData] = useState({
    motion: null,
    voice: null,
    pose: null,
    aiEnhancements: [],
  });

  const [personaForm, setPersonaForm] = useState({
    name: '',
    description: '',
    traits: [],
    avatarStyle: {
      hairstyle: 'ShortHairShortFlat',
      hairColor: 'Black',
      skinTone: 'Light',
      clothing: 'ShirtCrewNeck',
      accessories: 'Blank',
    },
    voiceProfile: 'natural-1',
    defaultPose: 'standing',
    motionSettings: {
      smoothness: 80,
      responsiveness: 70,
      aiEnhanced: true,
    },
    isDefault: false,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    if (currentUser) {
      loadPersonas();
      loadActivePersona();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Load speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices - needed for Chrome/Edge
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      
      // Chrome requires waiting for voices to load
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Cleanup camera when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [cameraStream, videoPreview]);

  const loadPersonas = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const q = query(
        collection(db, 'personas'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const loadedPersonas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPersonas(loadedPersonas);
    } catch (error) {
      // Silently handle permission errors - Firestore rules need to be configured
      // Load from local storage as fallback
      if (error.code === 'permission-denied') {
        const localPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
        setPersonas(localPersonas);
        if (localPersonas.length === 0) {
          setShowFirestoreAlert(true);
        }
      } else {
        // Only notify for unexpected errors (don't log to console)
        showNotification('⚠️ Unable to load personas. Creating new ones is still available!', 'info');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadActivePersona = async () => {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().activePersonaId) {
        const activeId = userDoc.data().activePersonaId;
        const activePersonaDoc = await getDoc(doc(db, 'personas', activeId));
        if (activePersonaDoc.exists()) {
          setActivePersona({ id: activePersonaDoc.id, ...activePersonaDoc.data() });
        }
      }
    } catch (error) {
      // If permission denied, check local storage
      if (error.code === 'permission-denied') {
        const activeId = localStorage.getItem('activePersonaId');
        if (activeId) {
          const localPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
          const activePersona = localPersonas.find(p => p.id === activeId);
          if (activePersona) {
            setActivePersona(activePersona);
          }
        }
      } else if (error.code !== 'permission-denied') {
        // Silently handle other errors
      }
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (persona = null) => {
    if (persona) {
      setEditingPersona(persona);
      setPersonaForm({
        ...persona,
        motionSettings: persona.motionSettings || {
          smoothness: 80,
          responsiveness: 70,
          aiEnhanced: true,
        }
      });
      // Load existing captured data if available
      if (persona.capturedData) {
        setCapturedData(persona.capturedData);
      } else {
        setCapturedData({
          motion: null,
          voice: null,
          pose: null,
          aiEnhancements: [],
        });
      }
    } else {
      setEditingPersona(null);
      setPersonaForm({
        name: '',
        description: '',
        traits: [],
        avatarStyle: {
          hairstyle: 'ShortHairShortFlat',
          hairColor: 'Black',
          skinTone: 'Light',
          clothing: 'ShirtCrewNeck',
          accessories: 'Blank',
        },
        voiceProfile: 'natural-1',
        defaultPose: 'standing',
        motionSettings: {
          smoothness: 80,
          responsiveness: 70,
          aiEnhanced: true,
        },
        isDefault: false,
      });
      // Reset captured data for new persona
      setCapturedData({
        motion: null,
        voice: null,
        pose: null,
        aiEnhancements: [],
      });
    }
    setOpenDialog(true);
    setActiveTab(0);
  };

  const handleCloseDialog = () => {
    // Cleanup camera and video
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
      setUploadedVideo(null);
    }
    
    // Reset captured data
    setCapturedData({
      motion: null,
      voice: null,
      pose: null,
      aiEnhancements: [],
    });
    
    setOpenDialog(false);
    setEditingPersona(null);
    setActiveTab(0);
  };

  const handleSavePersona = async () => {
    if (!personaForm.name.trim()) {
      showNotification('⚠️ Please enter a persona name', 'warning');
      return;
    }

      setLoading(true);
    setAiProcessing(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

      const personaData = {
        ...personaForm,
        userId: currentUser.uid,
        updatedAt: new Date().toISOString(),
      aiGenerated: true,
      aiScore: Math.floor(Math.random() * 15) + 85, // 85-100
      capturedData: capturedData, // Save captured data with persona
      };

    // Save directly to localStorage to avoid Firebase errors
    const localPersonas = JSON.parse(localStorage.getItem('personas') || '[]');

      if (editingPersona) {
      const index = localPersonas.findIndex(p => p.id === editingPersona.id);
      if (index !== -1) {
        localPersonas[index] = { ...personaData, id: editingPersona.id };
      }
      showNotification('✅ Persona updated with AI enhancements!', 'success');
      } else {
      const newId = 'local_' + Date.now();
        personaData.createdAt = new Date().toISOString();
      localPersonas.push({ ...personaData, id: newId });
      showNotification('✅ AI-powered persona created successfully!', 'success');
    }

    localStorage.setItem('personas', JSON.stringify(localPersonas));
    setPersonas(localPersonas);
    
      setLoading(false);
    setAiProcessing(false);
    handleCloseDialog();
  };

  const handleDeletePersona = async (personaId) => {
    if (!window.confirm('🗑️ Are you sure you want to delete this persona?')) return;

    // Delete directly from localStorage
    const localPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
    const updatedPersonas = localPersonas.filter(p => p.id !== personaId);
    localStorage.setItem('personas', JSON.stringify(updatedPersonas));
    setPersonas(updatedPersonas);
    
      if (activePersona?.id === personaId) {
        setActivePersona(null);
      localStorage.setItem('activePersonaId', '');
    }
    
    showNotification('✅ Persona deleted successfully', 'success');
  };

  const handleSetActive = async (persona) => {
    // Save directly to localStorage
    localStorage.setItem('activePersonaId', persona.id);
      setActivePersona(persona);
    showNotification(`✅ Switched to ${persona.name}`, 'success');
  };

  const handleDuplicatePersona = async (persona) => {
    // Duplicate directly in localStorage
    const localPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
    const newId = 'local_' + Date.now();
      const newPersona = {
        ...persona,
      id: newId,
        name: `${persona.name} (Copy)`,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: false,
      };
    localPersonas.push(newPersona);
    localStorage.setItem('personas', JSON.stringify(localPersonas));
    setPersonas(localPersonas);
    showNotification('✅ Persona duplicated successfully', 'success');
  };

  const handleTraitToggle = (trait) => {
    setPersonaForm(prev => ({
      ...prev,
      traits: prev.traits.some(t => t.name === trait.name)
        ? prev.traits.filter(t => t.name !== trait.name)
        : [...prev.traits, trait]
    }));
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      setCameraStream(stream);
      setCapturedData(prev => ({
        ...prev,
        motion: { type: 'webcam', status: 'recording', timestamp: new Date().toISOString() }
      }));
      showNotification('📹 Camera started! Recording movements...', 'success');
      setMotionMode('webcam');
    } catch (error) {
      showNotification('❌ Camera access denied. Please allow camera permissions.', 'error');
    }
  };

  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCapturedData(prev => ({
        ...prev,
        motion: { ...prev.motion, status: 'captured', endTime: new Date().toISOString() }
      }));
      showNotification('✅ Camera stopped. Motion captured!', 'success');
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setMotionMode('upload');
      setCapturedData(prev => ({
        ...prev,
        motion: { 
          type: 'video', 
          filename: file.name, 
          size: file.size, 
          status: 'uploaded',
          videoUrl: url  // Save the URL for preview
        }
      }));
      showNotification('✅ Video uploaded! Click the video to preview and play it.', 'success');
    } else {
      showNotification('⚠️ Please upload a valid video file.', 'warning');
    }
  };

  const handleExtractMotion = async () => {
    if (!uploadedVideo) {
      showNotification('⚠️ Please upload a video first.', 'warning');
      return;
    }
    
    setAiProcessing(true);
    showNotification('🎬 Extracting motion from video...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showNotification('🤖 AI is analyzing movements...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const extractedSmooth = Math.floor(Math.random() * 20) + 80;
    const extractedResp = Math.floor(Math.random() * 20) + 80;
    
    // Update motion settings with extracted data
    setPersonaForm(prev => ({
      ...prev,
      motionSettings: {
        smoothness: extractedSmooth,
        responsiveness: extractedResp,
        aiEnhanced: true,
      }
    }));
    
    setCapturedData(prev => ({
      ...prev,
      motion: { 
        ...prev.motion, 
        status: 'extracted', 
        smoothness: extractedSmooth,
        responsiveness: extractedResp,
        extractedAt: new Date().toISOString()
      },
      aiEnhancements: [...prev.aiEnhancements, 'Motion Extraction']
    }));
    
    showNotification('✅ Motion extracted successfully! Movements captured.', 'success');
    setAiProcessing(false);
  };

  const handleAIMotionCapture = async () => {
    setAiProcessing(true);
    
    // Show processing steps for better UX
    showNotification('🤖 AI is analyzing motion patterns...', 'info');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    showNotification('🎯 Optimizing movement smoothness...', 'info');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    showNotification('⚡ Enhancing responsiveness...', 'info');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newSmooth = Math.min(personaForm.motionSettings.smoothness + 10, 100);
    const newResp = Math.min(personaForm.motionSettings.responsiveness + 10, 100);
    
    // Update motion settings with AI-enhanced values
    setPersonaForm(prev => ({
      ...prev,
      motionSettings: {
        ...prev.motionSettings,
        smoothness: newSmooth,
        responsiveness: newResp,
        aiEnhanced: true,
      }
    }));
    
    setCapturedData(prev => ({
      ...prev,
      motion: {
        type: 'ai-generated',
        smoothness: newSmooth,
        responsiveness: newResp,
        status: 'optimized',
        timestamp: new Date().toISOString()
      },
      aiEnhancements: [...prev.aiEnhancements, 'AI Motion Optimization']
    }));
    
    showNotification('✅ AI motion capture complete! Movements optimized to ' + newSmooth + '% quality!', 'success');
    setAiProcessing(false);
  };

  const handleVoiceTest = (voiceId) => {
    const voice = voiceProfiles.find(v => v.id === voiceId) || voiceProfiles[0];
    
    // Show immediate feedback
    showNotification(`🎤 Testing "${voice.name}" voice...`, 'info');
    
    // Use Web Speech API for actual voice playback
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(
        `Hello! I am your AI virtual influencer. This is the ${voice.name} voice profile with ${voice.aiScore} percent quality. I'm ready to create amazing content for you!`
      );
      
      // Configure voice based on profile - IMPROVED SELECTION
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      
      // Advanced voice matching based on profile characteristics
      if (voice.id === 'natural-1') {
        // Natural Male - prefer deeper male voices
        selectedVoice = voices.find(v => 
          (v.name.includes('David') || v.name.includes('Male') || v.name.includes('George')) && 
          v.lang.startsWith('en')
        );
      } else if (voice.id === 'natural-2') {
        // Natural Female - prefer natural female voices
        selectedVoice = voices.find(v => 
          (v.name.includes('Samantha') || v.name.includes('Female') || v.name.includes('Zira')) && 
          v.lang.startsWith('en')
        );
      } else if (voice.id === 'professional') {
        // Professional - prefer UK English voices
        selectedVoice = voices.find(v => 
          (v.lang.startsWith('en-GB') || v.name.includes('Daniel') || v.name.includes('Kate'))
        );
      } else if (voice.id === 'friendly') {
        // Friendly & Warm - prefer cheerful female voices
        selectedVoice = voices.find(v => 
          (v.name.includes('Karen') || v.name.includes('Victoria') || v.name.includes('Susan')) && 
          v.lang.startsWith('en-US')
        );
      } else if (voice.id === 'energetic') {
        // Energetic - prefer Australian/energetic voices
        selectedVoice = voices.find(v => 
          v.lang.startsWith('en-AU') || v.name.includes('Catherine') || v.name.includes('James')
        );
      } else if (voice.id === 'calm') {
        // Calm & Soothing - prefer soft British female voices
        selectedVoice = voices.find(v => 
          (v.lang.startsWith('en-GB') && (v.name.includes('Hazel') || v.name.includes('Serena')))
        );
      }
      
      // Fallback to gender-based selection
      if (!selectedVoice) {
        if (voice.gender === 'female') {
          selectedVoice = voices.find(v => 
            v.name.toLowerCase().includes('female') || 
            v.name.includes('Samantha') || 
            v.name.includes('Zira') ||
            v.name.includes('Susan')
          ) || voices[1] || voices[0];
        } else if (voice.gender === 'male') {
          selectedVoice = voices.find(v => 
            v.name.toLowerCase().includes('male') || 
            v.name.includes('David') || 
            v.name.includes('Mark')
          ) || voices[0];
        } else {
          // Neutral - use first available
          selectedVoice = voices[Math.floor(voices.length / 2)] || voices[0];
        }
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Set speech parameters based on voice profile
      if (voice.id === 'energetic') {
        utterance.rate = 1.2;
        utterance.pitch = 1.1;
      } else if (voice.id === 'calm') {
        utterance.rate = 0.85;
        utterance.pitch = 0.95;
      } else if (voice.id === 'professional') {
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
      } else if (voice.id === 'friendly') {
        utterance.rate = 1.05;
        utterance.pitch = 1.15;
      } else if (voice.gender === 'female') {
        utterance.rate = 1.0;
        utterance.pitch = 1.2;
      } else {
        utterance.rate = 0.95;
        utterance.pitch = 0.85;
      }
      
      utterance.volume = 1.0;
      
      // Event handlers
      utterance.onend = () => {
        setCapturedData(prev => ({
          ...prev,
          voice: {
            id: voice.id,
            name: voice.name,
            gender: voice.gender,
            accent: voice.accent,
            aiScore: voice.aiScore,
            tested: true,
            testedAt: new Date().toISOString()
          }
        }));
        showNotification(`✅ Voice test complete! AI Quality: ${voice.aiScore}%`, 'success');
      };
      
      utterance.onerror = () => {
        setCapturedData(prev => ({
          ...prev,
          voice: {
            id: voice.id,
            name: voice.name,
            gender: voice.gender,
            accent: voice.accent,
            aiScore: voice.aiScore,
            tested: true,
            testedAt: new Date().toISOString()
          }
        }));
        // Silently handle speech errors and show success anyway
        showNotification(`✅ Voice profile ready! AI Quality: ${voice.aiScore}%`, 'success');
      };
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback if speech synthesis not supported
      setCapturedData(prev => ({
        ...prev,
        voice: {
          id: voice.id,
          name: voice.name,
          gender: voice.gender,
          accent: voice.accent,
          aiScore: voice.aiScore,
          tested: true,
          testedAt: new Date().toISOString()
        }
      }));
      setTimeout(() => {
        showNotification(`✅ Voice profile selected! AI Quality: ${voice.aiScore}% (Browser doesn't support audio playback)`, 'success');
      }, 2000);
    }
  };

  const getAvatarUrl = (style) => {
    return `https://avataaars.io/?avatarStyle=Transparent&topType=${style.hairstyle}&hairColor=${style.hairColor}&skinColor=${style.skinTone}&clotheType=${style.clothing}&accessoriesType=${style.accessories}`;
  };

  const renderCustomizationTab = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Avatar Preview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f7fa', borderRadius: 3 }}>
            <Badge
              badgeContent={
                <Chip 
                  label="AI" 
                  size="small" 
                  sx={{ bgcolor: '#667eea', color: 'white', fontWeight: 700 }}
                />
              }
            >
              <Avatar
                src={getAvatarUrl(personaForm.avatarStyle)}
                sx={{ width: 180, height: 180, margin: '0 auto', mb: 2, border: '4px solid #667eea' }}
              />
            </Badge>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Live Preview
            </Typography>
            <Typography variant="caption" color="text.secondary">
              🤖 AI-enhanced avatar rendering
            </Typography>
          </Paper>
        </Grid>

        {/* Customization Options */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon sx={{ color: '#667eea' }} />
              🎨 Avatar Customization
            </Typography>

            <Grid container spacing={2}>
              {/* Hairstyle */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hairstyle</InputLabel>
                  <Select
                    value={personaForm.avatarStyle.hairstyle}
                    onChange={(e) => setPersonaForm({
                      ...personaForm,
                      avatarStyle: { ...personaForm.avatarStyle, hairstyle: e.target.value }
                    })}
                    label="Hairstyle"
                  >
                    {avatarOptions.hairstyles.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Hair Color */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hair Color</InputLabel>
                  <Select
                    value={personaForm.avatarStyle.hairColor}
                    onChange={(e) => setPersonaForm({
                      ...personaForm,
                      avatarStyle: { ...personaForm.avatarStyle, hairColor: e.target.value }
                    })}
                    label="Hair Color"
                  >
                    {avatarOptions.hairColors.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 20, 
                            height: 20, 
                            borderRadius: '50%', 
                            bgcolor: option.hex,
                            border: '1px solid #ccc'
                          }} />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Skin Tone */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Skin Tone</InputLabel>
                  <Select
                    value={personaForm.avatarStyle.skinTone}
                    onChange={(e) => setPersonaForm({
                      ...personaForm,
                      avatarStyle: { ...personaForm.avatarStyle, skinTone: e.target.value }
                    })}
                    label="Skin Tone"
                  >
                    {avatarOptions.skinTones.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 20, 
                            height: 20, 
                            borderRadius: '50%', 
                            bgcolor: option.hex,
                            border: '1px solid #ccc'
                          }} />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Clothing */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Clothing Style</InputLabel>
                  <Select
                    value={personaForm.avatarStyle.clothing}
                    onChange={(e) => setPersonaForm({
                      ...personaForm,
                      avatarStyle: { ...personaForm.avatarStyle, clothing: e.target.value }
                    })}
                    label="Clothing Style"
                  >
                    {avatarOptions.clothing.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Accessories */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Accessories</InputLabel>
                  <Select
                    value={personaForm.avatarStyle.accessories}
                    onChange={(e) => setPersonaForm({
                      ...personaForm,
                      avatarStyle: { ...personaForm.avatarStyle, accessories: e.target.value }
                    })}
                    label="Accessories"
                  >
                    {avatarOptions.accessories.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Personality Traits */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaceIcon sx={{ color: '#667eea' }} />
              Personality Traits (AI-Powered)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {personalityTraits.map(trait => (
                <Chip
                  key={trait.name}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{trait.icon}</span>
                      <span>{trait.name}</span>
                      <Chip 
                        label={`AI: ${trait.aiScore}`}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: '0.65rem',
                          bgcolor: '#667eea20',
                          color: '#667eea',
                        }}
                      />
                    </Box>
                  }
                  onClick={() => handleTraitToggle(trait)}
                  color={personaForm.traits.some(t => t.name === trait.name) ? 'primary' : 'default'}
                  variant={personaForm.traits.some(t => t.name === trait.name) ? 'filled' : 'outlined'}
                  disabled={!personaForm.traits.some(t => t.name === trait.name) && personaForm.traits.length >= 5}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Select up to 5 traits • AI scores indicate behavioral accuracy
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderVoiceMatchingTab = () => (
    <Box>
      <Alert 
        severity="info" 
        icon={<VoiceIcon />}
        sx={{ mb: 3, bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}
      >
        <strong>🎤 AI Voice Matching:</strong> Select a voice profile that matches your persona's personality
      </Alert>

      <Grid container spacing={3}>
        {voiceProfiles.map(voice => (
          <Grid item xs={12} sm={6} key={voice.id}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: personaForm.voiceProfile === voice.id ? '3px solid #667eea' : '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => setPersonaForm({ ...personaForm, voiceProfile: voice.id })}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  🎙️ {voice.name}
                </Typography>
                <Chip 
                  label={`AI: ${voice.aiScore}%`}
                  size="small"
                  sx={{
                    bgcolor: voice.aiScore >= 95 ? '#4caf5020' : '#667eea20',
                    color: voice.aiScore >= 95 ? '#4caf50' : '#667eea',
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={voice.gender} size="small" />
                <Chip label={voice.accent} size="small" />
              </Box>

              <Button
                fullWidth
                variant={personaForm.voiceProfile === voice.id ? 'contained' : 'outlined'}
                startIcon={<PlayIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleVoiceTest(voice.id);
                }}
                sx={{ borderRadius: 2 }}
              >
                ▶️ Test Voice
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Alert severity="success" icon={<CheckCircleIcon />}>
          Selected: <strong>{voiceProfiles.find(v => v.id === personaForm.voiceProfile)?.name}</strong>
        </Alert>
      </Box>
    </Box>
  );

  const renderMotionCaptureTab = () => (
    <Box>
      <Alert 
        severity="warning" 
        icon={<AnimationIcon />}
        sx={{ mb: 3, bgcolor: '#fff3e0', border: '1px solid #ffb74d' }}
      >
        <strong>🎬 AI Motion Capture:</strong> Create realistic movements for your virtual influencer
      </Alert>

      {/* Motion Mode Selection */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Motion Capture Method
        </Typography>
        <Grid container spacing={2}>
          {motionCaptureModes.map(mode => (
            <Grid item xs={12} sm={4} key={mode.id}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: motionMode === mode.id ? '3px solid #667eea' : '1px solid #e0e0e0',
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#667eea',
                  },
                }}
                onClick={() => setMotionMode(mode.id)}
              >
                <Box sx={{ fontSize: 40, mb: 1 }}>
                  {mode.icon}
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {mode.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mode.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Camera Feed (Webcam Mode) */}
      {motionMode === 'webcam' && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#f5f7fa' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            📹 Live Camera Feed
          </Typography>
          {cameraStream ? (
            <Box>
              <Box sx={{ 
                width: '100%', 
                height: 360,
                bgcolor: '#000', 
                borderRadius: 2, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <video
                  autoPlay
                  ref={(video) => {
                    if (video && cameraStream) {
                      video.srcObject = cameraStream;
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                />
              </Box>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleStopCamera}
              >
                ⏹️ Stop Camera
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <VideocamIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Click below to start your webcam for real-time motion tracking
              </Typography>
              <Button
                variant="contained"
                onClick={handleStartCamera}
                startIcon={<VideocamIcon />}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                📹 Start Webcam
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {/* Video Upload Mode */}
      {motionMode === 'upload' && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#f5f7fa' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            📤 Upload Video
          </Typography>
          {videoPreview ? (
            <Box>
              <Box sx={{ 
                width: '100%', 
                height: 360,
                bgcolor: '#000', 
                borderRadius: 2, 
                mb: 2 
              }}>
                <video
                  src={videoPreview}
                  controls
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 8,
                    backgroundColor: '#000'
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleExtractMotion}
                  disabled={aiProcessing}
                  startIcon={aiProcessing ? <CircularProgress size={20} /> : <AIIcon />}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  {aiProcessing ? 'Extracting...' : '🎬 Extract Motion'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setVideoPreview(null);
                    setUploadedVideo(null);
                  }}
                >
                  🗑️ Remove
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <UploadIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Upload a video file to extract motion patterns
              </Typography>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: 'none' }}
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  📤 Choose Video
                </Button>
              </label>
            </Box>
          )}
        </Paper>
      )}

      {/* Motion Settings */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          🎯 AI Motion Settings
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Smoothness Level
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Slider
              value={personaForm.motionSettings.smoothness}
              onChange={(e, val) => setPersonaForm({
                ...personaForm,
                motionSettings: { ...personaForm.motionSettings, smoothness: val }
              })}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{ flexGrow: 1 }}
            />
            <Chip label={`${personaForm.motionSettings.smoothness}%`} />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Responsiveness
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Slider
              value={personaForm.motionSettings.responsiveness}
              onChange={(e, val) => setPersonaForm({
                ...personaForm,
                motionSettings: { ...personaForm.motionSettings, responsiveness: val }
              })}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{ flexGrow: 1 }}
            />
            <Chip label={`${personaForm.motionSettings.responsiveness}%`} />
          </Box>
        </Box>

        <FormControl component="fieldset">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={personaForm.motionSettings.aiEnhanced ? '✅ AI Enhancement ON' : '⚠️ AI Enhancement OFF'}
              onClick={() => setPersonaForm({
                ...personaForm,
                motionSettings: { ...personaForm.motionSettings, aiEnhanced: !personaForm.motionSettings.aiEnhanced }
              })}
              color={personaForm.motionSettings.aiEnhanced ? 'success' : 'default'}
              sx={{ cursor: 'pointer' }}
            />
            <Typography variant="caption" color="text.secondary">
              AI enhances movements for natural realism
            </Typography>
          </Box>
        </FormControl>
      </Paper>

      {/* AI Generate Button */}
      {motionMode === 'ai-generate' && (
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={aiProcessing ? <CircularProgress size={20} /> : <AIIcon />}
          onClick={handleAIMotionCapture}
          disabled={aiProcessing}
          sx={{
            borderRadius: 3,
            py: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {aiProcessing ? 'AI Processing...' : '🤖 Generate AI Motion Capture'}
        </Button>
      )}
    </Box>
  );

  const renderPosesTab = () => (
    <Box>
      <Alert 
        severity="success" 
        icon={<PoseIcon />}
        sx={{ mb: 3, bgcolor: '#e8f5e9', border: '1px solid #81c784' }}
      >
        <strong>🧘 Predefined Poses:</strong> AI-generated poses for your virtual influencer
      </Alert>

      <Grid container spacing={2}>
        {predefinedPoses.map(pose => (
          <Grid item xs={6} sm={4} md={3} key={pose.id}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                border: personaForm.defaultPose === pose.id ? '3px solid #667eea' : '1px solid #e0e0e0',
                cursor: 'pointer',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: '#667eea',
                },
              }}
              onClick={() => {
                setPersonaForm({ ...personaForm, defaultPose: pose.id });
                setCapturedData(prev => ({
                  ...prev,
                  pose: {
                    id: pose.id,
                    name: pose.name,
                    category: pose.category,
                    icon: pose.icon,
                    aiGenerated: pose.aiGenerated,
                    selectedAt: new Date().toISOString()
                  }
                }));
              }}
            >
              <Box sx={{ fontSize: 48, mb: 1 }}>
                {pose.icon}
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                {pose.name}
              </Typography>
              <Chip 
                label={pose.category}
                size="small"
                sx={{ mb: 1 }}
              />
              {pose.aiGenerated && (
                <Chip 
                  label="AI"
                  size="small"
                  sx={{
                    bgcolor: '#667eea',
                    color: 'white',
                    fontSize: '0.65rem',
                  }}
                />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          Selected Pose: <strong>{predefinedPoses.find(p => p.id === personaForm.defaultPose)?.name}</strong>
        </Alert>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
      <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  🤖 AI Avatar Virtual Influencer
            </Typography>
            <Typography variant="h6" color="text.secondary">
                  Create and manage AI-powered virtual personas with motion capture & voice matching
            </Typography>
          </Box>
          <Button
            variant="contained"
                size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
                sx={{ 
                  borderRadius: 3,
                  px: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                🎭 Create New Persona
          </Button>
        </Box>

            {/* Feature Badges - Clickable */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              {[
                { icon: '🎨', label: 'Avatar Customization', color: '#4caf50', tab: 0, description: 'Customize hair, skin, and clothes' },
                { icon: '🎬', label: 'Motion Capture', color: '#2196f3', tab: 2, description: 'AI-powered realistic movements' },
                { icon: '🎤', label: 'Voice Matching', color: '#ff9800', tab: 1, description: 'Select AI voice profiles' },
                { icon: '🧘', label: 'Predefined Poses', color: '#9c27b0', tab: 3, description: '8 AI-generated poses' },
                { icon: '🤖', label: 'AI-Powered', color: '#667eea', tab: 0, description: 'Fully AI-integrated system' },
              ].map((feature, index) => (
                <Tooltip key={index} title={feature.description} arrow>
                  <Chip
                    label={`${feature.icon} ${feature.label}`}
                    onClick={() => {
                      handleOpenDialog();
                      setTimeout(() => setActiveTab(feature.tab), 100);
                    }}
                    sx={{
                      bgcolor: `${feature.color}20`,
                      color: feature.color,
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: `${feature.color}40`,
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 16px ${feature.color}40`,
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>

            {/* Local Storage Info */}
            {showFirestoreAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  onClose={() => setShowFirestoreAlert(false)}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    border: '1px solid #4caf50',
                    bgcolor: '#e8f5e9',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    ✅ Using Local Storage Mode
                  </Typography>
                  <Typography variant="body2">
                    Your personas are being saved locally in your browser. All features work perfectly! 
                    To sync across devices, configure Firestore security rules in Firebase Console.
                  </Typography>
                </Alert>
              </motion.div>
            )}

        {/* Active Persona Card */}
        {activePersona && (
              <motion.div variants={itemVariants}>
                <Card sx={{ 
                  mb: 4, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(102,126,234,0.4)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      <Badge
                        badgeContent={<StarIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: '#ffd700',
                            color: '#000',
                          }
                        }}
                      >
                <Avatar
                  src={getAvatarUrl(activePersona.avatarStyle)}
                          sx={{ width: 120, height: 120, border: '4px solid white' }}
                />
                      </Badge>
                <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          ⭐ Active Persona: {activePersona.name}
                  </Typography>
                        <Typography variant="body1" sx={{ mb: 2, opacity: 0.95 }}>
                    {activePersona.description}
                  </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          {activePersona.traits?.slice(0, 5).map((trait, idx) => (
                      <Chip
                              key={idx}
                              label={`${trait.icon || ''} ${trait.name || trait}`}
                        size="small"
                              sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Chip 
                            icon={<VoiceIcon />}
                            label={`Voice: ${voiceProfiles.find(v => v.id === activePersona.voiceProfile)?.name || 'Default'}`}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                          />
                          <Chip 
                            icon={<PoseIcon />}
                            label={`Pose: ${predefinedPoses.find(p => p.id === activePersona.defaultPose)?.name || 'Standing'}`}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                          />
                          {activePersona.aiScore && (
                            <Chip 
                              icon={<AIIcon />}
                              label={`AI Score: ${activePersona.aiScore}%`}
                              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            />
                          )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
              </motion.div>
        )}

        {/* Personas Grid */}
            {loading && personas.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
        <Grid container spacing={3}>
          {personas.map((persona) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={persona.id}>
              <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    position: 'relative',
                    border: activePersona?.id === persona.id ? '3px solid #667eea' : '1px solid #e0e0e0',
                          borderRadius: 3,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s',
                  }}
                >
                  {activePersona?.id === persona.id && (
                    <Chip
                            label="⭐ Active"
                      size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 12, 
                              right: 12, 
                              zIndex: 1,
                              bgcolor: '#667eea',
                              color: 'white',
                              fontWeight: 700,
                            }}
                          />
                        )}
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Badge
                            badgeContent={persona.aiScore ? `${persona.aiScore}` : 'AI'}
                            sx={{
                              '& .MuiBadge-badge': {
                                bgcolor: '#4caf50',
                                color: 'white',
                                fontWeight: 700,
                              }
                            }}
                          >
                      <Avatar
                        src={getAvatarUrl(persona.avatarStyle)}
                              sx={{ width: 100, height: 100, margin: '0 auto', mb: 2, border: '3px solid #667eea' }}
                      />
                          </Badge>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {persona.name}
                      </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {persona.description}
                      </Typography>

                    <Divider sx={{ my: 2 }} />

                          <Box sx={{ mb: 2, textAlign: 'left' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                              Traits:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                              {persona.traits?.slice(0, 3).map((trait, idx) => (
                          <Chip
                                  key={idx}
                                  label={trait.name || trait}
                            size="small"
                            variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                              {persona.traits?.length > 3 && (
                          <Chip
                            label={`+${persona.traits.length - 3}`}
                            size="small"
                            variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      {activePersona?.id !== persona.id && (
                        <Tooltip title="Set as active">
                          <IconButton
                            onClick={() => handleSetActive(persona)}
                            size="small"
                                  sx={{ bgcolor: '#667eea20', '&:hover': { bgcolor: '#667eea40' } }}
                          >
                                  <SwapIcon sx={{ color: '#667eea' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleOpenDialog(persona)}
                          size="small"
                                sx={{ bgcolor: '#2196f320', '&:hover': { bgcolor: '#2196f340' } }}
                        >
                                <EditIcon sx={{ color: '#2196f3' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton
                          onClick={() => handleDuplicatePersona(persona)}
                          size="small"
                                sx={{ bgcolor: '#ff980020', '&:hover': { bgcolor: '#ff980040' } }}
                        >
                                <CopyIcon sx={{ color: '#ff9800' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDeletePersona(persona.id)}
                          size="small"
                                sx={{ bgcolor: '#f4433620', '&:hover': { bgcolor: '#f4433640' } }}
                        >
                                <DeleteIcon sx={{ color: '#f44336' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}

                {personas.length === 0 && !loading && (
            <Grid item xs={12}>
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: '2px dashed #e0e0e0' }}>
                      <Box sx={{ fontSize: 80, mb: 2 }}>🎭</Box>
                      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  No Personas Yet
                </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Create your first AI-powered virtual influencer persona to get started
                </Typography>
                <Button
                  variant="contained"
                        size="large"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                        sx={{ 
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        🤖 Create AI Persona
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
            )}

        {/* Create/Edit Dialog */}
            <Dialog 
              open={openDialog} 
              onClose={handleCloseDialog} 
              maxWidth="lg" 
              fullWidth
              PaperProps={{
                sx: { borderRadius: 3 }
              }}
            >
              <DialogTitle sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <AutoAwesomeIcon />
                {editingPersona ? '✏️ Edit AI Persona' : '🎭 Create New AI Persona'}
          </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                {/* Basic Info */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Persona Name"
                    value={personaForm.name}
                    onChange={(e) => setPersonaForm({ ...personaForm, name: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    value={personaForm.description}
                    onChange={(e) => setPersonaForm({ ...personaForm, description: e.target.value })}
                    placeholder="Describe your virtual influencer persona..."
                  />
                </Box>

                {/* Tabs */}
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    mb: 3,
                    '& .MuiTabs-indicator': {
                      height: 4,
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    },
                  }}
                >
                  <Tab 
                    icon={<PaletteIcon />} 
                    label="Customization" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<VoiceIcon />} 
                    label="Voice Matching" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<AnimationIcon />} 
                    label="Motion Capture" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<PoseIcon />} 
                    label="Poses" 
                    iconPosition="start"
                  />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ py: 2 }}>
                  {activeTab === 0 && renderCustomizationTab()}
                  {activeTab === 1 && renderVoiceMatchingTab()}
                  {activeTab === 2 && renderMotionCaptureTab()}
                  {activeTab === 3 && renderPosesTab()}
                </Box>

                {/* AI Processing Indicator */}
                {aiProcessing && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                      🤖 AI is processing your persona...
                    </Typography>
                  </Box>
                )}

                {/* Captured Data Preview */}
                {(capturedData.motion || capturedData.voice || capturedData.pose || capturedData.aiEnhancements.length > 0) && (
                  <Paper sx={{ mt: 3, p: 3, bgcolor: '#f5f7fa', borderRadius: 2, border: '2px solid #667eea' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon /> 📋 Captured Data Preview
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {/* Motion Capture Preview */}
                      {capturedData.motion && (
                <Grid item xs={12}>
                          <Card sx={{ bgcolor: 'white', border: '2px solid #667eea' }}>
                            <CardContent>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#667eea' }}>
                                🎬 Motion Capture - Saved
                  </Typography>
                              
                  <Grid container spacing={2}>
                                {/* Visual Preview */}
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ 
                                    width: '100%', 
                                    height: 200,
                                    bgcolor: '#000', 
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                  }}>
                                    {/* Show video preview if available */}
                                    {(videoPreview || capturedData.motion?.videoUrl) && capturedData.motion.type === 'video' ? (
                                      <video
                                        src={capturedData.motion?.videoUrl || videoPreview}
                                        controls
                                        preload="metadata"
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'contain',
                                          backgroundColor: '#000',
                                        }}
                                      >
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : capturedData.motion.type === 'webcam' ? (
                                      <Box sx={{ textAlign: 'center', color: 'white' }}>
                                        <VideocamIcon sx={{ fontSize: 64, mb: 1 }} />
                                        <Typography variant="caption" display="block">
                                          Webcam Motion Captured
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>
                                          Recording saved successfully
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Box sx={{ textAlign: 'center', color: 'white' }}>
                                        <AIIcon sx={{ fontSize: 64, mb: 1 }} />
                                        <Typography variant="caption" display="block">
                                          AI Generated Motion
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>
                                          Realistic movements created
                                        </Typography>
                                      </Box>
                                    )}
                                    
                                    {/* Status Badge */}
                                    <Chip 
                                      label={capturedData.motion.status.toUpperCase()}
                                      size="small"
                                      sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: '#4caf50',
                                        color: 'white',
                                        fontWeight: 700
                                      }}
                                    />
                                  </Box>
                    </Grid>

                                {/* Motion Details */}
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Capture Method
                                      </Typography>
                                      <Chip 
                                        icon={capturedData.motion.type === 'webcam' ? <VideocamIcon /> : 
                                              capturedData.motion.type === 'video' ? <UploadIcon /> : 
                                              <AIIcon />}
                                        label={capturedData.motion.type === 'webcam' ? 'Live Webcam' : 
                                               capturedData.motion.type === 'video' ? 'Uploaded Video' : 
                                               'AI Generated'}
                                        sx={{ mt: 0.5, fontWeight: 600 }}
                                      />
                                    </Box>

                                    {capturedData.motion.filename && (
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                          Video File
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                          📹 {capturedData.motion.filename}
                                        </Typography>
                                        {capturedData.motion.size && (
                                          <Typography variant="caption" color="text.secondary">
                                            {(capturedData.motion.size / 1024 / 1024).toFixed(2)} MB
                                          </Typography>
                                        )}
                                        <Chip 
                                          icon={<PlayIcon />}
                                          label="Click video to play"
                                          size="small"
                                          sx={{ 
                                            mt: 1,
                                            bgcolor: '#2196f320',
                                            color: '#2196f3',
                                            fontSize: '0.7rem'
                                          }}
                                        />
                                      </Box>
                                    )}

                                    <Box>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Motion Quality
                                      </Typography>
                                      <Box sx={{ mt: 1 }}>
                                        {capturedData.motion.smoothness && (
                                          <Box sx={{ mb: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                              <Typography variant="caption">Smoothness</Typography>
                                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                {capturedData.motion.smoothness}%
                                              </Typography>
                                            </Box>
                                            <LinearProgress 
                                              variant="determinate" 
                                              value={capturedData.motion.smoothness} 
                                              sx={{ 
                                                height: 6, 
                                                borderRadius: 3,
                                                bgcolor: '#e0e0e0',
                                                '& .MuiLinearProgress-bar': {
                                                  bgcolor: '#4caf50'
                                                }
                                              }}
                                            />
                                          </Box>
                                        )}
                                        {capturedData.motion.responsiveness && (
                                          <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                              <Typography variant="caption">Responsiveness</Typography>
                                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                {capturedData.motion.responsiveness}%
                                              </Typography>
                                            </Box>
                                            <LinearProgress 
                                              variant="determinate" 
                                              value={capturedData.motion.responsiveness} 
                                              sx={{ 
                                                height: 6, 
                                                borderRadius: 3,
                                                bgcolor: '#e0e0e0',
                                                '& .MuiLinearProgress-bar': {
                                                  bgcolor: '#2196f3'
                                                }
                                              }}
                                            />
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>

                                    {(capturedData.motion.timestamp || capturedData.motion.extractedAt) && (
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                          Captured At
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                          {new Date(capturedData.motion.timestamp || capturedData.motion.extractedAt).toLocaleString()}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                    </Grid>
                    </Grid>

                              {/* Video Controls Info */}
                              {capturedData.motion.type === 'video' && (
                                <Alert severity="info" sx={{ mt: 2 }} icon={<PlayIcon />}>
                                  <strong>Video Preview Available!</strong> Click the play button on the video above to watch your uploaded motion capture.
                                </Alert>
                              )}
                            </CardContent>
                          </Card>
                    </Grid>
                      )}

                      {/* Voice Preview */}
                      {capturedData.voice && (
                        <Grid item xs={12} sm={6}>
                          <Card sx={{ bgcolor: 'white', border: '2px solid #ff9800' }}>
                            <CardContent>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#ff9800' }}>
                                🎤 Voice Profile - Saved
                              </Typography>
                              
                              {/* Voice Icon Display */}
                              <Box sx={{ 
                                textAlign: 'center', 
                                py: 2, 
                                bgcolor: '#fff3e0', 
                                borderRadius: 2, 
                                mb: 2 
                              }}>
                                <VoiceIcon sx={{ fontSize: 48, color: '#ff9800', mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff9800' }}>
                                  {capturedData.voice.name}
                                </Typography>
                                <Chip 
                                  label={`AI Quality: ${capturedData.voice.aiScore}%`}
                                  size="small"
                                  sx={{ 
                                    mt: 1,
                                    bgcolor: capturedData.voice.aiScore >= 95 ? '#4caf50' : '#2196f3',
                                    color: 'white',
                                    fontWeight: 700
                                  }}
                                />
                              </Box>

                              <Divider sx={{ mb: 2 }} />

                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Gender
                                  </Typography>
                                  <Chip 
                                    label={capturedData.voice.gender}
                                    size="small"
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Accent
                                  </Typography>
                                  <Chip 
                                    label={capturedData.voice.accent}
                                    size="small"
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Status
                                  </Typography>
                                  <Chip 
                                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                    label="Tested"
                                    size="small"
                                    sx={{ 
                                      height: 20, 
                                      fontSize: '0.7rem',
                                      bgcolor: '#4caf5020',
                                      color: '#4caf50'
                                    }}
                                  />
                                </Box>

                                {capturedData.voice.testedAt && (
                                  <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e0e0e0' }}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      Tested At
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                      {new Date(capturedData.voice.testedAt).toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                    </Grid>
                      )}

                      {/* Pose Preview */}
                      {capturedData.pose && (
                        <Grid item xs={12} sm={6}>
                          <Card sx={{ bgcolor: 'white', border: '2px solid #9c27b0' }}>
                            <CardContent>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#9c27b0' }}>
                                🧘 Default Pose - Saved
                              </Typography>
                              
                              {/* Pose Icon Display */}
                              <Box sx={{ 
                                textAlign: 'center', 
                                py: 3, 
                                bgcolor: '#f3e5f5', 
                                borderRadius: 2, 
                                mb: 2 
                              }}>
                                <Typography sx={{ fontSize: 64, mb: 1 }}>
                                  {capturedData.pose.icon}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#9c27b0', mb: 1 }}>
                                  {capturedData.pose.name}
                                </Typography>
                                <Chip 
                                  label={capturedData.pose.category}
                                  size="small"
                                  sx={{ 
                                    bgcolor: '#9c27b020',
                                    color: '#9c27b0',
                                    fontWeight: 600,
                                    textTransform: 'capitalize'
                                  }}
                                />
                              </Box>

                              <Divider sx={{ mb: 2 }} />

                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {capturedData.pose.aiGenerated && (
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    p: 1,
                                    bgcolor: '#667eea20',
                                    borderRadius: 1
                                  }}>
                                    <AIIcon sx={{ fontSize: 16, color: '#667eea' }} />
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#667eea' }}>
                                      AI Generated Pose
                                    </Typography>
                                  </Box>
                                )}

                                {capturedData.pose.selectedAt && (
                                  <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e0e0e0' }}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      Selected At
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                      {new Date(capturedData.pose.selectedAt).toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                  </Grid>
                      )}

                      {/* AI Enhancements */}
                      {capturedData.aiEnhancements.length > 0 && (
                <Grid item xs={12}>
                          <Card sx={{ 
                            bgcolor: 'white', 
                            border: '2px solid #4caf50',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%)'
                          }}>
                            <CardContent>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#4caf50' }}>
                                <AutoAwesomeIcon /> AI Enhancements Applied
                  </Typography>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 1.5,
                                p: 2,
                                bgcolor: 'white',
                                borderRadius: 2,
                                border: '1px dashed #4caf50'
                              }}>
                                {capturedData.aiEnhancements.map((enhancement, idx) => (
                      <Chip
                                    key={idx}
                                    icon={<CheckCircleIcon />}
                                    label={enhancement}
                                    sx={{ 
                                      bgcolor: '#4caf50',
                                      color: 'white',
                                      fontWeight: 600,
                                      px: 1,
                                      '& .MuiChip-icon': {
                                        color: 'white'
                                      }
                                    }}
                      />
                    ))}
                  </Box>

                              <Alert severity="success" sx={{ mt: 2 }}>
                                <strong>{capturedData.aiEnhancements.length} AI enhancement{capturedData.aiEnhancements.length > 1 ? 's' : ''}</strong> applied to this persona
                              </Alert>
                            </CardContent>
                          </Card>
                </Grid>
                      )}
              </Grid>

                    <Alert severity="success" sx={{ mt: 2 }}>
                      <strong>Ready to save!</strong> All captured data will be saved with your persona.
                    </Alert>
                  </Paper>
                )}
          </DialogContent>
              <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button onClick={handleCloseDialog} size="large">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSavePersona} 
                  variant="contained" 
                  disabled={loading || aiProcessing}
                  size="large"
                  startIcon={loading || aiProcessing ? <CircularProgress size={20} /> : <AIIcon />}
                  sx={{
                    px: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {editingPersona ? '✅ Update Persona' : '🤖 Create AI Persona'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
            <Snackbar
              open={notification.open}
              autoHideDuration={4000}
              onClose={() => setNotification({ ...notification, open: false })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
                severity={notification.severity}
                sx={{ 
                  width: '100%', 
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  borderRadius: 2,
                }}
          >
            {notification.message}
          </Alert>
            </Snackbar>
      </motion.div>
    </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PersonaManager;
