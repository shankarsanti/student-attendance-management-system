import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { updateUser } from '../../../redux/userRelated/userHandle';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import Popup from '../../../components/Popup';

const EditTeacher = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const { teacherDetails, loading, error } = useSelector((state) => state.teacher);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    useEffect(() => {
        if (teacherDetails) {
            setName(teacherDetails.name || '');
            setEmail(teacherDetails.email || '');
        }
    }, [teacherDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        
        const fields = {
            name,
            email,
        };

        if (password !== '') {
            fields.password = password;
        }

        dispatch(updateUser(fields, teacherID, 'Teacher'))
            .then(() => {
                setMessage('Teacher updated successfully');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Admin/teachers');
                }, 2000);
            })
            .catch(() => {
                setMessage('Error updating teacher');
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
                                <h2>Edit Teacher</h2>
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
                                        label="Email"
                                        type="email"
                                        variant="outlined"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
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
                                    Update Teacher
                                </Button>
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate('/Admin/teachers')}
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

export default EditTeacher;
