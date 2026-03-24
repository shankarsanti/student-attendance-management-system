import React, { useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Avatar,
    Card,
    CardContent,
    Divider,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Edit, Email, School, Class, Person, Badge } from '@mui/icons-material';
import styled from 'styled-components';
import Popup from '../../components/Popup';

const StudentProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [openEdit, setOpenEdit] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const sclassName = currentUser.sclassName;
    const studentSchool = currentUser.school;

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const calculateAttendancePercentage = () => {
        if (!currentUser.attendance || currentUser.attendance.length === 0) return 0;
        const present = currentUser.attendance.filter(att => att.status === 'Present').length;
        return ((present / currentUser.attendance.length) * 100).toFixed(1);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Profile Header Card */}
                <Grid item xs={12}>
                    <StyledPaper elevation={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <StyledAvatar>
                                {getInitials(currentUser.name)}
                            </StyledAvatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h4" gutterBottom>
                                    {currentUser.name}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                    Student • Roll No: {currentUser.rollNum}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip 
                                        icon={<Class />} 
                                        label={sclassName.sclassName} 
                                        variant="outlined" 
                                        size="small"
                                    />
                                    <Chip 
                                        icon={<School />} 
                                        label={studentSchool.schoolName} 
                                        variant="outlined" 
                                        size="small"
                                        color="primary"
                                    />
                                </Box>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => setOpenEdit(true)}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </StyledPaper>
                </Grid>

                {/* Academic Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Badge color="primary" />
                                Academic Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <InfoRow>
                                <InfoLabel>Roll Number:</InfoLabel>
                                <InfoValue>{currentUser.rollNum}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Class:</InfoLabel>
                                <InfoValue>{sclassName.sclassName}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>School:</InfoLabel>
                                <InfoValue>{studentSchool.schoolName}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Status:</InfoLabel>
                                <InfoValue>
                                    <Chip label="Active" color="success" size="small" />
                                </InfoValue>
                            </InfoRow>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person color="primary" />
                                Personal Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <InfoRow>
                                <InfoLabel>Full Name:</InfoLabel>
                                <InfoValue>{currentUser.name}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Role:</InfoLabel>
                                <InfoValue>
                                    <Chip label="Student" color="info" size="small" />
                                </InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Student ID:</InfoLabel>
                                <InfoValue>{currentUser._id.slice(-8).toUpperCase()}</InfoValue>
                            </InfoRow>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Academic Performance
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <StatBox>
                                        <StatValue>{calculateAttendancePercentage()}%</StatValue>
                                        <StatLabel>Attendance</StatLabel>
                                    </StatBox>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <StatBox>
                                        <StatValue>{currentUser.examResult?.length || 0}</StatValue>
                                        <StatLabel>Subjects</StatLabel>
                                    </StatBox>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <StatBox>
                                        <StatValue>{currentUser.attendance?.length || 0}</StatValue>
                                        <StatLabel>Total Days</StatLabel>
                                    </StatBox>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <StatBox>
                                        <StatValue>Active</StatValue>
                                        <StatLabel>Status</StatLabel>
                                    </StatBox>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Typography color="textSecondary" sx={{ mt: 2 }}>
                        Contact your administrator to update your profile information.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default StudentProfile;

const StyledPaper = styled(Paper)`
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
`;

const StyledAvatar = styled(Avatar)`
    width: 120px !important;
    height: 120px !important;
    font-size: 3rem !important;
    background-color: rgba(255, 255, 255, 0.2) !important;
    border: 4px solid white !important;
`;

const InfoRow = styled(Box)`
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
        border-bottom: none;
    }
`;

const InfoLabel = styled(Typography)`
    font-weight: 600;
    color: #666;
`;

const InfoValue = styled(Typography)`
    color: #333;
`;

const StatBox = styled(Box)`
    text-align: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
`;

const StatValue = styled(Typography)`
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
`;

const StatLabel = styled(Typography)`
    font-size: 0.875rem;
    color: #666;
    margin-top: 8px;
`;