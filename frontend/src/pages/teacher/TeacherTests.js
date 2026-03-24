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
    CircularProgress
} from '@mui/material';
import { Add, Visibility, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import Popup from '../../components/Popup';

const TeacherTests = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/TestsByTeacher/${currentUser._id}`);
            if (response.data.message) {
                setTests([]);
            } else {
                setTests(response.data);
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (testId) => {
        if (window.confirm('Are you sure you want to delete this test?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/Test/${testId}`);
                setMessage('Test deleted successfully');
                setShowPopup(true);
                fetchTests();
            } catch (error) {
                setMessage('Error deleting test');
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
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

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
                <Typography variant="h4">My Tests</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/Teacher/tests/create')}
                >
                    Create New Test
                </Button>
            </Box>

            {tests.length === 0 ? (
                <Paper sx={{ padding: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        No tests created yet
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/Teacher/tests/create')}
                        sx={{ marginTop: 2 }}
                    >
                        Create Your First Test
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total Marks</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tests.map((test) => (
                                <TableRow key={test._id}>
                                    <TableCell>{test.title}</TableCell>
                                    <TableCell>{test.subject?.subName}</TableCell>
                                    <TableCell>{test.type}</TableCell>
                                    <TableCell>
                                        {new Date(test.date).toLocaleDateString()} {new Date(test.date).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>{test.totalMarks}</TableCell>
                                    <TableCell>{test.duration} min</TableCell>
                                    <TableCell>
                                        <Chip label={test.status} color={getStatusColor(test.status)} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/Teacher/tests/results/${test._id}`)}
                                            title="View/Enter Results"
                                        >
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(test._id)}
                                            title="Delete Test"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default TeacherTests;
