import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Chip,
    CircularProgress,
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { ExpandMore, CalendarToday, Schedule, MenuBook, CheckCircle } from '@mui/icons-material';
import axios from 'axios';

const StudentLessons = () => {
    const { currentUser } = useSelector(state => state.user);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/LessonsByClass/${currentUser.sclassName._id}`);
            if (!response.data.message) {
                setLessons(response.data);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
        setLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'primary';
            case 'Completed':
                return 'success';
            case 'In Progress':
                return 'warning';
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const todayLessons = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        const today = new Date();
        return lessonDate.toDateString() === today.toDateString();
    });

    const upcomingLessons = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return lessonDate >= today && lesson.status === 'Scheduled';
    });

    const completedLessons = lessons.filter(lesson => lesson.status === 'Completed');

    const renderLessonCard = (lesson) => (
        <Accordion key={lesson._id}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{lesson.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {lesson.subject?.subName} • {lesson.topic}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="body2">
                            {new Date(lesson.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {lesson.startTime} - {lesson.endTime}
                        </Typography>
                        <Chip label={lesson.status} color={getStatusColor(lesson.status)} size="small" />
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {lesson.description && (
                            <Box sx={{ marginBottom: 2 }}>
                                <Typography variant="subtitle2" color="primary">Description:</Typography>
                                <Typography variant="body2">{lesson.description}</Typography>
                            </Box>
                        )}
                    </Grid>
                    
                    {lesson.chapter && (
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="primary">Chapter:</Typography>
                            <Typography variant="body2">{lesson.chapter}</Typography>
                        </Grid>
                    )}
                    
                    {lesson.lessonNumber && (
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="primary">Lesson Number:</Typography>
                            <Typography variant="body2">{lesson.lessonNumber}</Typography>
                        </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="primary">Duration:</Typography>
                        <Typography variant="body2">{lesson.duration} minutes</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="primary">Teacher:</Typography>
                        <Typography variant="body2">{lesson.teacher?.name}</Typography>
                    </Grid>

                    {lesson.objectives && lesson.objectives.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="primary">Learning Objectives:</Typography>
                            <List dense>
                                {lesson.objectives.map((obj, index) => (
                                    <ListItem key={index}>
                                        <CheckCircle sx={{ fontSize: 16, marginRight: 1, color: 'success.main' }} />
                                        <ListItemText primary={obj} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    )}

                    {lesson.materials && lesson.materials.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="primary">Materials Needed:</Typography>
                            <List dense>
                                {lesson.materials.map((mat, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={`• ${mat}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    )}

                    {lesson.homework && (
                        <Grid item xs={12}>
                            <Paper sx={{ padding: 2, backgroundColor: '#fff3e0' }}>
                                <Typography variant="subtitle2" color="primary">Homework:</Typography>
                                <Typography variant="body2">{lesson.homework}</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Lessons Schedule
            </Typography>

            <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(0)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Today's Lessons
                                    </Typography>
                                    <Typography variant="h4">
                                        {todayLessons.length}
                                    </Typography>
                                </Box>
                                <CalendarToday sx={{ fontSize: 40, color: '#1976d2' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(1)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Upcoming Lessons
                                    </Typography>
                                    <Typography variant="h4">
                                        {upcomingLessons.length}
                                    </Typography>
                                </Box>
                                <Schedule sx={{ fontSize: 40, color: '#ed6c02' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(2)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Completed Lessons
                                    </Typography>
                                    <Typography variant="h4">
                                        {completedLessons.length}
                                    </Typography>
                                </Box>
                                <CheckCircle sx={{ fontSize: 40, color: '#2e7d32' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(3)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Lessons
                                    </Typography>
                                    <Typography variant="h4">
                                        {lessons.length}
                                    </Typography>
                                </Box>
                                <MenuBook sx={{ fontSize: 40, color: '#9c27b0' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ marginBottom: 2 }}>
                <Tab label={`Today (${todayLessons.length})`} />
                <Tab label={`Upcoming (${upcomingLessons.length})`} />
                <Tab label={`Completed (${completedLessons.length})`} />
                <Tab label={`All Lessons (${lessons.length})`} />
            </Tabs>

            {tabValue === 0 && (
                <Box>
                    {todayLessons.length === 0 ? (
                        <Paper sx={{ padding: 4, textAlign: 'center' }}>
                            <CalendarToday sx={{ fontSize: 60, color: 'text.secondary', marginBottom: 2 }} />
                            <Typography variant="h6" color="textSecondary">
                                No lessons scheduled for today
                            </Typography>
                        </Paper>
                    ) : (
                        todayLessons.map(lesson => renderLessonCard(lesson))
                    )}
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    {upcomingLessons.length === 0 ? (
                        <Paper sx={{ padding: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                No upcoming lessons
                            </Typography>
                        </Paper>
                    ) : (
                        upcomingLessons.map(lesson => renderLessonCard(lesson))
                    )}
                </Box>
            )}

            {tabValue === 2 && (
                <Box>
                    {completedLessons.length === 0 ? (
                        <Paper sx={{ padding: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                No completed lessons yet
                            </Typography>
                        </Paper>
                    ) : (
                        completedLessons.map(lesson => renderLessonCard(lesson))
                    )}
                </Box>
            )}

            {tabValue === 3 && (
                <Box>
                    {lessons.length === 0 ? (
                        <Paper sx={{ padding: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                No lessons scheduled yet
                            </Typography>
                        </Paper>
                    ) : (
                        lessons.map(lesson => renderLessonCard(lesson))
                    )}
                </Box>
            )}
        </Box>
    );
};

export default StudentLessons;
