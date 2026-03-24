import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import { Add, Visibility, Edit, Delete, CalendarToday } from '@mui/icons-material';
import axios from 'axios';
import Popup from '../../components/Popup';

const TeacherLessons = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [lessons, setLessons] = useState([]);
    const [todayLessons, setTodayLessons] = useState([]);
    const [upcomingLessons, setUpcomingLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchLessons();
        fetchTodayLessons();
        fetchUpcomingLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/LessonsByTeacher/${currentUser._id}`);
            if (response.data.message) {
                setLessons([]);
            } else {
                setLessons(response.data);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
        setLoading(false);
    };

    const fetchTodayLessons = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/TodayLessons/${currentUser._id}`);
            if (!response.data.message) {
                setTodayLessons(response.data);
            }
        } catch (error) {
            console.error('Error fetching today lessons:', error);
        }
    };

    const fetchUpcomingLessons = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/UpcomingLessons/${currentUser._id}`);
            if (!response.data.message) {
                setUpcomingLessons(response.data);
            }
        } catch (error) {
            console.error('Error fetching upcoming lessons:', error);
        }
    };

    const handleDelete = async (lessonId) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/Lesson/${lessonId}`);
                setMessage('Lesson deleted successfully');
                setShowPopup(true);
                fetchLessons();
                fetchTodayLessons();
                fetchUpcomingLessons();
            } catch (error) {
                setMessage('Error deleting lesson');
                setShowPopup(true);
            }
        }
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

    const renderLessonTable = (lessonList) => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Topic</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lessonList.map((lesson) => (
                        <TableRow key={lesson._id}>
                            <TableCell>{new Date(lesson.date).toLocaleDateString()}</TableCell>
                            <TableCell>{lesson.startTime} - {lesson.endTime}</TableCell>
                            <TableCell>{lesson.title}</TableCell>
                            <TableCell>{lesson.topic}</TableCell>
                            <TableCell>{lesson.subject?.subName}</TableCell>
                            <TableCell>{lesson.duration} min</TableCell>
                            <TableCell>
                                <Chip label={lesson.status} color={getStatusColor(lesson.status)} size="small" />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    color="primary"
                                    onClick={() => navigate(`/Teacher/lessons/detail/${lesson._id}`)}
                                    title="View Details"
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDelete(lesson._id)}
                                    title="Delete Lesson"
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Typography variant="h4">My Lessons</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/Teacher/lessons/create')}
                >
                    Schedule New Lesson
                </Button>
            </Box>

            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ marginBottom: 2 }}>
                <Tab label={`Today's Lessons (${todayLessons.length})`} />
                <Tab label={`Upcoming (${upcomingLessons.length})`} />
                <Tab label={`All Lessons (${lessons.length})`} />
            </Tabs>

            {tabValue === 0 && (
                todayLessons.length === 0 ? (
                    <Paper sx={{ padding: 4, textAlign: 'center' }}>
                        <CalendarToday sx={{ fontSize: 60, color: 'text.secondary', marginBottom: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                            No lessons scheduled for today
                        </Typography>
                    </Paper>
                ) : (
                    renderLessonTable(todayLessons)
                )
            )}

            {tabValue === 1 && (
                upcomingLessons.length === 0 ? (
                    <Paper sx={{ padding: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="textSecondary">
                            No upcoming lessons
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate('/Teacher/lessons/create')}
                            sx={{ marginTop: 2 }}
                        >
                            Schedule Your First Lesson
                        </Button>
                    </Paper>
                ) : (
                    renderLessonTable(upcomingLessons)
                )
            )}

            {tabValue === 2 && (
                lessons.length === 0 ? (
                    <Paper sx={{ padding: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="textSecondary">
                            No lessons scheduled yet
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate('/Teacher/lessons/create')}
                            sx={{ marginTop: 2 }}
                        >
                            Schedule Your First Lesson
                        </Button>
                    </Paper>
                ) : (
                    renderLessonTable(lessons)
                )
            )}

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default TeacherLessons;
