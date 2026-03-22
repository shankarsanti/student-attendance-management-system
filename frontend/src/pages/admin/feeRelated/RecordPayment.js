import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, MenuItem, Button, Typography, CircularProgress } from '@mui/material';
import { recordPayment, getAllFeeStructures } from '../../../redux/feeRelated/feeHandle';
import { getStudentDetail } from '../../../redux/studentRelated/studentHandle';
import Popup from '../../../components/Popup';

const RecordPayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const { feeStructuresList, loading, response, error } = useSelector((state) => state.fee);

    const [studentId, setStudentId] = useState('');
    const [feeStructureId, setFeeStructureId] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [transactionId, setTransactionId] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [remarks, setRemarks] = useState('');
    const [receivedBy, setReceivedBy] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getAllFeeStructures(currentUser._id));
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

    const paymentMethods = ['Cash', 'Card', 'Online', 'Cheque', 'Bank Transfer'];

    const submitHandler = (event) => {
        event.preventDefault();

        const fields = {
            student: studentId,
            feeStructure: feeStructureId,
            amountPaid: Number(amountPaid),
            paymentMethod,
            transactionId: transactionId || undefined,
            paymentDate,
            remarks: remarks || undefined,
            receivedBy: receivedBy || undefined,
            school: currentUser._id,
            status: 'Paid'
        };

        dispatch(recordPayment(fields));
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
                            Record Fee Payment
                        </Typography>
                        <form onSubmit={submitHandler}>
                            <TextField
                                fullWidth
                                label="Student ID"
                                variant="outlined"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                helperText="Enter the student's ID"
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                select
                                label="Fee Type"
                                variant="outlined"
                                value={feeStructureId}
                                onChange={(e) => setFeeStructureId(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            >
                                {Array.isArray(feeStructuresList) && feeStructuresList.map((fee) => (
                                    <MenuItem key={fee._id} value={fee._id}>
                                        {fee.feeName} - {fee.feeType} (₹{fee.amount})
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Amount Paid"
                                type="number"
                                variant="outlined"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="Payment Date"
                                type="date"
                                variant="outlined"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                select
                                label="Payment Method"
                                variant="outlined"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            >
                                {paymentMethods.map((method) => (
                                    <MenuItem key={method} value={method}>
                                        {method}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Transaction ID (Optional)"
                                variant="outlined"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="Received By (Optional)"
                                variant="outlined"
                                value={receivedBy}
                                onChange={(e) => setReceivedBy(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="Remarks (Optional)"
                                variant="outlined"
                                multiline
                                rows={2}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Record Payment'}
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

export default RecordPayment;
