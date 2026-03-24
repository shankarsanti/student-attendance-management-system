import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, Box, Typography, Paper, TextField, CssBaseline, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import bgpic from "../assets/designlogin.jpg";
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import Popup from '../components/Popup';
import axios from 'axios';

const defaultTheme = createTheme();

const ForgotPassword = () => {
    const { role } = useParams();
    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState(false);

    // Validate role parameter
    const validRoles = ['Admin', 'Teacher', 'Student'];
    const isValidRole = role && validRoles.includes(role);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!isValidRole) {
            setMessage('Invalid role. Please access this page from the login page.');
            setShowPopup(true);
            return;
        }

        const email = event.target.email.value;

        if (!email) {
            setEmailError(true);
            return;
        }

        setLoader(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/forgot-password`, {
                email,
                role
            });

            setMessage(response.data.message || 'Password reset instructions sent! Please contact your administrator.');
            setShowPopup(true);
            setLoader(false);

            setTimeout(() => {
                navigate(`/${role}login`);
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to process request. Please try again.');
            setShowPopup(true);
            setLoader(false);
        }
    };

    const handleInputChange = () => {
        setEmailError(false);
    };

    // Redirect if invalid role
    if (!isValidRole) {
        return (
            <ThemeProvider theme={defaultTheme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                                Invalid Access
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
                                Please access the forgot password page from the login page.
                            </Typography>
                            <LightPurpleButton
                                fullWidth
                                variant="contained"
                                onClick={() => navigate('/')}
                                sx={{ mt: 2 }}
                            >
                                Go to Home
                            </LightPurpleButton>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: `url(${bgpic})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </Grid>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            Forgot Password
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: '#666' }}>
                            Enter your email address below.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#ff9800', fontWeight: 'bold' }}>
                            Note: An administrator will need to reset your password. You will be contacted shortly.
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                            />
                            
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Submit Request"}
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
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
};

export default ForgotPassword;

const StyledLink = styled.span`
    margin-top: 9px;
    text-decoration: none;
    color: #7f56da;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;
