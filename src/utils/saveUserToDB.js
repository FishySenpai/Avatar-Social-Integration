/**
 * Save user data to MySQL database
 */

export const saveUserToDatabase = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userData.uid,
        email: userData.email,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        display_name: userData.displayName || `${userData.firstName} ${userData.lastName}`,
        photo_url: userData.photoURL || null,
        phone_number: userData.phoneNumber || null,
        role: userData.role || 'user',
        email_verified: userData.emailVerified || false,
        phone_verified: false,
        two_factor_enabled: false,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ User saved to database:', data);
      return { success: true, data };
    } else {
      console.error('❌ Failed to save user to database:', data);
      return { success: false, error: data.error || 'Unknown error' };
    }
  } catch (error) {
    console.error('❌ Database save error:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserInDatabase = async (userId, updates) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ User updated in database:', data);
      return { success: true, data };
    } else {
      console.error('❌ Failed to update user in database:', data);
      return { success: false, error: data.error || 'Unknown error' };
    }
  } catch (error) {
    console.error('❌ Database update error:', error);
    return { success: false, error: error.message };
  }
};


