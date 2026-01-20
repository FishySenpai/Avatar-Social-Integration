import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import './ProfileSettings.css'; // Reusing the same styling

const Security = () => {
  const { currentUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError('Failed to update password: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings-container">
      <div className="profile-settings-card">
        <h2>Security Settings</h2>
        
        <div className="settings-section">
          <h3>Change Password</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="settings-section">
          <h3>Account Security</h3>
          <div className="security-info">
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>Email Verified:</strong> {currentUser?.emailVerified ? '✓ Yes' : '✗ No'}</p>
            <p><strong>Account Created:</strong> {currentUser?.metadata?.creationTime}</p>
            <p><strong>Last Sign In:</strong> {currentUser?.metadata?.lastSignInTime}</p>
          </div>
        </div>

        <div className="settings-section">
          <h3>Two-Factor Authentication</h3>
          <p className="text-muted">Two-factor authentication adds an extra layer of security to your account.</p>
          <button className="btn btn-outline-primary" disabled>
            Enable 2FA (Coming Soon)
          </button>
        </div>

        <div className="settings-section">
          <h3>Active Sessions</h3>
          <p className="text-muted">Manage devices and sessions where you're currently logged in.</p>
          <div className="session-info">
            <p>Current Session: Active</p>
            <button className="btn btn-outline-danger" disabled>
              View All Sessions (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;


