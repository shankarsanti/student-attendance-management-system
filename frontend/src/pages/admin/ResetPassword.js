import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    Grid,
    Alert
} from '@mui/material';
import { LockReset } from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ResetPassword = () => {
    const { currentUser } = useSelector(state => state.user);
    
    const [formData, setFormData] = useState({
        role: 'Teacher',
        email: '',
        rollNum: '',
        studentName: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            return;
        }

        setLoading(true);

        try {
            const token = currentUser.token;
            let response;

            if (formData.role === 'Student') {
                // Reset student password
                if (!formData.rollNum || !formData.studentName) {
                    setMessage({ type: 'error', text: 'Roll number and student name are required' });
                    setLoading(false);
                    return;
                }

                response = await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/reset-student-password`,
                    {
                        rollNum: formData.rollNum,
                        studentName: formData.studentName,
                        newPassword: formData.newPassword
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            } else {
                // Reset teacher/admin password
                if (!formData.email) {
                    setMessage({ type: 'error', text: 'Email is required' });
                    setLoading(false);
                    return;
                }

                response = await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/reset-password`,
                    {
                        email: formData.email,
                        role: formData.role,
                        newPassword: formData.newPassword
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }

            setMessage({ type: 'success', text: response.data.message });
            
            // Reset form
            setFormData({
                role: 'Teacher',
                email: '',
                rollNum: '',
                studentName: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to reset password' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LockReset sx={{ fontSize: 40, mr: 2, color: '#7f56da' }} />
                    <Typography variant="h4" component="h1">
                        Reset User Password
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    As an administrator, you can reset passwords for teachers, students, and other admins.
                </Typography>

                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 3 }}>
                        {message.text}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="User Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Teacher">Teacher</MenuItem>
                                <MenuItem value="Student">Student</MenuItem>
                            </TextField>
                        </Grid>

                        {formData.role === 'Student' ? (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Roll Number"
                                        name="rollNum"
                                        type="number"
                                        value={formData.rollNum}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Student Name"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="New Password"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                helperText="Minimum 6 characters"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    mt: 2,
                                    bgcolor: '#7f56da',
                                    '&:hover': {
                                        bgcolor: '#6941c6'
                                    }
                                }}
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResetPassword;
