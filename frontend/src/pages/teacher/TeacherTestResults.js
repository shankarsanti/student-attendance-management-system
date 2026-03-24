import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    TextField,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import axios from 'axios';
import Popup from '../../components/Popup';

const TeacherTestResults = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchTestDetails();
    }, [testId]);

    const fetchTestDetails = async () => {
        try {
            const testResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/Test/${testId}`);
            setTest(testResponse.data);

            const studentsResponse = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/Sclass/Students/${testResponse.data.sclass._id}`
            );
            
            if (!studentsResponse.data.message) {
                setStudents(studentsResponse.data);
                
                // Initialize results from existing test results
                const initialResults = {};
                testResponse.data.results.forEach(result => {
                    initialResults[result.student._id] = {
                        marksObtained: result.marksObtained,
                        remarks: result.remarks || ''
                    };
                });
                setResults(initialResults);
            }
        } catch (error) {
            console.error('Error fetching test details:', error);
            setMessage('Error loading test details');
            setShowPopup(true);
        }
        setLoading(false);
    };

    const handleMarksChange = (studentId, marks) => {
        const marksValue = Number(marks);
        if (marksValue > test.totalMarks) {
            setMessage(`Marks cannot exceed ${test.totalMarks}`);
            setShowPopup(true);
            return;
        }
        setResults({
            ...results,
            [studentId]: {
                ...results[studentId],
                marksObtained: marksValue
            }
        });
    };

    const handleRemarksChange = (studentId, remarks) => {
        setResults({
            ...results,
            [studentId]: {
                ...results[studentId],
                remarks
            }
        });
    };

    const handleSaveResult = async (studentId) => {
        const result = results[studentId];
        if (!result || result.marksObtained === undefined) {
            setMessage('Please enter marks');
            setShowPopup(true);
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/TestResult`, {
                testId: test._id,
                studentId,
                marksObtained: result.marksObtained,
                remarks: result.remarks
            });
            setMessage('Result saved successfully');
            setShowPopup(true);
            fetchTestDetails();
        } catch (error) {
            setMessage('Error saving result');
            setShowPopup(true);
        }
    };

    const handleMarkTestComplete = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/Test/${testId}`, {
                status: 'Completed'
            });
            setMessage('Test marked as completed');
            setShowPopup(true);
            setOpenDialog(false);
            fetchTestDetails();
        } catch (error) {
            setMessage('Error updating test status');
            setShowPopup(true);
        }
    };

    const getExistingResult = (studentId) => {
        return test?.results?.find(r => r.student._id === studentId);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!test) {
        return (
            <Box sx={{ padding: 3 }}>
                <Typography>Test not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/Teacher/tests')}
                sx={{ marginBottom: 2 }}
            >
                Back to Tests
            </Button>

            <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {test.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Typography><strong>Subject:</strong> {test.subject?.subName}</Typography>
                    <Typography><strong>Type:</strong> {test.type}</Typography>
                    <Typography><strong>Total Marks:</strong> {test.totalMarks}</Typography>
                    <Typography><strong>Duration:</strong> {test.duration} minutes</Typography>
                    <Typography>
                        <strong>Date:</strong> {new Date(test.date).toLocaleDateString()} {new Date(test.date).toLocaleTimeString()}
                    </Typography>
                    <Chip 
                        label={test.status} 
                        color={test.status === 'Completed' ? 'success' : 'primary'} 
                    />
                </Box>
                {test.description && (
                    <Typography sx={{ marginTop: 2 }}>
                        <strong>Description:</strong> {test.description}
                    </Typography>
                )}
                {test.status !== 'Completed' && (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => setOpenDialog(true)}
                        sx={{ marginTop: 2 }}
                    >
                        Mark Test as Completed
                    </Button>
                )}
            </Paper>

            <Paper>
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Student Results
                    </Typography>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Roll No</TableCell>
                                <TableCell>Student Name</TableCell>
                                <TableCell>Marks Obtained</TableCell>
                                <TableCell>Percentage</TableCell>
                                <TableCell>Remarks</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => {
                                const existingResult = getExistingResult(student._id);
                                const currentMarks = results[student._id]?.marksObtained ?? existingResult?.marksObtained ?? '';
                                const currentRemarks = results[student._id]?.remarks ?? existingResult?.remarks ?? '';
                                const percentage = currentMarks ? ((currentMarks / test.totalMarks) * 100).toFixed(2) : '-';

                                return (
                                    <TableRow key={student._id}>
                                        <TableCell>{student.rollNum}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={currentMarks}
                                                onChange={(e) => handleMarksChange(student._id, e.target.value)}
                                                inputProps={{ min: 0, max: test.totalMarks }}
                                                sx={{ width: 100 }}
                                            />
                                            <Typography variant="caption" display="block">
                                                / {test.totalMarks}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {percentage !== '-' && (
                                                <Chip 
                                                    label={`${percentage}%`}
                                                    color={percentage >= 60 ? 'success' : percentage >= 40 ? 'warning' : 'error'}
                                                    size="small"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                value={currentRemarks}
                                                onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                                                placeholder="Add remarks"
                                                sx={{ width: 200 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<Save />}
                                                onClick={() => handleSaveResult(student._id)}
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Mark Test as Completed</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to mark this test as completed? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleMarkTestComplete} variant="contained" color="success">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default TeacherTestResults;
