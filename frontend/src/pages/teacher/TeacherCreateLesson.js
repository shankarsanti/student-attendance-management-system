import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    MenuItem,
    Typography,
    Paper,
    Grid,
    IconButton
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import axios from 'axios';
import Popup from '../../components/Popup';

const TeacherCreateLesson = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);

    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [lessonDate, setLessonDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [lessonNumber, setLessonNumber] = useState('');
    const [chapter, setChapter] = useState('');
    const [objectives, setObjectives] = useState(['']);
    const [materials, setMaterials] = useState(['']);
    const [homework, setHomework] = useState('');
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const subjects = currentUser.teachSubjects || [];
    const teachSubject = currentUser.teachSubject;

    const calculateDuration = () => {
        if (startTime && endTime) {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            const diff = (end - start) / 1000 / 60; // minutes
            return diff > 0 ? diff : 0;
        }
        return 0;
    };

    const handleAddObjective = () => {
        setObjectives([...objectives, '']);
    };

    const handleRemoveObjective = (index) => {
        setObjectives(objectives.filter((_, i) => i !== index));
    };

    const handleObjectiveChange = (index, value) => {
        const newObjectives = [...objectives];
        newObjectives[index] = value;
        setObjectives(newObjectives);
    };

    const handleAddMaterial = () => {
        setMaterials([...materials, '']);
    };

    const handleRemoveMaterial = (index) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    const handleMaterialChange = (index, value) => {
        const newMaterials = [...materials];
        newMaterials[index] = value;
        setMaterials(newMaterials);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const duration = calculateDuration();
        if (duration <= 0) {
            setMessage('End time must be after start time');
            setShowPopup(true);
            setLoader(false);
            return;
        }

        const lessonData = {
            title,
            topic,
            description,
            subject: subject || teachSubject._id,
            sclass: currentUser.teachSclass._id,
            teacher: currentUser._id,
            school: currentUser.school._id,
            date: new Date(lessonDate),
            startTime,
            endTime,
            duration,
            lessonNumber: lessonNumber ? Number(lessonNumber) : undefined,
            chapter,
            objectives: objectives.filter(obj => obj.trim() !== ''),
            materials: materials.filter(mat => mat.trim() !== ''),
            homework,
            status: 'Scheduled'
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/LessonCreate`, lessonData);
            if (response.data.message) {
                setMessage(response.data.message);
                setShowPopup(true);
            } else {
                setMessage('Lesson scheduled successfully!');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Teacher/lessons');
                }, 2000);
            }
        } catch (error) {
            setMessage('Error creating lesson');
            setShowPopup(true);
        }
        setLoader(false);
    };

    return (
        <Box sx={{ padding: 3, maxWidth: 900, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Schedule New Lesson
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Lesson Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {subjects.length > 0 ? (
                                <TextField
                                    fullWidth
                                    select
                                    label="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
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
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Lesson Date"
                                type="date"
                                value={lessonDate}
                                onChange={(e) => setLessonDate(e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="End Time"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Duration"
                                value={`${calculateDuration()} minutes`}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Lesson Number (Optional)"
                                type="number"
                                value={lessonNumber}
                                onChange={(e) => setLessonNumber(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Chapter (Optional)"
                                value={chapter}
                                onChange={(e) => setChapter(e.target.value)}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                                Learning Objectives
                            </Typography>
                            {objectives.map((objective, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1, marginBottom: 1 }}>
                                    <TextField
                                        fullWidth
                                        label={`Objective ${index + 1}`}
                                        value={objective}
                                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                    />
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveObjective(index)}
                                        disabled={objectives.length === 1}
                                    >
                                        <Remove />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={handleAddObjective}
                                variant="outlined"
                                size="small"
                            >
                                Add Objective
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                                Materials Needed
                            </Typography>
                            {materials.map((material, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1, marginBottom: 1 }}>
                                    <TextField
                                        fullWidth
                                        label={`Material ${index + 1}`}
                                        value={material}
                                        onChange={(e) => handleMaterialChange(index, e.target.value)}
                                    />
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveMaterial(index)}
                                        disabled={materials.length === 1}
                                    >
                                        <Remove />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={handleAddMaterial}
                                variant="outlined"
                                size="small"
                            >
                                Add Material
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Homework (Optional)"
                                value={homework}
                                onChange={(e) => setHomework(e.target.value)}
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ marginTop: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loader}
                            fullWidth
                        >
                            {loader ? <CircularProgress size={24} /> : 'Schedule Lesson'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/Teacher/lessons')}
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

export default TeacherCreateLesson;
