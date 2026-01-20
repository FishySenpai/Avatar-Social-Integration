import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { currentUser, updateUserRole } = useAuth();

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    basic: 0,
    premium: 0,
    admin: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.uid.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    // Calculate statistics
    const total = users.length;
    const basic = users.filter((u) => u.role === 'basic').length;
    const premium = users.filter((u) => u.role === 'premium').length;
    const admin = users.filter((u) => u.role === 'admin').length;
    setStats({ total, basic, premium, admin });
  }, [users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setError('');
      setSuccess('');
      await updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(users.map((user) => 
        user.uid === userId ? { ...user, role: newRole } : user
      ));
      
      setSuccess(`User role updated to ${newRole} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update user role. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setError('');
      setSuccess('');
      await deleteDoc(doc(db, 'users', userId));
      
      // Update local state
      setUsers(users.filter((user) => user.uid !== userId));
      
      setSuccess('User deleted successfully!');
      setDeleteDialogOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error(err);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'premium':
        return 'primary';
      case 'basic':
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminIcon />;
      case 'premium':
        return <VerifiedIcon />;
      case 'basic':
      default:
        return <PeopleIcon />;
    }
  };

  // Check if current user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to access this page. Admin access required.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <HeaderBar />
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
            <AdminIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 32 }} />
            Admin Dashboard
          </Typography>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Basic Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stats.basic}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#f3e5f5' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Premium Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="secondary">
                    {stats.premium}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#ffebee' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Admins
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error">
                    {stats.admin}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                User Management
              </Typography>
              <TextField
                placeholder="Search users..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>UID</strong></TableCell>
                      <TableCell><strong>Role</strong></TableCell>
                      <TableCell><strong>2FA Status</strong></TableCell>
                      <TableCell><strong>Created At</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="textSecondary" py={2}>
                            No users found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.uid}
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>
                            {user.email}
                            {user.uid === currentUser.uid && (
                              <Chip label="You" size="small" color="primary" sx={{ ml: 1 }} />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                              {user.uid.substring(0, 12)}...
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.role || 'basic'}
                              onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                              size="small"
                              disabled={user.uid === currentUser.uid}
                              sx={{ minWidth: 120 }}
                            >
                              <MenuItem value="basic">
                                <Chip label="Basic" size="small" color="default" icon={<PeopleIcon />} />
                              </MenuItem>
                              <MenuItem value="premium">
                                <Chip label="Premium" size="small" color="primary" icon={<VerifiedIcon />} />
                              </MenuItem>
                              <MenuItem value="admin">
                                <Chip label="Admin" size="small" color="error" icon={<AdminIcon />} />
                              </MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {user.twoFactorEnabled ? (
                              <Chip label="Enabled" size="small" color="success" />
                            ) : (
                              <Chip label="Disabled" size="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            {user.createdAt 
                              ? new Date(user.createdAt).toLocaleDateString()
                              : 'N/A'
                            }
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={user.uid === currentUser.uid}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete user <strong>{selectedUser?.email}</strong>?
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action cannot be undone!
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => handleDeleteUser(selectedUser?.uid)}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}


