import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, MenuItem, Button, Typography, CircularProgress } from '@mui/material';
import { createFeeStructure } from '../../../redux/feeRelated/feeHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';

const AddFeeStructure = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { loading, response, error } = useSelector((state) => state.fee);

    const [feeName, setFeeName] = useState('');
    const [feeType, setFeeType] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [frequency, setFrequency] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    useEffect(() => {
        if (response) {
            setMessage(response);
            setShowPopup(true);
        } else if (error) {
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [response, error]);

    const feeTypes = ['Tuition Fee', 'Exam Fee', 'Transport Fee', 'Library Fee', 'Sports Fee', 'Other'];
    const frequencies = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'];

    const submitHandler = (event) => {
        event.preventDefault();

        const fields = {
            feeName,
            feeType,
            amount: Number(amount),
            class: selectedClass || null,
            frequency,
            dueDate: dueDate || null,
            description,
            school: currentUser._id
        };

        dispatch(createFeeStructure(fields));
    };

    return (
        <>
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
                        <Typography variant="h4" sx={{ mb: 3 }}>
                            Add Fee Structure
                        </Typography>
                        <form onSubmit={submitHandler}>
                            <TextField
                                fullWidth
                                label="Fee Name"
                                variant="outlined"
                                value={feeName}
                                onChange={(e) => setFeeName(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                select
                                label="Fee Type"
                                variant="outlined"
                                value={feeType}
                                onChange={(e) => setFeeType(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            >
                                {feeTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                variant="outlined"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                select
                                label="Class (Optional - Leave empty for all classes)"
                                variant="outlined"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                sx={{ mb: 3 }}
                            >
                                <MenuItem value="">All Classes</MenuItem>
                                {Array.isArray(sclassesList) && sclassesList.map((classItem) => (
                                    <MenuItem key={classItem._id} value={classItem._id}>
                                        {classItem.sclassName}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                select
                                label="Frequency"
                                variant="outlined"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            >
                                {frequencies.map((freq) => (
                                    <MenuItem key={freq} value={freq}>
                                        {freq}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Due Date (Optional)"
                                type="date"
                                variant="outlined"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="Description (Optional)"
                                variant="outlined"
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Fee Structure'}
                            </Button>
                            <Button
                                fullWidth
                                size="large"
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate(-1)}
                            >
                                Go Back
                            </Button>
                        </form>
                    </div>
                </Box>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AddFeeStructure;
