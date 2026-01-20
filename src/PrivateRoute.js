import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CircularProgress, Box } from '@mui/material';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser === null) {
    return <Navigate to='/login' replace />;
  }

  if (!currentUser.emailVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
}