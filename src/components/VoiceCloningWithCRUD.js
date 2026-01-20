import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';

const VoiceCloningWithCRUD = () => {
  const { currentUser } = useAuth();
  
  // Preset voices state
  const [text, setText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Voice upload cloning state (for future features)
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [voiceSamples, setVoiceSamples] = useState([]);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [showProjects, setShowProjects] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Load projects from database on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadProjectsFromDB = async () => {
      if (!currentUser) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/voice/projects?user_id=${currentUser.uid}`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setProjects(data);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading projects:', error);
        }
      }
    };
    
    if (currentUser) {
      loadProjectsFromDB();
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const loadProjectsFromDB = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/voice/projects?user_id=${currentUser.uid}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  // Handle result changes
  useEffect(() => {
    // Reset playing state when new result
    setIsPlaying(false);
    
    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }, [result]);

  // Load voice samples from backend
  const loadVoiceSamples = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/voice-samples/user/${currentUser.uid}`);
      setVoiceSamples(response.data.samples || []);
    } catch (err) {
      console.error('Error loading voice samples:', err);
    }
  };

  // Commented out unused functions - reserved for future features
  /* 
  const handleFileSelect = (e) => { ... };
  const handleUploadAndProcess = async () => { ... };
  const handleCloneVoiceFromSample = async () => { ... };
  const handleDeleteSample = async (sampleId) => { ... };
  */

  // Available voices with characteristics - Multiple voice engines for variety
  const voices = [
    { 
      id: 'default', 
      name: 'Default Voice', 
      icon: '🎤',
      gender: 'neutral', 
      pitch: 1.0, 
      rate: 1.0,
      voiceNames: ['Microsoft Zira', 'Google US English Female', 'Google UK English Female', 'Female']
    },
    { 
      id: 'man', 
      name: 'Man (Adult Male)', 
      icon: '👨',
      gender: 'male', 
      pitch: 0.7,  // Deep masculine
      rate: 1.0,   // Normal speed
      voiceNames: ['Microsoft David', 'Microsoft Mark', 'Microsoft Richard', 'Google US English Male', 'Google UK English Male', 'Male']
    },
    { 
      id: 'woman', 
      name: 'Woman (Adult Female)', 
      icon: '👩',
      gender: 'female', 
      pitch: 1.4,  // Higher feminine
      rate: 1.1,   // Slightly faster
      voiceNames: ['Microsoft Hazel', 'Microsoft Susan', 'Microsoft Linda', 'Google US English Female', 'Google UK English Female', 'Female']
    },
    { 
      id: 'boy', 
      name: 'Boy (Young Male)', 
      icon: '👦',
      gender: 'boy', 
      pitch: 1.6,  // High young voice
      rate: 1.3,   // Energetic fast
      voiceNames: ['Microsoft George', 'Microsoft Mark', 'Google UK English Male', 'Male']
    },
    { 
      id: 'girl', 
      name: 'Girl (Young Female)', 
      icon: '👧',
      gender: 'girl', 
      pitch: 1.7,  // Very high
      rate: 1.4,   // Fast and excited
      voiceNames: ['Microsoft Hazel', 'Microsoft Susan', 'Google UK English Female', 'Female']
    },
    { 
      id: 'child', 
      name: 'Child (Playful)', 
      icon: '👶',
      gender: 'child', 
      pitch: 1.8,  // Extremely high - childlike
      rate: 1.5,   // Very fast - energetic
      voiceNames: ['Microsoft Hazel', 'Google UK English Female', 'Female']
    },
    { 
      id: 'elderly', 
      name: 'Elderly (Wise)', 
      icon: '👴',
      gender: 'elderly', 
      pitch: 0.75, // Lower mature voice
      rate: 0.8,   // Slower deliberate speech
      voiceNames: ['Microsoft David', 'Microsoft George', 'Google US English Male', 'Male']
    }
  ];

  // CREATE - Save new project to database
  const saveProject = async () => {
    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    if (!text.trim() && !result) {
      setError('Please create some content before saving');
      return;
    }

    if (!currentUser) {
      setError('Please login to save projects');
      return;
    }

    try {
      const projectData = {
        user_id: currentUser.uid,
        name: projectName.trim(),
        text: text,
        selectedVoice: selectedVoice,
        audioUrl: result?.audioUrl || null,
        resultData: JSON.stringify(result)
      };

      const response = await fetch('http://localhost:5000/api/voice/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        await response.json(); // Consume the response
        await loadProjectsFromDB();
        setProjectName('');
        setError(null);
        alert('✅ Project saved successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save project');
      }
    } catch (err) {
      setError('Failed to save project to database');
      console.error('Save error:', err);
    }
  };

  // READ - Load existing project
  const loadProject = (project) => {
    setCurrentProject(project);
    setText(project.text || '');
    setSelectedVoice(project.selectedVoice || 'default');
    
    // Parse resultData if it's a JSON string
    try {
      const parsedResult = project.resultData ? JSON.parse(project.resultData) : null;
      setResult(parsedResult);
    } catch (err) {
      setResult(null);
      console.error('Error parsing result data:', err);
    }
    
    setProjectName(project.name);
    setError(null);
    setShowProjects(false);
  };

  // UPDATE - Update existing project in database
  const updateProject = async () => {
    if (!currentProject) {
      setError('No project selected to update');
      return;
    }

    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    try {
      const projectData = {
        name: projectName.trim(),
        text: text,
        selectedVoice: selectedVoice,
        audioUrl: result?.audioUrl || null,
        resultData: JSON.stringify(result)
      };

      const response = await fetch(`http://localhost:5000/api/voice/projects/${currentProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        await loadProjectsFromDB();
        setError(null);
        alert('✅ Project updated successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update project');
      }
    } catch (err) {
      setError('Failed to update project');
      console.error('Update error:', err);
    }
  };

  // DELETE - Delete project from database
  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/voice/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadProjectsFromDB();
        if (currentProject && currentProject.id === projectId) {
          setCurrentProject(null);
          resetForm();
        }
        alert('✅ Project deleted successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete project');
      }
    } catch (err) {
      setError('Failed to delete project');
      console.error('Delete error:', err);
    }
  };

  // Simple voice cloning
  const handleVoiceClone = async () => {
    if (!text.trim()) {
      setError('Please provide text to convert');
      return;
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      setProgress(20);
      
      // Cancel any ongoing speech
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(40);
      
      // Get voice characteristics
      const voiceConfig = voices.find(v => v.id === selectedVoice) || voices[0];
      
      // Wait for voices to load
      await new Promise(resolve => {
        if (speechSynthesis.getVoices().length > 0) {
          resolve();
        } else {
          speechSynthesis.onvoiceschanged = resolve;
        }
      });
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = voiceConfig.pitch;
      utterance.rate = voiceConfig.rate;
      utterance.volume = 1.0;

      const systemVoices = speechSynthesis.getVoices();
      console.log('🎤 Available voices:', systemVoices.map(v => `${v.name} (${v.lang})`));
      
      // Strategy: Try multiple voice names in order of preference
      let selectedVoiceObj = null;

      // 1. Try each preferred voice name for this voice type
      if (voiceConfig.voiceNames && voiceConfig.voiceNames.length > 0) {
        for (const voiceName of voiceConfig.voiceNames) {
          selectedVoiceObj = systemVoices.find(voice => 
            voice.name.includes(voiceName)
          );
          if (selectedVoiceObj) {
            console.log(`✅ Found preferred voice: ${selectedVoiceObj.name} for "${voiceConfig.name}"`);
            break;
          }
        }
      }

      // 2. If not found, try any Google voice based on gender
      if (!selectedVoiceObj) {
        const googleVoices = systemVoices.filter(v => v.name.includes('Google'));
        if (googleVoices.length > 0) {
          if (voiceConfig.gender === 'male' || voiceConfig.gender === 'elderly' || voiceConfig.gender === 'boy') {
            selectedVoiceObj = googleVoices.find(v => v.name.toLowerCase().includes('male'));
          } else if (voiceConfig.gender === 'female' || voiceConfig.gender === 'girl' || voiceConfig.gender === 'child') {
            selectedVoiceObj = googleVoices.find(v => v.name.toLowerCase().includes('female'));
          }
          
          // If still not found, use any Google voice
          if (!selectedVoiceObj) {
            selectedVoiceObj = googleVoices[0];
          }
          
          if (selectedVoiceObj) {
            console.log(`✅ Found Google voice: ${selectedVoiceObj.name}`);
          }
        }
      }

      // 3. Fallback to Microsoft voices based on gender
      if (!selectedVoiceObj) {
        console.log('⚠️ Google voices not found, using Microsoft voices');
        
        if (voiceConfig.gender === 'male' || voiceConfig.gender === 'elderly' || voiceConfig.gender === 'boy') {
          selectedVoiceObj = systemVoices.find(voice => 
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('mark') ||
            (voice.name.toLowerCase().includes('male') && !voice.name.toLowerCase().includes('female'))
          );
        } else if (voiceConfig.gender === 'female' || voiceConfig.gender === 'girl' || voiceConfig.gender === 'child') {
          selectedVoiceObj = systemVoices.find(voice => 
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('hazel') ||
            voice.name.toLowerCase().includes('female')
          );
        }
      }

      // 4. Final fallback - try any voice with matching gender keyword
      if (!selectedVoiceObj) {
        const genderKeyword = voiceConfig.gender === 'male' || voiceConfig.gender === 'boy' || voiceConfig.gender === 'elderly' ? 'male' : 'female';
        selectedVoiceObj = systemVoices.find(voice => 
          voice.name.toLowerCase().includes(genderKeyword)
        );
      }

      // 5. Last resort - use any English voice
      if (!selectedVoiceObj) {
        selectedVoiceObj = systemVoices.find(voice => voice.lang.startsWith('en'));
      }

      // 6. Absolute last resort - use first available voice
      if (!selectedVoiceObj && systemVoices.length > 0) {
        selectedVoiceObj = systemVoices[0];
      }

      if (selectedVoiceObj) {
        utterance.voice = selectedVoiceObj;
        console.log(`🎙️ ${voiceConfig.icon} ${voiceConfig.name} → Voice: "${selectedVoiceObj.name}" | Pitch: ${utterance.pitch.toFixed(2)} | Speed: ${utterance.rate.toFixed(2)}`);
      } else {
        console.log(`⚠️ No voices available! Using browser default | Pitch: ${utterance.pitch.toFixed(2)} | Speed: ${utterance.rate.toFixed(2)}`);
      }

      setProgress(60);

      // Play speech synthesis directly
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error('❌ Voice synthesis timeout after 30 seconds');
          reject(new Error('Voice synthesis timeout. Try with shorter text.'));
        }, 30000);

        utterance.onend = () => {
          clearTimeout(timeout);
          console.log('✅ Speech synthesis completed');
          resolve();
        };

        utterance.onerror = (event) => {
          clearTimeout(timeout);
          console.error('❌ Speech synthesis error:', event.error);
          reject(new Error(`Speech synthesis failed: ${event.error || 'Unknown error'}`));
        };

        console.log('🎤 Starting speech synthesis...');
        speechSynthesis.speak(utterance);
      });

      setProgress(80);
      
      // Generate downloadable MP3 using backend TTS
      let audioUrl = null;
      try {
        const audioResponse = await fetch('http://localhost:5000/api/voice/generate-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            lang: 'en'
          })
        });
        
        if (audioResponse.ok) {
          const audioBlob = await audioResponse.blob();
          audioUrl = URL.createObjectURL(audioBlob);
          console.log('✅ MP3 audio generated for download');
        }
      } catch (audioErr) {
        console.error('Failed to generate MP3:', audioErr);
      }
      
      setProgress(100);

      const newResult = {
        type: 'speech',
        filename: `cloned_voice_${Date.now()}.mp3`,
        message: `Voice cloned successfully with ${selectedVoice} voice!`,
        speechText: text,
        utterance: utterance,
        voiceConfig: voiceConfig,
        audioUrl: audioUrl, // Add the downloadable MP3 URL
        duration: 'Live Playback',
        quality: 'High Quality',
        voice: selectedVoice
      };

      setResult(newResult);

      // AUTO-SAVE to database if user is logged in
      if (currentUser) {
        try {
          const autoSaveData = {
            userId: currentUser.uid,
            name: `Auto-saved ${new Date().toLocaleString()}`,
            text: text,
            voice: selectedVoice,
            audioUrl: audioUrl, // Save the MP3 audio URL
            videoUrl: null
          };

          const saveResponse = await fetch('http://localhost:5000/api/voice/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(autoSaveData)
          });

          if (saveResponse.ok) {
            console.log('✅ Voice cloning auto-saved to database');
            await loadProjectsFromDB(); // Reload projects list
            setSuccess('✅ Voice Cloned! Saved to your projects.');
          }
        } catch (autoSaveErr) {
          console.error('Auto-save failed:', autoSaveErr);
          // Don't show error to user, just log it
        }
      }

    } catch (err) {
      setError(`Voice cloning failed: ${err.message}`);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Simple lip sync
  const handleLipSync = async () => {
    if (!videoFile || !audioFile) {
      setError('Please provide both video and audio files');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      setProgress(20);
      
      if (!videoFile.type.startsWith('video/')) {
        throw new Error('Please select a valid video file');
      }
      
      if (!audioFile.type.startsWith('audio/')) {
        throw new Error('Please select a valid audio file');
      }

      setProgress(40);
      
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(audioFile);
      
      setProgress(60);
      
      await Promise.race([
        Promise.all([
          new Promise(resolve => {
            video.onloadedmetadata = resolve;
            video.onerror = () => resolve();
          }),
          new Promise(resolve => {
            audio.onloadedmetadata = resolve;
            audio.onerror = () => resolve();
          })
        ]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Media loading timeout')), 3000))
      ]);
      
      setProgress(80);
      
      const videoBlob = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video processing timeout'));
        }, 10000);

        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 640;
          canvas.height = 480;
          
          const videoStream = canvas.captureStream(15);
          
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioSource = audioContext.createMediaElementSource(audio);
          const destination = audioContext.createMediaStreamDestination();
          audioSource.connect(destination);
          
          const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...destination.stream.getAudioTracks()
          ]);
          
          // Try to use MP4 format if supported, otherwise fallback to WebM
          let mimeType = 'video/webm';
          let fileExtension = 'webm';
          
          if (MediaRecorder.isTypeSupported('video/mp4')) {
            mimeType = 'video/mp4';
            fileExtension = 'mp4';
          } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
            mimeType = 'video/webm;codecs=h264';
            fileExtension = 'webm';
          }
          
          const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });
          const chunks = [];
          
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
          };
          
          mediaRecorder.onstop = () => {
            clearTimeout(timeout);
            const blob = new Blob(chunks, { type: mimeType });
            blob.fileExtension = fileExtension; // Store extension for later use
            resolve(blob);
          };
          
          mediaRecorder.start();
          
          video.play();
          audio.play();
          
          let frameCount = 0;
          const maxFrames = 150;
          
          const drawFrame = () => {
            if (frameCount >= maxFrames) {
              mediaRecorder.stop();
              return;
            }
            
            if (!video.paused && !video.ended) {
              try {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              } catch (e) {
                // Continue even if drawing fails
              }
              frameCount++;
              requestAnimationFrame(drawFrame);
            } else {
              mediaRecorder.stop();
            }
          };
          
          drawFrame();
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      });
      
      setProgress(100);
      const videoUrl = URL.createObjectURL(videoBlob);
      
      // Get file extension from blob
      const fileExt = videoBlob.fileExtension || 'webm';
      
      const newResult = {
        type: 'video',
        filename: `lip_synced_${Date.now()}.${fileExt}`,
        message: `Lip sync completed successfully! (Format: ${fileExt.toUpperCase()})`,
        videoUrl: videoUrl,
        duration: 'Generated',
        resolution: 'HD Quality',
        technology: 'Simple WebRTC'
      };

      setResult(newResult);

    } catch (err) {
      setError(`Lip sync failed: ${err.message}`);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setText('');
    setAudioFile(null);
    setVideoFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setCurrentProject(null);
    setProjectName('');
    setEditingProject(null);
  };

  const startNewProject = () => {
    resetForm();
    setShowProjects(false);
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '40px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)'
  };

  const cardStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
    marginBottom: '20px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  const buttonStyle = (disabled, gradient, isOutline = false) => ({
    padding: '12px 24px',
    border: isOutline ? '2px solid #667eea' : 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#ccc' : (isOutline ? 'transparent' : gradient),
    color: isOutline ? '#667eea' : 'white',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.3s ease',
    marginRight: '10px',
    marginBottom: '10px',
    minWidth: '150px'
  });

  // Show login message if not logged in
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>Login Required</h2>
          <p style={{ color: '#666', marginBottom: '25px', fontSize: '1.1rem' }}>
            Please log in to access the Voice Cloning Studio and save your projects to the database.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '2.5rem', fontWeight: '700' }}>
          🎤 Voice Cloning with CRUD
        </h1>
        <p style={{ margin: '0 0 15px 0', fontSize: '1.2rem', opacity: 0.9 }}>
          Create, Save, Load, Update, and Delete your voice cloning projects
        </p>
        
        {/* Important Notice */}
        <div style={{ 
          background: '#ffd54f',
          color: '#663c00',
          padding: '20px', 
          borderRadius: '10px', 
          marginBottom: '15px',
          fontSize: '1rem',
          border: '3px solid #ff6f00',
          boxShadow: '0 5px 15px rgba(255, 111, 0, 0.3)'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            ⚠️ <strong>IMPORTANT: Which Feature Do You Need?</strong>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>THIS PAGE (Preset Voices):</strong> Uses browser voices with different pitch/speed. Fast TTS but does NOT clone uploaded audio files.
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>NEED REAL VOICE CLONING?</strong> Go to{' '}
            <a 
              href="/voice-upload-cloning" 
              style={{ 
                color: '#d84315',
                fontWeight: 'bold',
                textDecoration: 'underline',
                fontSize: '1.1rem'
              }}
            >
              Voice Upload & Cloning Page
            </a>
            {' '}to ACTUALLY clone voices from uploaded audio/video!
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.7)',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '0.95rem'
          }}>
            <strong>✅ Use this page for:</strong> Quick TTS with preset voices (Man, Woman, Boy, Girl, Child, Elderly)<br/>
            <strong>✅ Use /voice-upload-cloning for:</strong> Real AI voice cloning from your uploaded audio files
          </div>
        </div>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '15px', 
          borderRadius: '10px',
          fontSize: '1rem'
        }}>
          <strong>💾 CRUD Features:</strong> Save projects to MySQL database, load them anytime, update content, and manage your voice library!
        </div>
      </div>

      {/* Project Management */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        border: '2px solid #4caf50'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: '0', color: '#2e7d32' }}>
            📁 Project Management
          </h3>
          <div>
            <button
              onClick={() => setShowProjects(!showProjects)}
              style={buttonStyle(false, 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)')}
            >
              {showProjects ? '📝 Hide Projects' : '📂 Show Projects'} ({projects.length})
            </button>
            <button
              onClick={startNewProject}
              style={buttonStyle(false, 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)')}
            >
              ➕ New Project
            </button>
          </div>
        </div>

        {/* Project Name Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333',
            fontSize: '1.1rem'
          }}>
            📝 Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={saveProject}
              disabled={!projectName.trim() || (!text.trim() && !result)}
              style={buttonStyle(
                !projectName.trim() || (!text.trim() && !result),
                'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
              )}
            >
              💾 Save Project
            </button>
            {currentProject && (
              <button
                onClick={updateProject}
                disabled={!projectName.trim()}
                style={buttonStyle(
                  !projectName.trim(),
                  'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
                )}
              >
                ✏️ Update Project
              </button>
            )}
          </div>
        </div>

        {/* Current Project Info */}
        {currentProject && (
          <div style={{
            background: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #2196f3',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>
              📋 Current Project: {currentProject.name}
            </h4>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Created:</strong> {new Date(currentProject.createdAt).toLocaleDateString()}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Updated:</strong> {new Date(currentProject.updatedAt).toLocaleDateString()}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Voice:</strong> {currentProject.selectedVoice}
            </p>
          </div>
        )}

        {/* Projects List */}
        {showProjects && (
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid #ddd'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
              📂 Saved Projects ({projects.length})
            </h4>
            {projects.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                No projects saved yet. Create your first project!
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {projects.map(project => (
                  <div
                    key={project.id}
                    style={{
                      padding: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      background: currentProject?.id === project.id ? '#e3f2fd' : '#f9f9f9',
                      borderColor: currentProject?.id === project.id ? '#2196f3' : '#ddd'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>
                          📁 {project.name}
                        </h5>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                          Voice: {project.selectedVoice} | 
                          Created: {new Date(project.createdAt).toLocaleDateString()} |
                          {project.result ? ' ✅ Has Result' : ' ⏳ No Result'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => loadProject(project)}
                          style={{
                            ...buttonStyle(false, 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'),
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                            minWidth: 'auto'
                          }}
                        >
                          📂 Load
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          style={{
                            ...buttonStyle(false, 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'),
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                            minWidth: 'auto'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voice Selection */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        border: '2px solid #2196f3'
      }}>
        <h3 style={{ color: '#1565c0', margin: '0 0 20px 0', textAlign: 'center' }}>
          🎭 Voice Selection
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          {voices.map(voice => (
            <div
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: selectedVoice === voice.id ? '#2196f3' : 'white',
                color: selectedVoice === voice.id ? 'white' : '#333',
                cursor: 'pointer',
                textAlign: 'center',
                border: `2px solid ${selectedVoice === voice.id ? '#1976d2' : '#ddd'}`,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
                {voice.icon}
              </div>
              <div style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px', lineHeight: '1.2' }}>{voice.name}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                Pitch: {voice.pitch.toFixed(1)} | Speed: {voice.rate.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={cardStyle}>
        {/* Text Input */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333',
            fontSize: '1.1rem'
          }}>
            📝 Text to Convert to Speech
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech... (Save your projects!)"
            rows={4}
            disabled={loading}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '120px'
            }}
          />
          <small style={{ color: '#666', fontSize: '0.9rem' }}>
            💡 Create content and save it as a project for later use!
          </small>
        </div>

        {/* File Inputs */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px', 
          marginBottom: '25px' 
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333',
              fontSize: '1.1rem'
            }}>
              🎵 Reference Audio File (for Lip Sync)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              disabled={loading}
              style={{
                ...inputStyle,
                border: '2px dashed #ddd',
                background: '#f9f9f9',
                cursor: 'pointer',
                padding: '15px'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.9rem' }}>
              Upload an audio file (MP3, WAV, etc.)
            </small>
            {audioFile && (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                background: '#e8f5e8', 
                borderRadius: '5px',
                color: '#2e7d32',
                fontWeight: '600'
              }}>
                ✅ Selected: {audioFile.name}
              </div>
            )}
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333',
              fontSize: '1.1rem'
            }}>
              🎬 Video File (for Lip Sync)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              disabled={loading}
              style={{
                ...inputStyle,
                border: '2px dashed #ddd',
                background: '#f9f9f9',
                cursor: 'pointer',
                padding: '15px'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.9rem' }}>
              Upload a video file (MP4, AVI, etc.)
            </small>
            {videoFile && (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                background: '#e8f5e8', 
                borderRadius: '5px',
                color: '#2e7d32',
                fontWeight: '600'
              }}>
                ✅ Selected: {videoFile.name}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          marginBottom: '25px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleVoiceClone}
            disabled={loading || !text.trim()}
            style={buttonStyle(
              loading || !text.trim(),
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            )}
          >
            {loading ? '🎤 Generating...' : '🎤 Clone Voice'}
          </button>

          <button
            onClick={handleLipSync}
            disabled={loading || !videoFile || !audioFile}
            style={buttonStyle(
              loading || !videoFile || !audioFile,
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            )}
          >
            {loading ? '🎬 Syncing...' : '🎬 Lip Sync Video'}
          </button>

          <button
            onClick={resetForm}
            disabled={loading}
            style={buttonStyle(loading, '', true)}
          >
            🔄 Reset
          </button>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
              🚀 Processing...
            </h4>
            <div style={{
              width: '100%',
              height: '20px',
              background: '#e0e0e0',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'width 0.3s ease',
                borderRadius: '10px'
              }}></div>
            </div>
            <p style={{ margin: 0, color: '#666' }}>
              {progress}% Complete
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#ffebee',
            border: '1px solid #f44336',
            color: '#c62828',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#c62828' }}>❌ Error</h3>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            border: '2px solid #4caf50'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2e7d32', textAlign: 'center' }}>
              ✅ {result.type === 'speech' ? 'Voice Cloned!' : result.type === 'audio' ? 'Voice Cloned!' : 'Video Synced!'}
            </h3>
            
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              border: '1px solid #c3e6cb',
              textAlign: 'center'
            }}>
              {result.message}
            </div>

            {result.type === 'speech' && (
              <div style={{
                margin: '20px 0',
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
                  🎵 Generated Voice - Listen Now!
                </h4>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (speechSynthesis.speaking) {
                        if (speechSynthesis.paused) {
                          speechSynthesis.resume();
                          setIsPlaying(true);
                        } else {
                          speechSynthesis.pause();
                          setIsPlaying(false);
                        }
                      } else {
                        // Re-create and play the utterance
                        const utterance = new SpeechSynthesisUtterance(result.speechText);
                        utterance.pitch = result.voiceConfig.pitch;
                        utterance.rate = result.voiceConfig.rate;
                        utterance.volume = 1.0;
                        
                        const voices = speechSynthesis.getVoices();
                        let voice = null;
                        
                        // Try to find the same voice
                        if (result.voiceConfig.voiceNames) {
                          for (const voiceName of result.voiceConfig.voiceNames) {
                            voice = voices.find(v => v.name.includes(voiceName));
                            if (voice) break;
                          }
                        }
                        
                        if (voice) {
                          utterance.voice = voice;
                        }
                        
                        utterance.onstart = () => setIsPlaying(true);
                        utterance.onend = () => setIsPlaying(false);
                        utterance.onerror = () => setIsPlaying(false);
                        
                        speechSynthesis.speak(utterance);
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      background: speechSynthesis.speaking && !speechSynthesis.paused 
                        ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' 
                        : 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {speechSynthesis.speaking && !speechSynthesis.paused ? '⏸️ Pause' : '▶️ Play Voice'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      speechSynthesis.cancel();
                      setIsPlaying(false);
                    }}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    ⏹️ Stop
                  </button>
                </div>
                <div style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  margin: '10px 0'
                }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Voice:</strong> {result.voice}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Type:</strong> Live Speech Synthesis
                  </p>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    {result.speechText.substring(0, 100)}{result.speechText.length > 100 ? '...' : ''}
                  </p>
                </div>
              </div>
            )}

            {result.type === 'audio' && (
              <div style={{
                margin: '20px 0',
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
                  🎵 Generated Audio
                </h4>
                {result.audioUrl && (
                  <>
                    <audio 
                      ref={audioRef}
                      controls
                      preload="auto"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      onError={(e) => console.error('Audio error:', e)}
                      style={{ 
                        width: '100%', 
                        marginBottom: '15px'
                      }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (audioRef.current) {
                            if (isPlaying) {
                              audioRef.current.pause();
                            } else {
                              audioRef.current.play()
                                .catch(err => {
                                  console.error('Play error:', err);
                                  setIsPlaying(false);
                                });
                            }
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          background: isPlaying 
                            ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' 
                            : 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          transition: 'all 0.3s'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                            setIsPlaying(false);
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          transition: 'all 0.3s'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🔄 Stop
                      </button>
                    </div>
                  </>
                )}
                <div style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  margin: '10px 0'
                }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>File:</strong> {result.filename}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Voice:</strong> {result.voice}
                  </p>
                </div>
              </div>
            )}

            {result.type === 'video' && (
              <div style={{
                margin: '20px 0',
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
                  🎬 Synced Video
                </h4>
                {result.videoUrl && (
                  <video ref={videoRef} controls style={{ 
                    width: '100%', 
                    marginBottom: '15px'
                  }}>
                    <source src={result.videoUrl} type="video/webm" />
                    Your browser does not support the video element.
                  </video>
                )}
                <div style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  margin: '10px 0'
                }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>File:</strong> {result.filename}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Technology:</strong> {result.technology}
                  </p>
                </div>
              </div>
            )}

            {(result.audioUrl || result.videoUrl) && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => {
                    if (result.audioUrl) {
                      const link = document.createElement('a');
                      link.href = result.audioUrl;
                      link.download = result.filename;
                      link.click();
                    } else if (result.videoUrl) {
                      const link = document.createElement('a');
                      link.href = result.videoUrl;
                      link.download = result.filename;
                      link.click();
                    }
                  }}
                  style={{
                    ...buttonStyle(false, 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'),
                    textDecoration: 'none',
                    padding: '12px 30px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  📥 Download {result.type === 'audio' || result.type === 'speech' ? 'Audio (MP3)' : 'Video'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        input[type="file"]:hover {
          border-color: #667eea !important;
          background: #f0f4ff !important;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default VoiceCloningWithCRUD;





