import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CircularProgress, Stack, TextField, Typography, Paper } from '@mui/material';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
import { underControl } from '../../redux/userRelated/userSlice';

const TeacherComplain = () => {
  const [complaint, setComplaint] = useState('');
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const { status, currentUser, response, error } = useSelector(state => state.user);

  const address = "Complain";

  const fields = {
    user: currentUser._id,
    date: new Date(),
    complaint: complaint,
    school: currentUser.school._id
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!complaint.trim()) {
      setMessage("Please enter a complaint");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      setComplaint('');
      setMessage("Complaint submitted successfully");
      setShowPopup(true);
      setLoader(false);
      dispatch(underControl());
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, response, error, dispatch]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Submit a Complaint
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Have an issue or concern? Let us know and we'll address it.
        </Typography>
        <form onSubmit={submitHandler}>
          <Stack spacing={3}>
            <TextField
              label="Your Complaint"
              variant="outlined"
              value={complaint}
              onChange={(event) => setComplaint(event.target.value)}
              required
              multiline
              rows={6}
              placeholder="Describe your complaint in detail..."
            />
            <Button
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              disabled={loader}
            >
              {loader ? <CircularProgress size={24} color="inherit" /> : "Submit Complaint"}
            </Button>
          </Stack>
        </form>
      </Paper>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default TeacherComplain;