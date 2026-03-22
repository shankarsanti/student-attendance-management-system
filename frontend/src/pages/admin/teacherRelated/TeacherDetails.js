import React, { useEffect, useState } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, Box, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);

    const [openDialog, setOpenDialog] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('Sem 1');
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    useEffect(() => {
        if (teacherDetails?.teachSclass?._id) {
            fetchAvailableSubjects();
        }
    }, [teacherDetails]);

    const fetchAvailableSubjects = async () => {
        setLoadingSubjects(true);
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/ClassSubjects/${teacherDetails.teachSclass._id}`);
            console.log('Available subjects:', result.data);
            if (Array.isArray(result.data)) {
                setAvailableSubjects(result.data);
            }
        } catch (err) {
            console.error('Error fetching subjects:', err);
        } finally {
            setLoadingSubjects(false);
        }
    };

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;
    const hasMultipleSubjects = teacherDetails?.teachSubjects && teacherDetails.teachSubjects.length > 0;

    const handleAddSubject = () => {
        setOpenDialog(true);
        setSelectedSubjects([]);
    };

    const handleSubjectToggle = (subjectId) => {
        setSelectedSubjects(prev => {
            if (prev.includes(subjectId)) {
                return prev.filter(id => id !== subjectId);
            } else {
                return [...prev, subjectId];
            }
        });
    };

    const handleAddSelectedSubjects = async () => {
        try {
            console.log('Adding subjects:', selectedSubjects, 'for semester:', selectedSemester);
            for (const subjectId of selectedSubjects) {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/TeacherAddSubject`, {
                    teacherId: teacherID,
                    subjectId: subjectId,
                    semester: selectedSemester
                });
                console.log('Subject added:', response.data);
            }
            setOpenDialog(false);
            setSelectedSubjects([]);
            setSelectedSemester('Sem 1');
            dispatch(getTeacherDetails(teacherID));
        } catch (err) {
            console.error('Error adding subjects:', err);
            alert('Error adding subjects. Please check console for details.');
        }
    };

    const handleRemoveSubject = async (subjectId, semester) => {
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/TeacherRemoveSubject`, {
                teacherId: teacherID,
                subjectId: subjectId,
                semester: semester
            });
            dispatch(getTeacherDetails(teacherID));
        } catch (err) {
            console.error(err);
        }
    };

    const alreadyAssignedSubjects = [
        ...(teacherDetails?.teachSubjects?.map(ts => ts.subject?._id) || []),
        ...(teacherDetails?.teachSubject?._id ? [teacherDetails.teachSubject._id] : [])
    ];

    // Group subjects by semester
    const subjectsBySemester = {};
    teacherDetails?.teachSubjects?.forEach(ts => {
        if (!subjectsBySemester[ts.semester]) {
            subjectsBySemester[ts.semester] = [];
        }
        subjectsBySemester[ts.semester].push(ts);
    });

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Container>
                    <Typography variant="h4" align="center" gutterBottom>
                        Teacher Details
                    </Typography>
                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Teacher Name: {teacherDetails?.name}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Email: {teacherDetails?.email}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Class Name: {teacherDetails?.teachSclass?.sclassName}
                        </Typography>

                        {isSubjectNamePresent && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Primary Subject:
                                </Typography>
                                <Chip 
                                    label={`${teacherDetails?.teachSubject?.subName} (${teacherDetails?.teachSubject?.sessions} sessions)`}
                                    color="primary"
                                    sx={{ mr: 1, mb: 1 }}
                                />
                            </Box>
                        )}

                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Subjects by Semester:
                                </Typography>
                                <IconButton 
                                    color="primary" 
                                    onClick={handleAddSubject}
                                    sx={{ ml: 2 }}
                                    title="Add subjects to this teacher"
                                >
                                    <AddIcon />
                                </IconButton>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleAddSubject}
                                    sx={{ ml: 1 }}
                                >
                                    Add Subjects
                                </Button>
                            </Box>

                            {Object.keys(subjectsBySemester).length > 0 ? (
                                Object.entries(subjectsBySemester).map(([semester, subjects]) => (
                                    <Box key={semester} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {semester}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 2 }}>
                                            {subjects.map((ts) => (
                                                <Chip
                                                    key={`${ts.subject?._id}-${semester}`}
                                                    label={`${ts.subject?.subName} (${ts.subject?.sessions} sessions)`}
                                                    onDelete={() => handleRemoveSubject(ts.subject?._id, semester)}
                                                    deleteIcon={<DeleteIcon />}
                                                    color="secondary"
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No subjects assigned. Click the + button or "Add Subjects" to assign subjects.
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate('/Admin/teachers')}
                            >
                                Back to Teachers
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate(`/Admin/teachers/edit/${teacherID}`)}
                                sx={{ ml: 2 }}
                            >
                                Edit Teacher
                            </Button>
                        </Box>
                    </Paper>

                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Add Subjects to Teacher</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mb: 3, mt: 2 }}>
                                <InputLabel>Select Semester</InputLabel>
                                <Select
                                    value={selectedSemester}
                                    label="Select Semester"
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                >
                                    {semesters.map((sem) => (
                                        <MenuItem key={sem} value={sem}>{sem}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {loadingSubjects ? (
                                <Typography sx={{ p: 2 }}>Loading subjects...</Typography>
                            ) : (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Select subjects for {selectedSemester}:
                                    </Typography>
                                    <List>
                                        {availableSubjects
                                            .filter(subject => !alreadyAssignedSubjects.includes(subject._id))
                                            .map((subject) => (
                                                <ListItem key={subject._id}>
                                                    <Checkbox
                                                        checked={selectedSubjects.includes(subject._id)}
                                                        onChange={() => handleSubjectToggle(subject._id)}
                                                    />
                                                    <ListItemText 
                                                        primary={subject.subName}
                                                        secondary={`${subject.sessions} sessions`}
                                                    />
                                                </ListItem>
                                            ))}
                                    </List>
                                    {availableSubjects.filter(subject => !alreadyAssignedSubjects.includes(subject._id)).length === 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                                            {availableSubjects.length === 0 
                                                ? 'No subjects found for this class. Please add subjects first.'
                                                : 'All subjects have been assigned to this teacher'}
                                        </Typography>
                                    )}
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button 
                                onClick={handleAddSelectedSubjects} 
                                variant="contained"
                                disabled={selectedSubjects.length === 0}
                            >
                                Add to {selectedSemester}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            )}
        </>
    );
};

export default TeacherDetails;