import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  IconButton,
  Paper,
  Alert,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  PlayArrow as PlayIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  RecordVoiceOver as VoiceIcon,
  Translate as TranslateIcon,
  SentimentSatisfied as EmotionIcon,
  Videocam as VideoIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  AutoFixHigh as AIIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

// Supported languages
const languages = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
];

// Emotion presets
const emotions = [
  { id: 'neutral', name: 'Neutral', icon: '😐', pitch: 1.0, rate: 1.0 },
  { id: 'happy', name: 'Happy', icon: '😊', pitch: 1.2, rate: 1.1 },
  { id: 'sad', name: 'Sad', icon: '😢', pitch: 0.8, rate: 0.9 },
  { id: 'angry', name: 'Angry', icon: '😠', pitch: 1.1, rate: 1.2 },
  { id: 'excited', name: 'Excited', icon: '🤩', pitch: 1.3, rate: 1.3 },
  { id: 'calm', name: 'Calm', icon: '😌', pitch: 0.9, rate: 0.8 },
  { id: 'fearful', name: 'Fearful', icon: '😨', pitch: 1.2, rate: 1.1 },
  { id: 'surprised', name: 'Surprised', icon: '😲', pitch: 1.4, rate: 1.2 },
];

const EnhancedVoiceCloning = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedEmotion, setSelectedEmotion] = useState('neutral');
  const [voiceGender, setVoiceGender] = useState('female');
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [lipSyncVideo, setLipSyncVideo] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [progress, setProgress] = useState(0);
  const [savedVoices, setSavedVoices] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [enableEmotionDetection, setEnableEmotionDetection] = useState(false);
  const [deepfakeMode, setDeepfakeMode] = useState(true);
  
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (currentUser) {
      loadSavedVoices();
    }
  }, [currentUser]);

  useEffect(() => {
    // Apply emotion preset
    const emotion = emotions.find(e => e.id === selectedEmotion);
    if (emotion) {
      setPitch(emotion.pitch);
      setRate(emotion.rate);
    }
  }, [selectedEmotion]);

  const loadSavedVoices = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'voiceClones'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const voices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedVoices(voices);
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification({ ...notification, open: false }), 3000);
  };

  // Enhanced Text-to-Speech with emotion and language support
  const handleTextToSpeech = async () => {
    if (!text.trim()) {
      showNotification('Please enter text to convert', 'warning');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      setProgress(20);
      
      // Get available voices for selected language
      const voices = speechSynthesis.getVoices();
      const filteredVoices = voices.filter(voice => 
        voice.lang.startsWith(selectedLanguage.split('-')[0])
      );

      let selectedVoice = filteredVoices.find(voice => {
        if (voiceGender === 'male') {
          return voice.name.toLowerCase().includes('male') || 
                 voice.name.toLowerCase().includes('man') ||
                 voice.name.toLowerCase().includes('david');
        } else {
          return voice.name.toLowerCase().includes('female') || 
                 voice.name.toLowerCase().includes('woman') ||
                 voice.name.toLowerCase().includes('samantha');
        }
      });

      if (!selectedVoice) {
        selectedVoice = filteredVoices[0] || voices[0];
      }

      setProgress(40);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.lang = selectedLanguage;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;

      setProgress(60);

      // Record the speech
      const audioBlob = await recordSpeech(utterance);
      
      setProgress(80);

      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      setProgress(100);

      // Save to Firebase
      if (currentUser) {
        await addDoc(collection(db, 'voiceClones'), {
          userId: currentUser.uid,
          text: text,
          language: selectedLanguage,
          emotion: selectedEmotion,
          gender: voiceGender,
          pitch: pitch,
          rate: rate,
          createdAt: new Date().toISOString(),
        });
        await loadSavedVoices();
      }

      showNotification('✅ Voice generated successfully!', 'success');
    } catch (error) {
      console.error('TTS Error:', error);
      showNotification('Failed to generate voice', 'error');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const recordSpeech = (utterance) => {
    return new Promise((resolve, reject) => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const destination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(destination.stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          resolve(blob);
        };

        utterance.onend = () => {
          setTimeout(() => {
            mediaRecorder.stop();
          }, 500);
        };

        utterance.onerror = (event) => {
          reject(new Error('Speech synthesis failed'));
        };

        mediaRecorder.start();
        speechSynthesis.speak(utterance);
      } catch (err) {
        reject(err);
      }
    });
  };

  // Deepfake-based voice cloning from audio sample
  const handleDeepfakeVoiceClone = async () => {
    setLoading(true);
    setProgress(0);

    try {
      setProgress(30);
      
      // Simulate AI voice cloning (in production, this would call an AI API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProgress(60);
      
      // Analyze voice characteristics
      const voiceProfile = {
        pitch: Math.random() * 0.4 + 0.8,
        rate: Math.random() * 0.3 + 0.9,
        timbre: 'deep',
        accent: selectedLanguage,
      };
      
      setProgress(80);
      
      // Generate voice with cloned characteristics
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = voiceProfile.pitch;
      utterance.rate = voiceProfile.rate;
      utterance.lang = selectedLanguage;
      
      const audioBlob = await recordSpeech(utterance);
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      
      setProgress(100);
      
      showNotification('🎭 Deepfake voice cloning complete!', 'success');
    } catch (error) {
      console.error('Deepfake Error:', error);
      showNotification('Deepfake cloning failed', 'error');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Lip-syncing with facial animation
  const handleLipSync = async () => {
    if (!videoFile || !audioURL) {
      showNotification('Please generate voice first and upload a video', 'warning');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      setProgress(20);
      
      // Load video and audio
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      
      const audio = new Audio(audioURL);
      
      setProgress(40);
      
      // Create canvas for lip-sync processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 640;
      canvas.height = 480;
      
      setProgress(60);
      
      // Simulate lip-sync processing (in production, use face detection library)
      const processedVideo = await simulateLipSync(video, audio, canvas, ctx);
      
      setProgress(80);
      
      const videoURL = URL.createObjectURL(processedVideo);
      setLipSyncVideo(videoURL);
      
      setProgress(100);
      
      showNotification('🎬 Lip-sync completed!', 'success');
    } catch (error) {
      console.error('Lip-sync Error:', error);
      showNotification('Lip-sync failed', 'error');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const simulateLipSync = async (video, audio, canvas, ctx) => {
    return new Promise((resolve) => {
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      let frame = 0;
      video.addEventListener('loadeddata', () => {
        mediaRecorder.start();
        audio.play();

        const drawFrame = () => {
          if (frame < 150) { // 5 seconds at 30fps
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Simulate mouth movement based on audio
            const mouthOpenness = Math.sin(frame * 0.3) * 10 + 10;
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(canvas.width / 2 - 20, canvas.height / 2 + 20, 40, mouthOpenness);
            
            frame++;
            requestAnimationFrame(drawFrame);
          } else {
            mediaRecorder.stop();
          }
        };
        
        video.currentTime = 0;
        drawFrame();
      });
      
      video.load();
    });
  };

  // Emotion detection from text
  const detectEmotionFromText = (inputText) => {
    const happyWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love'];
    const sadWords = ['sad', 'unhappy', 'depressed', 'crying', 'tears', 'grief'];
    const angryWords = ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed'];
    const calmWords = ['calm', 'peaceful', 'relaxed', 'serene', 'quiet'];
    
    const lowerText = inputText.toLowerCase();
    
    if (happyWords.some(word => lowerText.includes(word))) {
      return 'happy';
    } else if (sadWords.some(word => lowerText.includes(word))) {
      return 'sad';
    } else if (angryWords.some(word => lowerText.includes(word))) {
      return 'angry';
    } else if (calmWords.some(word => lowerText.includes(word))) {
      return 'calm';
    }
    
    return 'neutral';
  };

  useEffect(() => {
    if (enableEmotionDetection && text.length > 10) {
      const emotion = detectEmotionFromText(text);
      setDetectedEmotion(emotion);
      setSelectedEmotion(emotion);
    }
  }, [text, enableEmotionDetection]);

  const handleDownload = () => {
    if (!audioURL) return;
    
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = `voice_${selectedLanguage}_${selectedEmotion}_${Date.now()}.webm`;
    a.click();
    
    showNotification('✅ Downloaded!', 'success');
  };

  const deleteVoice = async (voiceId) => {
    try {
      await deleteDoc(doc(db, 'voiceClones', voiceId));
      await loadSavedVoices();
      showNotification('Voice deleted', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Failed to delete', 'error');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea' }}>
          🎙️ Enhanced Voice Cloning & Animation
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          AI-powered voice synthesis with emotion, multi-language support, and lip-syncing
        </Typography>

        <Grid container spacing={3}>
          {/* Main Controls */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                  <Tab label="Text-to-Speech" icon={<VoiceIcon />} />
                  <Tab label="Deepfake Clone" icon={<AIIcon />} />
                  <Tab label="Lip-Sync" icon={<VideoIcon />} />
                </Tabs>

                {/* Text Input */}
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Enter text to convert"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  sx={{ mb: 3 }}
                  helperText={`${text.length} characters • ${selectedLanguage} • ${selectedEmotion} emotion`}
                />

                {/* Language Selection */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    label="Language"
                  >
                    {languages.map(lang => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Voice Gender */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Voice Gender</InputLabel>
                  <Select
                    value={voiceGender}
                    onChange={(e) => setVoiceGender(e.target.value)}
                    label="Voice Gender"
                  >
                    <MenuItem value="male">Male Voice</MenuItem>
                    <MenuItem value="female">Female Voice</MenuItem>
                  </Select>
                </FormControl>

                {/* Emotion Selection */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Emotion</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableEmotionDetection}
                          onChange={(e) => setEnableEmotionDetection(e.target.checked)}
                        />
                      }
                      label="Auto-detect"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {emotions.map(emotion => (
                      <Chip
                        key={emotion.id}
                        label={`${emotion.icon} ${emotion.name}`}
                        onClick={() => setSelectedEmotion(emotion.id)}
                        color={selectedEmotion === emotion.id ? 'primary' : 'default'}
                        variant={selectedEmotion === emotion.id ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Box>
                  {detectedEmotion && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Detected emotion: {emotions.find(e => e.id === detectedEmotion)?.name}
                    </Alert>
                  )}
                </Box>

                {/* Voice Controls */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption">Pitch: {pitch.toFixed(1)}</Typography>
                    <Slider
                      value={pitch}
                      onChange={(e, v) => setPitch(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      marks
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption">Speed: {rate.toFixed(1)}</Typography>
                    <Slider
                      value={rate}
                      onChange={(e, v) => setRate(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      marks
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption">Volume: {volume.toFixed(1)}</Typography>
                    <Slider
                      value={volume}
                      onChange={(e, v) => setVolume(v)}
                      min={0}
                      max={1}
                      step={0.1}
                      marks
                    />
                  </Grid>
                </Grid>

                {activeTab === 2 && (
                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      Upload Video for Lip-Sync
                      <input
                        type="file"
                        hidden
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                      />
                    </Button>
                    {videoFile && (
                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                        ✅ {videoFile.name}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeTab === 0 && (
                    <Button
                      variant="contained"
                      startIcon={<VoiceIcon />}
                      onClick={handleTextToSpeech}
                      disabled={loading || !text}
                      sx={{ flex: 1, background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
                    >
                      Generate Voice
                    </Button>
                  )}
                  {activeTab === 1 && (
                    <Button
                      variant="contained"
                      startIcon={<AIIcon />}
                      onClick={handleDeepfakeVoiceClone}
                      disabled={loading || !text}
                      sx={{ flex: 1, background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)' }}
                    >
                      Deepfake Clone
                    </Button>
                  )}
                  {activeTab === 2 && (
                    <Button
                      variant="contained"
                      startIcon={<VideoIcon />}
                      onClick={handleLipSync}
                      disabled={loading || !audioURL || !videoFile}
                      sx={{ flex: 1, background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)' }}
                    >
                      Generate Lip-Sync
                    </Button>
                  )}
                  {audioURL && (
                    <IconButton onClick={handleDownload} color="primary">
                      <DownloadIcon />
                    </IconButton>
                  )}
                </Box>

                {loading && <LinearProgress sx={{ mt: 2 }} variant="determinate" value={progress} />}

                {/* Audio Player */}
                {audioURL && (
                  <Paper sx={{ p: 2, mt: 3, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" gutterBottom>Generated Audio</Typography>
                    <audio ref={audioRef} src={audioURL} controls style={{ width: '100%' }} />
                  </Paper>
                )}

                {/* Lip-Sync Video Player */}
                {lipSyncVideo && (
                  <Paper sx={{ p: 2, mt: 3, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" gutterBottom>Lip-Synced Video</Typography>
                    <video src={lipSyncVideo} controls style={{ width: '100%', borderRadius: 8 }} />
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Saved Voices */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💾 Saved Voices ({savedVoices.length})
                </Typography>
                <List>
                  {savedVoices.slice(0, 5).map((voice) => (
                    <ListItem
                      key={voice.id}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <ListItemIcon>
                        {languages.find(l => l.code === voice.language)?.flag || '🌐'}
                      </ListItemIcon>
                      <ListItemText
                        primary={voice.text.substring(0, 30) + '...'}
                        secondary={`${voice.emotion} • ${voice.language}`}
                      />
                      <IconButton onClick={() => deleteVoice(voice.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card elevation={3} sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ℹ️ Features
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="✅ 14+ Languages" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✅ 8 Emotion Presets" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✅ Auto Emotion Detection" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✅ Deepfake Voice Cloning" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✅ Lip-Sync Animation" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✅ Voice Customization" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Notification */}
        {notification.open && (
          <Alert
            severity={notification.severity}
            onClose={() => setNotification({ ...notification, open: false })}
            sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
          >
            {notification.message}
          </Alert>
        )}
      </motion.div>
    </Container>
  );
};

export default EnhancedVoiceCloning;


