import { db } from '../firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

// Avatar Profile Management
export const saveAvatarProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const avatarData = {
      displayName: profileData.displayName,
      bio: profileData.bio,
      selectedTraits: profileData.selectedTraits,
      avatarStyle: profileData.avatarStyle,
      privacySettings: profileData.privacySettings,
      photoURL: profileData.photoURL, // Save avatar URL as profile picture
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, avatarData, { merge: true });
    
    // Save detailed avatar settings in subcollection
    const avatarSettingsRef = doc(db, 'users', userId, 'avatarSettings', 'current');
    await setDoc(avatarSettingsRef, {
      ...profileData.avatarStyle,
      lastUpdated: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving avatar profile:', error);
    throw error;
  }
};

export const getAvatarProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const avatarSettingsRef = doc(db, 'users', userId, 'avatarSettings', 'current');

    const [userDoc, avatarSettingsDoc] = await Promise.all([
      getDoc(userRef),
      getDoc(avatarSettingsRef),
    ]);

    const userData = userDoc.exists() ? userDoc.data() : {};
    const avatarSettings = avatarSettingsDoc.exists() ? avatarSettingsDoc.data() : {};

    return {
      ...userData,
      avatarStyle: avatarSettings,
    };
  } catch (error) {
    console.error('Error getting avatar profile:', error);
    throw error;
  }
};

// Social Media Platform Management
export const saveSocialMediaConnection = async (userId, platform, connectionData) => {
  try {
    const connectionRef = doc(db, 'users', userId, 'socialConnections', platform);
    await setDoc(connectionRef, {
      ...connectionData,
      platform,
      connectedAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });

    // Update main user document with connection status
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`${platform}Connected`]: true,
      [`${platform}ConnectedAt`]: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving social media connection:', error);
    throw error;
  }
};

export const createSocialMediaPost = async (userId, postData) => {
  try {
    const postsRef = collection(db, 'users', userId, 'posts');
    const newPost = {
      ...postData,
      createdAt: serverTimestamp(),
      status: postData.scheduledTime ? 'scheduled' : 'published',
      analytics: {
        likes: 0,
        shares: 0,
        comments: 0,
      },
    };

    const postDoc = await addDoc(postsRef, newPost);

    return {
      success: true,
      postId: postDoc.id,
    };
  } catch (error) {
    console.error('Error creating social media post:', error);
    throw error;
  }
};

export const getSocialMediaConnections = async (userId) => {
  try {
    const connectionsRef = collection(db, 'users', userId, 'socialConnections');
    const connectionsSnapshot = await getDocs(connectionsRef);
    
    const connections = {};
    connectionsSnapshot.forEach((doc) => {
      connections[doc.id] = doc.data();
    });

    return connections;
  } catch (error) {
    console.error('Error getting social media connections:', error);
    throw error;
  }
};

export const getSocialMediaPosts = async (userId, options = {}) => {
  try {
    const postsRef = collection(db, 'users', userId, 'posts');
    let postsQuery = query(postsRef);

    if (options.status) {
      postsQuery = query(postsRef, where('status', '==', options.status));
    }

    const postsSnapshot = await getDocs(postsQuery);
    const posts = [];
    
    postsSnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return posts;
  } catch (error) {
    console.error('Error getting social media posts:', error);
    throw error;
  }
};

// Utility function to update profile completion
export const updateProfileCompletion = async (userId, completionData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profileCompletion: completionData,
      lastUpdated: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating profile completion:', error);
    throw error;
  }
}; 