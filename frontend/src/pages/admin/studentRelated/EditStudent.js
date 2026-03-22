import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentDetails } from '../../../redux/studentRelated/studentHandle';
import { updateUser } from '../../../redux/userRelated/userHandle';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import Popup from '../../../components/Popup';

const EditStudent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const { studentDetails, loading, error } = useSelector((state) => state.student);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const studentID = params.id;

    useEffect(() => {
        dispatch(getStudentDetails(studentID));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (studentDetails) {
            setName(studentDetails.name || '');
            setRollNum(studentDetails.rollNum || '');
        }
    }, [studentDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        
        const fields = {
            name,
            rollNum,
        };

        if (password !== '') {
            fields.password = password;
        }

        dispatch(updateUser(studentID, fields, 'Student'))
            .then(() => {
                setMessage('Student updated successfully');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Admin/students');
                }, 2000);
            })
            .catch(() => {
                setMessage('Error updating student');
                setShowPopup(true);
            });
    };

    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <Box
                    sx={{
                        flex: '1 1 auto',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 550,
                            px: 3,
                            py: '100px',
                            width: '100%'
                        }}
                    >
                        <div>
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <h2>Edit Student</h2>
                            </Stack>
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        variant="outlined"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Roll Number"
                                        variant="outlined"
                                        value={rollNum}
                                        onChange={(event) => setRollNum(event.target.value)}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password (leave blank to keep current)"
                                        type="password"
                                        variant="outlined"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </Stack>
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    type="submit"
                                    variant="contained"
                                >
                                    Update Student
                                </Button>
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate('/Admin/students')}
                                >
                                    Cancel
                                </Button>
                            </form>
                        </div>
                    </Box>
                </Box>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default EditStudent;
