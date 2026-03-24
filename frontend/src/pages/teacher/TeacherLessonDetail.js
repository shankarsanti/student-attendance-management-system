import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Paper,
    Typography,
    Grid,
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Divider
} from '@mui/material';
import { ArrowBack, CheckCircle, Cancel, Edit } from '@mui/icons-material';
import axios from 'axios';
import Popup from '../../components/Popup';

const TeacherLessonDetail = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchLessonDetails();
    }, [lessonId]);

    const fetchLessonDetails = async () => {
        try {
            const lessonResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/Lesson/${lessonId}`);
            setLesson(lessonResponse.data);
            setNotes(lessonResponse.data.notes || '');
            setStatus(lessonResponse.data.status);

            const studentsResponse = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/Sclass/Students/${lessonResponse.data.sclass._id}`
            );
            
            if (!studentsResponse.data.message) {
                setStudents(studentsResponse.data);
                
                // Initialize attendance from existing lesson attendance
                const initialAttendance = {};
                lessonResponse.data.attendance.forEach(att => {
                    initialAttendance[att.student._id] = att.status;
                });
                setAttendance(initialAttendance);
            }
        } catch (error) {
            console.error('Error fetching lesson details:', error);
            setMessage('Error loading lesson details');
            setShowPopup(true);
        }
        setLoading(false);
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance({
            ...attendance,
            [studentId]: status
        });
    };

    const handleSaveAttendance = async (studentId) => {
        const attendanceStatus = attendance[studentId];
        if (!attendanceStatus) {
            setMessage('Please select attendance status');
            setShowPopup(true);
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/LessonAttendance`, {
                lessonId: lesson._id,
                studentId,
                status: attendanceStatus
            });
            setMessage('Attendance saved successfully');
            setShowPopup(true);
            fetchLessonDetails();
        } catch (error) {
            setMessage('Error saving attendance');
            setShowPopup(true);
        }
    };

    const handleUpdateLesson = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/Lesson/${lessonId}`, {
                notes,
                status
            });
            setMessage('Lesson updated successfully');
            setShowPopup(true);
            setEditMode(false);
            fetchLessonDetails();
        } catch (error) {
            setMessage('Error updating lesson');
            setShowPopup(true);
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

    const getAttendanceStats = () => {
        const present = Object.values(attendance).filter(s => s === 'Present').length;
        const absent = Object.values(attendance).filter(s => s === 'Absent').length;
        const late = Object.values(attendance).filter(s => s === 'Late').length;
        return { present, absent, late };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!lesson) {
        return (
            <Box sx={{ padding: 3 }}>
                <Typography>Lesson not found</Typography>
            </Box>
        );
    }

    const stats = getAttendanceStats();

    return (
        <Box sx={{ padding: 3 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/Teacher/lessons')}
                sx={{ marginBottom: 2 }}
            >
                Back to Lessons
            </Button>

            <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography variant="h4">
                        {lesson.title}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? 'Cancel Edit' : 'Edit Lesson'}
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography><strong>Topic:</strong> {lesson.topic}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography><strong>Subject:</strong> {lesson.subject?.subName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography><strong>Date:</strong> {new Date(lesson.date).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography><strong>Time:</strong> {lesson.startTime} - {lesson.endTime} ({lesson.duration} min)</Typography>
                    </Grid>
                    {lesson.lessonNumber && (
                        <Grid item xs={12} md={6}>
                            <Typography><strong>Lesson Number:</strong> {lesson.lessonNumber}</Typography>
                        </Grid>
                    )}
                    {lesson.chapter && (
                        <Grid item xs={12} md={6}>
                            <Typography><strong>Chapter:</strong> {lesson.chapter}</Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        {editMode ? (
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value="Scheduled">Scheduled</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </TextField>
                        ) : (
                            <Typography>
                                <strong>Status:</strong> <Chip label={lesson.status} color={getStatusColor(lesson.status)} size="small" />
                            </Typography>
                        )}
                    </Grid>
                </Grid>

                {lesson.description && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6">Description</Typography>
                        <Typography>{lesson.description}</Typography>
                    </Box>
                )}

                {lesson.objectives && lesson.objectives.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6">Learning Objectives</Typography>
                        <ul>
                            {lesson.objectives.map((obj, index) => (
                                <li key={index}><Typography>{obj}</Typography></li>
                            ))}
                        </ul>
                    </Box>
                )}

                {lesson.materials && lesson.materials.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6">Materials</Typography>
                        <ul>
                            {lesson.materials.map((mat, index) => (
                                <li key={index}><Typography>{mat}</Typography></li>
                            ))}
                        </ul>
                    </Box>
                )}

                {lesson.homework && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6">Homework</Typography>
                        <Typography>{lesson.homework}</Typography>
                    </Box>
                )}

                <Divider sx={{ marginY: 2 }} />

                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Notes</Typography>
                    {editMode ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this lesson..."
                        />
                    ) : (
                        <Typography>{lesson.notes || 'No notes added yet'}</Typography>
                    )}
                </Box>

                {editMode && (
                    <Button
                        variant="contained"
                        onClick={handleUpdateLesson}
                        sx={{ marginTop: 2 }}
                    >
                        Save Changes
                    </Button>
                )}
            </Paper>

            <Paper sx={{ padding: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Attendance
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    <Chip label={`Present: ${stats.present}`} color="success" />
                    <Chip label={`Absent: ${stats.absent}`} color="error" />
                    <Chip label={`Late: ${stats.late}`} color="warning" />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Roll No</TableCell>
                                <TableCell>Student Name</TableCell>
                                <TableCell>Attendance Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => {
                                const currentStatus = attendance[student._id] || '';
                                return (
                                    <TableRow key={student._id}>
                                        <TableCell>{student.rollNum}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            <TextField
                                                select
                                                size="small"
                                                value={currentStatus}
                                                onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                                                sx={{ width: 150 }}
                                            >
                                                <MenuItem value="Present">Present</MenuItem>
                                                <MenuItem value="Absent">Absent</MenuItem>
                                                <MenuItem value="Late">Late</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleSaveAttendance(student._id)}
                                            >
                                                Save
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default TeacherLessonDetail;
