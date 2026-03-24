import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CircularProgress, TextField, MenuItem, Typography, Paper } from '@mui/material';
import axios from 'axios';
import Popup from '../../components/Popup';

const TeacherCreateTest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [totalMarks, setTotalMarks] = useState('');
    const [duration, setDuration] = useState('');
    const [testDate, setTestDate] = useState('');
    const [testTime, setTestTime] = useState('');
    const [testType, setTestType] = useState('Quiz');
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const subjects = currentUser.teachSubjects || [];
    const teachSubject = currentUser.teachSubject;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        // Combine date and time
        const combinedDateTime = new Date(`${testDate}T${testTime}`);

        const testData = {
            title,
            description,
            subject: subject || teachSubject._id,
            sclass: currentUser.teachSclass._id,
            teacher: currentUser._id,
            school: currentUser.school._id,
            totalMarks: Number(totalMarks),
            duration: Number(duration),
            date: combinedDateTime,
            type: testType,
            status: 'Scheduled'
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/TestCreate`, testData);
            if (response.data.message) {
                setMessage(response.data.message);
                setShowPopup(true);
            } else {
                setMessage('Test created successfully!');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Teacher/tests');
                }, 2000);
            }
        } catch (error) {
            setMessage('Error creating test');
            setShowPopup(true);
        }
        setLoader(false);
    };

    return (
        <Box sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Create New Test
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Test Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                        margin="normal"
                    />
                    {subjects.length > 0 ? (
                        <TextField
                            fullWidth
                            select
                            label="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            margin="normal"
                        >
                            {subjects.map((sub) => (
                                <MenuItem key={sub.subject._id} value={sub.subject._id}>
                                    {sub.subject.subName}
                                </MenuItem>
                            ))}
                        </TextField>
                    ) : (
                        <TextField
                            fullWidth
                            label="Subject"
                            value={teachSubject?.subName || ''}
                            disabled
                            margin="normal"
                        />
                    )}
                    <TextField
                        fullWidth
                        select
                        label="Test Type"
                        value={testType}
                        onChange={(e) => setTestType(e.target.value)}
                        required
                        margin="normal"
                    >
                        <MenuItem value="Quiz">Quiz</MenuItem>
                        <MenuItem value="Mid-term">Mid-term</MenuItem>
                        <MenuItem value="Final">Final</MenuItem>
                        <MenuItem value="Assignment">Assignment</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        label="Total Marks"
                        type="number"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Duration (minutes)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Test Date"
                        type="date"
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Test Time"
                        type="time"
                        value={testTime}
                        onChange={(e) => setTestTime(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <Box sx={{ marginTop: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loader}
                            fullWidth
                        >
                            {loader ? <CircularProgress size={24} /> : 'Create Test'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/Teacher/tests')}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default TeacherCreateTest;
