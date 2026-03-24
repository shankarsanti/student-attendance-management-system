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
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Email, School, Class, Subject, Person } from '@mui/icons-material';
import styled from 'styled-components';
import { updateUser } from '../../redux/userRelated/userHandle';
import Popup from '../../components/Popup';

const TeacherProfile = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [openEdit, setOpenEdit] = useState(false);
    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const teachSclass = currentUser.teachSclass;
    const teachSubject = currentUser.teachSubject;
    const teachSchool = currentUser.school;
    const teachSubjects = currentUser.teachSubjects || [];

    const handleEditSubmit = () => {
        const fields = { name, email };
        dispatch(updateUser(fields, currentUser._id, "Teacher"));
        setMessage('Profile updated successfully!');
        setShowPopup(true);
        setOpenEdit(false);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
                                    Teacher • {teachSclass.sclassName}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip 
                                        icon={<Email />} 
                                        label={currentUser.email} 
                                        variant="outlined" 
                                        size="small"
                                        sx={{ color: 'white', borderColor: 'white' }}
                                    />
                                    <Chip 
                                        icon={<School />} 
                                        label={teachSchool.schoolName} 
                                        variant="outlined" 
                                        size="small"
                                        sx={{ 
                                            color: '#FFD700',
                                            borderColor: '#FFD700',
                                            fontWeight: 600
                                        }}
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

                {/* Teaching Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Class color="primary" />
                                Teaching Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <InfoRow>
                                <InfoLabel>Assigned Class:</InfoLabel>
                                <InfoValue>{teachSclass.sclassName}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Primary Subject:</InfoLabel>
                                <InfoValue>{teachSubject.subName}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Sessions:</InfoLabel>
                                <InfoValue>{teachSubject.sessions || 'N/A'}</InfoValue>
                            </InfoRow>
                            {teachSubjects.length > 0 && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" gutterBottom>
                                        Additional Subjects:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        {teachSubjects.map((sub, index) => (
                                            <Chip
                                                key={index}
                                                label={`${sub.subject.subName} (Sem ${sub.semester})`}
                                                color="secondary"
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Account Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person color="primary" />
                                Account Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <InfoRow>
                                <InfoLabel>Full Name:</InfoLabel>
                                <InfoValue>{currentUser.name}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Email Address:</InfoLabel>
                                <InfoValue>{currentUser.email}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Role:</InfoLabel>
                                <InfoValue>
                                    <Chip label="Teacher" color="success" size="small" />
                                </InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>School:</InfoLabel>
                                <InfoValue>{teachSchool.schoolName}</InfoValue>
                            </InfoRow>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Statistics
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <StatBox>
                                        <StatValue>1</StatValue>
                                        <StatLabel>Assigned Class</StatLabel>
                                    </StatBox>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <StatBox>
                                        <StatValue>{1 + teachSubjects.length}</StatValue>
                                        <StatLabel>Total Subjects</StatLabel>
                                    </StatBox>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <StatBox>
                                        <StatValue>{teachSubject.sessions || 0}</StatValue>
                                        <StatLabel>Sessions</StatLabel>
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
                    <TextField
                        fullWidth
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default TeacherProfile;

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
