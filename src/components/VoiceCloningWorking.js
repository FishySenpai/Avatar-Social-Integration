import React, { useState } from 'react';

const VoiceCloningWorking = () => {
  const [text, setText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVoiceClone = () => {
    if (!text.trim() || !audioFile) {
      setError('Please provide both text and audio file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    setTimeout(() => {
      setResult({
        type: 'audio',
        filename: 'cloned_voice.wav',
        message: 'Voice cloned successfully!'
      });
      setLoading(false);
    }, 2000);
  };

  const handleLipSync = () => {
    if (!videoFile || !audioFile) {
      setError('Please provide both video and audio files');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    setTimeout(() => {
      setResult({
        type: 'video',
        filename: 'lip_synced.mp4',
        message: 'Lip sync completed successfully!'
      });
      setLoading(false);
    }, 3000);
  };

  const resetForm = () => {
    setText('');
    setAudioFile(null);
    setVideoFile(null);
    setResult(null);
    setError(null);
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  const cardStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
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
    marginBottom: '10px'
  };

  const buttonStyle = (disabled, gradient) => ({
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#ccc' : gradient,
    color: 'white',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.3s ease',
    marginRight: '10px',
    marginBottom: '10px'
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>
          Voice Cloning & Animation
        </h1>
        <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.9 }}>
          Clone voices and sync lip movements with AI
        </p>
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
            fontSize: '1rem'
          }}>
            Text to Convert
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            rows={4}
            disabled={loading}
            style={inputStyle}
          />
        </div>

        {/* File Inputs */}
        <div style={{ display: 'grid', gap: '20px', marginBottom: '25px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333',
              fontSize: '1rem'
            }}>
              Reference Audio File
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
                cursor: 'pointer'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.9rem' }}>
              Upload a sample audio file to clone the voice
            </small>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333',
              fontSize: '1rem'
            }}>
              Video File (for Lip Sync)
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
                cursor: 'pointer'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.9rem' }}>
              Upload a video file for lip synchronization
            </small>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <button
            onClick={handleVoiceClone}
            disabled={loading || !text.trim() || !audioFile}
            style={buttonStyle(
              loading || !text.trim() || !audioFile,
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            )}
          >
            {loading ? 'Cloning Voice...' : 'Clone Voice'}
          </button>

          <button
            onClick={handleLipSync}
            disabled={loading || !videoFile || !audioFile}
            style={buttonStyle(
              loading || !videoFile || !audioFile,
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            )}
          >
            {loading ? 'Syncing...' : 'Lip Sync Video'}
          </button>

          <button
            onClick={resetForm}
            disabled={loading}
            style={{
              ...buttonStyle(loading, 'transparent'),
              border: '2px solid #667eea',
              color: '#667eea'
            }}
          >
            Reset
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#c33' }}>Error</h3>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Result</h3>
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #c3e6cb'
            }}>
              {result.message}
            </div>

            {result.type === 'audio' && (
              <div style={{
                margin: '20px 0',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Cloned Voice</h4>
                <div style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center',
                  margin: '10px 0'
                }}>
                  <p>🎵 Audio would be generated here</p>
                  <p><strong>File:</strong> {result.filename}</p>
                </div>
              </div>
            )}

            {result.type === 'video' && (
              <div style={{
                margin: '20px 0',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Lip-Synced Video</h4>
                <div style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center',
                  margin: '10px 0'
                }}>
                  <p>🎬 Video would be generated here</p>
                  <p><strong>File:</strong> {result.filename}</p>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                disabled
                style={buttonStyle(true, 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')}
              >
                Download {result.type === 'audio' ? 'Audio' : 'Video'} (Demo)
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            color: 'white'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>Processing your request...</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VoiceCloningWorking;





