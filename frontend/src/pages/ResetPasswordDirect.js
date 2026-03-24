import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Grid, Box, Typography, Paper, TextField, CssBaseline, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import bgpic from "./assets/designlogin.jpg";
import { LightPurpleButton } from './components/buttonStyles';
import styled from 'styled-components';
import Popup from './components/Popup';
import axios from 'axios';

const defaultTheme = createTheme();

const ResetPasswordDirect = () => {
    const { role } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email');

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const validRoles = ['Admin', 'Teacher', 'Student'];
    const isValidRole = role && validRoles.includes(role);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.newPassword) {
            newErrors.newPassword = 'Password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoader(true);

        try {
            // For now, this is a placeholder - in production you'd verify a reset token
            setMessage('Password reset feature is available through the Admin panel. Please contact your administrator.');
            setShowPopup(true);
            setLoader(false);

            setTimeout(() => {
                navigate(`/${role}login`);
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to reset password. Please try again.');
            setShowPopup(true);
            setLoader(false);
        }
    };

    if (!isValidRole) {
        return (
            <ThemeProvider theme={defaultTheme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                                Invalid Access
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
                                Please access the password reset page from the forgot password link.
                            </Typography>
                            <LightPurpleButton fullWidth variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                                Go to Home
                            </LightPurpleButton>
                        </Box>
                    </Grid>
                    <Grid item xs={false} sm={4} md={7} sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }} />
                </Grid>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            Reset Password
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
                            {email ? `Resetting password for: ${email}` : 'Enter your new password below'}
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="newPassword"
                                label="New Password"
                                type="password"
                                id="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword || 'Minimum 6 characters'}
                            />
                            
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />
                            
                            <LightPurpleButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
                            </LightPurpleButton>

                            <Grid container justifyContent="center">
                                <Grid item>
                                    <StyledLink onClick={() => navigate(`/${role}login`)}>
                                        Back to Login
                                    </StyledLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={false} sm={4} md={7} sx={{
                    backgroundImage: `url(${bgpic})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
};

export default ResetPasswordDirect;

const StyledLink = styled.span`
    margin-top: 9px;
    text-decoration: none;
    color: #7f56da;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;
