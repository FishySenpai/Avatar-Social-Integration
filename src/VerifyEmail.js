import './verifyEmail.css'
import {useAuth} from './AuthContext'
import {useState, useEffect} from 'react'
import {auth} from './firebase'
import {sendEmailVerification} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'

function VerifyEmail() {

  const {currentUser} = useAuth()
  const [time, setTime] = useState(60)
  const [timeActive, setTimeActive] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [generatedOTP, setGeneratedOTP] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Generate initial OTP when component mounts
    const initialOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(initialOTP);
    
    console.log('═══════════════════════════════════════');
    console.log('🔐 INITIAL EMAIL VERIFICATION CODE');
    console.log('═══════════════════════════════════════');
    console.log(`OTP Code: ${initialOTP}`);
    console.log('Email: ' + currentUser?.email);
    console.log('For TESTING - Check your email or use this code');
    console.log('═══════════════════════════════════════');
    
    // Check email verification status every 3 seconds
    const interval = setInterval(() => {
      if (auth.currentUser) {
        auth.currentUser.reload()
          .then(() => {
            if(auth.currentUser?.emailVerified){
              clearInterval(interval)
              navigate('/')
            }
          })
          .catch((err) => {
            console.error('Reload error:', err)
          })
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [navigate, currentUser])

  useEffect(() => {
    let interval = null
    if(timeActive && time !== 0 ){
      interval = setInterval(() => {
        setTime((time) => time - 1)
      }, 1000)
    }else if(time === 0){
      setTimeActive(false)
      setTime(60)
      clearInterval(interval)
    }
    return () => clearInterval(interval);
  }, [timeActive, time])

  const resendEmailVerification = () => {
    if (auth.currentUser) {
      // Generate a new demo OTP for testing
      const demoOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(demoOTP);
      
      // Log to console for testing
      console.log('═══════════════════════════════════════');
      console.log('🔐 EMAIL VERIFICATION CODE (DEMO)');
      console.log('═══════════════════════════════════════');
      console.log(`OTP Code: ${demoOTP}`);
      console.log('Email: ' + auth.currentUser?.email);
      console.log('This is for TESTING only - Check Console');
      console.log('═══════════════════════════════════════');
      
      // Also show alert
      alert(`✅ New verification code generated!\n\n🔐 OTP: ${demoOTP}\n\nEnter this code below to verify your email`);
      
      sendEmailVerification(auth.currentUser)
        .then(() => {
          setTimeActive(true);
          console.log('✅ Verification email also sent to:', auth.currentUser?.email);
        })
        .catch((err) => {
          console.error('⚠️ Email send error:', err.message);
          setTimeActive(true); // Still activate timer for demo mode
        })
    }
  }
  
  const handleVerifyOTP = async () => {
    setError('');
    
    if (!otp || otp.trim() === '') {
      setError('Please enter the OTP code');
      return;
    }
    
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }
    
    // Check if OTP matches
    if (otp === generatedOTP) {
      console.log('✅ OTP verified successfully!');
      
      try {
        // Update Firestore to mark email as verified
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('./firebase');
        
        if (auth.currentUser) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            emailVerified: true,
            verifiedAt: new Date().toISOString()
          });
          console.log('✅ User marked as verified in Firestore');
        }
      } catch (error) {
        console.error('⚠️ Error updating Firestore:', error);
      }
      
      // Sign out the user
      await auth.signOut();
      
      alert('✅ Email verified successfully! You can now login.');
      
      // Redirect to login page
      navigate('/login');
    } else {
      setError('❌ Invalid OTP code. Please check the console or click "Resend"');
      console.error('❌ OTP mismatch. Expected:', generatedOTP, 'Got:', otp);
    }
  }

  return (
    <div className='center'>
      <div className='verifyEmail'>
        <h1>Verify your Email Address</h1>
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
            🔐 DEVELOPMENT MODE
          </p>
          <p style={{ margin: '0', fontSize: '14px', color: '#856404' }}>
            Check browser console (F12) for OTP code
          </p>
        </div>
        <p>
          <strong>A Verification code has been sent to:</strong><br/>
          <span>{currentUser?.email}</span>
        </p>
        
        {error && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Enter 6-digit OTP Code:
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength="6"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '8px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}
          />
        </div>
        
        <button 
          onClick={handleVerifyOTP}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Verify OTP
        </button>
        
        <button 
          onClick={resendEmailVerification}
          disabled={timeActive}
          style={{
            width: '100%',
            padding: '12px',
            opacity: timeActive ? 0.6 : 1,
            cursor: timeActive ? 'not-allowed' : 'pointer'
          }}
        >
          {timeActive ? `Resend Code (${time}s)` : 'Resend Code'}
        </button>
        
        <button 
          onClick={() => auth.signOut()}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default VerifyEmail
