import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../redux/userRelated/userHandle';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import Popup from '../../../components/Popup';
import axios from 'axios';

const EditNotice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);

    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const noticeID = params.id;

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Notice/${noticeID}`);
                if (result.data) {
                    setTitle(result.data.title || '');
                    setDetails(result.data.details || '');
                    const dateObj = new Date(result.data.date);
                    setDate(dateObj.toISOString().substring(0, 10));
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchNotice();
    }, [noticeID]);

    const submitHandler = (event) => {
        event.preventDefault();
        
        const fields = {
            title,
            details,
            date,
        };

        dispatch(updateUser(noticeID, fields, 'Notice'))
            .then(() => {
                setMessage('Notice updated successfully');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Admin/notices');
                }, 2000);
            })
            .catch(() => {
                setMessage('Error updating notice');
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
                                <h2>Edit Notice</h2>
                            </Stack>
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        variant="outlined"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Details"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        value={details}
                                        onChange={(event) => setDetails(event.target.value)}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Date"
                                        type="date"
                                        variant="outlined"
                                        value={date}
                                        onChange={(event) => setDate(event.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Stack>
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    type="submit"
                                    variant="contained"
                                >
                                    Update Notice
                                </Button>
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate('/Admin/notices')}
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

export default EditNotice;
