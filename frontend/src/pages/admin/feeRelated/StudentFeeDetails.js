import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { getStudentFeeStatus, getStudentPayments } from '../../../redux/feeRelated/feeHandle';
import { GreenButton } from '../../../components/buttonStyles';

const StudentFeeDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { studentFeeStatus, paymentsList, loading } = useSelector((state) => state.fee);

    useEffect(() => {
        dispatch(getStudentFeeStatus(id));
        dispatch(getStudentPayments(id));
    }, [id, dispatch]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'success';
            case 'Partial':
                return 'warning';
            case 'Pending':
                return 'error';
            default:
                return 'default';
        }
    };

    const totalDue = studentFeeStatus.reduce((sum, fee) => sum + fee.pendingAmount, 0);
    const totalPaid = studentFeeStatus.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const totalAmount = studentFeeStatus.reduce((sum, fee) => sum + fee.totalAmount, 0);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Student Fee Details
            </Typography>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <>
                    <Paper sx={{ padding: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Fee Summary</Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                                <Typography variant="h5">₹{totalAmount}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Paid</Typography>
                                <Typography variant="h5" color="success.main">₹{totalPaid}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Due</Typography>
                                <Typography variant="h5" color="error.main">₹{totalDue}</Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ padding: 2 }}>Fee Structure Status</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fee Name</TableCell>
                                        <TableCell>Fee Type</TableCell>
                                        <TableCell align="right">Total Amount</TableCell>
                                        <TableCell align="right">Paid Amount</TableCell>
                                        <TableCell align="right">Pending Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {studentFeeStatus.map((fee, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{fee.feeStructure.feeName}</TableCell>
                                            <TableCell>{fee.feeStructure.feeType}</TableCell>
                                            <TableCell align="right">₹{fee.totalAmount}</TableCell>
                                            <TableCell align="right">₹{fee.paidAmount}</TableCell>
                                            <TableCell align="right">₹{fee.pendingAmount}</TableCell>
                                            <TableCell>
                                                <Chip label={fee.status} color={getStatusColor(fee.status)} size="small" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    <Paper sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ padding: 2 }}>Payment History</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Fee Type</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell>Payment Method</TableCell>
                                        <TableCell>Transaction ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paymentsList && paymentsList.length > 0 ? (
                                        paymentsList.map((payment) => (
                                            <TableRow key={payment._id}>
                                                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                                <TableCell>{payment.feeStructure?.feeType}</TableCell>
                                                <TableCell align="right">₹{payment.amountPaid}</TableCell>
                                                <TableCell>{payment.paymentMethod}</TableCell>
                                                <TableCell>{payment.transactionId || '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">No payment records found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </>
            )}
        </Box>
    );
};

export default StudentFeeDetails;
