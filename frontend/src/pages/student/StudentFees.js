import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Divider
} from '@mui/material';
import {
    Payment,
    AccountBalance,
    CheckCircle,
    Warning,
    Receipt,
    CalendarToday
} from '@mui/icons-material';
import axios from 'axios';
import Popup from '../../components/Popup';
import jsPDF from 'jspdf';

const StudentFees = () => {
    const { currentUser } = useSelector(state => state.user);
    const [feeStatus, setFeeStatus] = useState(null);
    const [payments, setPayments] = useState([]);
    const [paymentSettings, setPaymentSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [transactionId, setTransactionId] = useState('');
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        fetchFeeStatus();
        fetchPaymentHistory();
        fetchPaymentSettings();
    }, []);

    const fetchPaymentSettings = async () => {
        try {
            // Handle both populated and non-populated school field
            const schoolId = currentUser.school?._id || currentUser.school;
            if (!schoolId) {
                console.error('School ID not found in currentUser:', currentUser);
                return;
            }
            console.log('Fetching payment settings for school:', schoolId);
            console.log('Current user:', currentUser);
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/PaymentSettings/${schoolId}`
            );
            console.log('Payment settings received:', response.data);
            console.log('Payment settings details:', {
                upiId: response.data.upiId,
                phonePeEnabled: response.data.phonePeEnabled,
                phonePeNumber: response.data.phonePeNumber,
                paytmEnabled: response.data.paytmEnabled,
                paytmNumber: response.data.paytmNumber,
                hasQrCode: !!response.data.qrCodeImage,
                hasBankDetails: !!response.data.bankDetails
            });
            setPaymentSettings(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching payment settings:', error);
            console.error('Error details:', error.response?.data);
        }
    };

    const fetchFeeStatus = async () => {
        try {
            console.log('Fetching fee status for student:', currentUser._id);
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/StudentFeeStatus/${currentUser._id}`
            );
            console.log('Fee status response:', response.data);
            
            if (response.data.message) {
                console.log('No fee structure:', response.data.message);
                setFeeStatus(null);
                setLoading(false);
                return;
            }
            
            // Backend returns an array of fee structures
            if (Array.isArray(response.data) && response.data.length > 0) {
                console.log('Fee structures found:', response.data.length);
                
                // Aggregate all fees
                const totalFee = response.data.reduce((sum, fee) => sum + (fee.feeStructure?.amount || fee.totalAmount || 0), 0);
                const totalPaid = response.data.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
                const totalPending = totalFee - totalPaid;
                
                // Create aggregated fee status
                const aggregatedStatus = {
                    feeStructures: response.data, // Store all fee structures
                    feeStructure: response.data[0].feeStructure, // Keep first for compatibility
                    totalAmount: totalFee,
                    paidAmount: totalPaid,
                    pendingAmount: totalPending,
                    status: totalPending === 0 ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Pending'
                };
                
                console.log('Aggregated fee status:', aggregatedStatus);
                setFeeStatus(aggregatedStatus);
            } else {
                console.log('Empty fee structure array');
                setFeeStatus(null);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching fee status:', error);
            console.error('Error response:', error.response?.data);
            setLoading(false);
        }
    };

    const fetchPaymentHistory = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/StudentPayments/${currentUser._id}`
            );
            if (!response.data.message) {
                setPayments(response.data);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
        setLoading(false);
    };

    const handlePayment = async () => {
        if (!paymentAmount || paymentAmount <= 0) {
            setMessage('Please enter a valid amount');
            setShowPopup(true);
            return;
        }

        if (!transactionId) {
            setMessage('Please enter transaction ID');
            setShowPopup(true);
            return;
        }

        try {
            // Get the fee structure ID from feeStatus
            const feeStructureId = feeStatus?.feeStructure?._id;
            if (!feeStructureId) {
                setMessage('Fee structure not found. Please contact administrator.');
                setShowPopup(true);
                return;
            }

            const schoolId = currentUser.school?._id || currentUser.school;
            if (!schoolId) {
                setMessage('School information not found. Please contact administrator.');
                setShowPopup(true);
                return;
            }

            const paymentData = {
                student: currentUser._id,
                feeStructure: feeStructureId,
                amountPaid: Number(paymentAmount),
                paymentMethod,
                transactionId: transactionId,
                paymentDate: new Date(),
                school: schoolId
            };

            console.log('Submitting payment with data:', paymentData);

            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/FeePaymentCreate`, 
                paymentData
            );
            
            console.log('Payment response:', response.data);
            setMessage('Payment recorded successfully!');
            setShowPopup(true);
            setOpenPaymentDialog(false);
            setPaymentAmount('');
            setTransactionId('');
            fetchFeeStatus();
            fetchPaymentHistory();
        } catch (error) {
            console.error('Payment error:', error);
            console.error('Error response:', error.response?.data);
            setMessage(error.response?.data?.message || 'Error recording payment');
            setShowPopup(true);
        }
    };

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

    const downloadReceipt = (payment) => {
        try {
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('PAYMENT RECEIPT', 105, 20, { align: 'center' });
            
            // School Info
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('School Management System', 105, 30, { align: 'center' });
            
            // Receipt Number
            doc.setFontSize(10);
            doc.text(`Receipt No: ${payment._id}`, 20, 45);
            doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, 20, 52);
            
            // Divider
            doc.setLineWidth(0.5);
            doc.line(20, 58, 190, 58);
            
            // Student Info
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Student Information', 20, 68);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(`Name: ${currentUser.name}`, 20, 76);
            doc.text(`Roll Number: ${currentUser.rollNum}`, 20, 83);
            doc.text(`Class: ${currentUser.sclassName?.sclassName || 'N/A'}`, 20, 90);
            
            // Payment Details
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Payment Details', 20, 105);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(`Amount Paid: ₹${payment.amountPaid || payment.amount || 0}`, 20, 113);
            doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 120);
            doc.text(`Transaction ID: ${payment.transactionId || 'N/A'}`, 20, 127);
            doc.text(`Payment Date: ${new Date(payment.paymentDate).toLocaleString()}`, 20, 134);
            
            // Fee Structure Info (if available)
            if (payment.feeStructure) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Fee Information', 20, 149);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text(`Fee Name: ${payment.feeStructure.feeName || 'N/A'}`, 20, 157);
                doc.text(`Fee Type: ${payment.feeStructure.feeType || 'N/A'}`, 20, 164);
            }
            
            // Amount in Words (simple implementation)
            const amountInWords = numberToWords(payment.amountPaid || payment.amount || 0);
            doc.setFontSize(10);
            doc.text(`Amount in Words: ${amountInWords} Rupees Only`, 20, 180);
            
            // Footer
            doc.setLineWidth(0.5);
            doc.line(20, 190, 190, 190);
            doc.setFontSize(8);
            doc.text('This is a computer-generated receipt and does not require a signature.', 105, 197, { align: 'center' });
            doc.text('For any queries, please contact the school office.', 105, 203, { align: 'center' });
            
            // Stamp/Seal area
            doc.setFontSize(10);
            doc.text('Authorized Signature', 150, 175);
            doc.rect(145, 155, 40, 20); // Box for signature
            
            // Save PDF
            doc.save(`Receipt_${payment._id}_${new Date().getTime()}.pdf`);
            
            setMessage('Receipt downloaded successfully!');
            setShowPopup(true);
        } catch (error) {
            console.error('Error generating receipt:', error);
            setMessage('Error generating receipt. Please try again.');
            setShowPopup(true);
        }
    };

    // Helper function to convert number to words (simplified)
    const numberToWords = (num) => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        
        if (num === 0) return 'Zero';
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
        if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
        if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
        if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
        return num.toString();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const totalFee = feeStatus?.totalAmount || 0;
    const paidAmount = feeStatus?.paidAmount || 0;
    const pendingAmount = feeStatus?.pendingAmount || 0;
    const paymentStatus = feeStatus?.status || (pendingAmount === 0 && totalFee > 0 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Pending');

    console.log('Fee calculation:', {
        totalFee,
        paidAmount,
        pendingAmount,
        paymentStatus,
        feeStatus
    });

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h4">
                    Fee Payment
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setLoading(true);
                            fetchFeeStatus();
                            fetchPaymentHistory();
                            fetchPaymentSettings();
                        }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Fee Summary Cards */}
            <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Fee
                                    </Typography>
                                    <Typography variant="h4">
                                        ₹{totalFee}
                                    </Typography>
                                </Box>
                                <AccountBalance sx={{ fontSize: 40, color: '#1976d2' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Paid Amount
                                    </Typography>
                                    <Typography variant="h4" color="success.main">
                                        ₹{paidAmount}
                                    </Typography>
                                </Box>
                                <CheckCircle sx={{ fontSize: 40, color: '#2e7d32' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Pending Amount
                                    </Typography>
                                    <Typography variant="h4" color="error.main">
                                        ₹{pendingAmount}
                                    </Typography>
                                </Box>
                                <Warning sx={{ fontSize: 40, color: '#d32f2f' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Payment Status
                                    </Typography>
                                    <Chip 
                                        label={paymentStatus} 
                                        color={getStatusColor(paymentStatus)}
                                        sx={{ marginTop: 1 }}
                                    />
                                </Box>
                                <Payment sx={{ fontSize: 40, color: '#ed6c02' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Fee Structures */}
            {feeStatus?.feeStructures && feeStatus.feeStructures.length > 0 ? (
                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Fee Structures ({feeStatus.feeStructures.length})
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    
                    {feeStatus.feeStructures.map((feeItem, index) => (
                        <Box key={index} sx={{ marginBottom: 3, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                        {feeItem.feeStructure.feeName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Fee Type:</strong> {feeItem.feeStructure.feeType}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Class:</strong> {feeItem.feeStructure.class?.sclassName || 'All Classes'}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Frequency:</strong> {feeItem.feeStructure.frequency}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Amount:</strong> ₹{feeItem.feeStructure.amount}</Typography>
                                </Grid>
                                {feeItem.feeStructure.dueDate && (
                                    <Grid item xs={12} md={6}>
                                        <Typography><strong>Due Date:</strong> {new Date(feeItem.feeStructure.dueDate).toLocaleDateString()}</Typography>
                                    </Grid>
                                )}
                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <strong>Paid:</strong> ₹{feeItem.paidAmount} | 
                                        <strong> Pending:</strong> ₹{feeItem.pendingAmount}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Chip 
                                        label={feeItem.status} 
                                        color={getStatusColor(feeItem.status)}
                                        size="small"
                                    />
                                </Grid>
                                {feeItem.feeStructure.description && (
                                    <Grid item xs={12}>
                                        <Typography><strong>Description:</strong> {feeItem.feeStructure.description}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    ))}
                    
                    <Divider sx={{ marginY: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary">
                                <strong>Grand Total:</strong> ₹{totalFee} | 
                                <strong> Total Paid:</strong> ₹{paidAmount} | 
                                <strong> Total Pending:</strong> ₹{pendingAmount}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<Payment />}
                            onClick={() => {
                                setPaymentAmount(pendingAmount.toString());
                                // Re-fetch payment settings to get latest updates
                                fetchPaymentSettings();
                                setOpenPaymentDialog(true);
                            }}
                            disabled={pendingAmount <= 0}
                        >
                            {pendingAmount > 0 ? 'Make Payment' : 'Fully Paid'}
                        </Button>
                        {pendingAmount <= 0 && (
                            <Typography variant="body2" color="success.main" sx={{ marginTop: 1 }}>
                                All fees have been paid. Thank you!
                            </Typography>
                        )}
                    </Box>
                </Paper>
            ) : (
                <Paper sx={{ padding: 3, marginBottom: 3, textAlign: 'center', backgroundColor: '#fff3cd' }}>
                    <Typography variant="h6" gutterBottom>
                        No Fee Structure Found
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        The administrator has not set up a fee structure for your class yet. Please contact the school office.
                    </Typography>
                </Paper>
            )}

            {/* Payment History */}
            <Paper sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Payment History
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                {payments.length === 0 ? (
                    <Typography color="textSecondary" align="center" sx={{ padding: 3 }}>
                        No payment history available
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell>Transaction ID</TableCell>
                                    <TableCell>Receipt</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell>
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={`₹${payment.amountPaid || payment.amount || 0}`} 
                                                color="success" 
                                                size="small" 
                                            />
                                        </TableCell>
                                        <TableCell>{payment.paymentMethod}</TableCell>
                                        <TableCell>{payment.transactionId || '-'}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<Receipt />}
                                                onClick={() => downloadReceipt(payment)}
                                            >
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Payment Dialog */}
            <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Make Payment</DialogTitle>
                <DialogContent>
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Pending Amount: ₹{pendingAmount}
                        </Typography>
                        <TextField
                            fullWidth
                            label="Payment Amount"
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            margin="normal"
                            inputProps={{ min: 0, max: pendingAmount }}
                        />
                        
                        {/* Payment Methods */}
                        {paymentSettings ? (
                            <Box sx={{ marginTop: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Select Payment Method
                                </Typography>
                                <Divider sx={{ marginBottom: 2 }} />
                                
                                {/* Debug info - remove after testing */}
                                {process.env.NODE_ENV === 'development' && (
                                    <Box sx={{ padding: 2, backgroundColor: '#f0f0f0', marginBottom: 2, fontSize: '12px' }}>
                                        <Typography variant="caption">Debug Info:</Typography>
                                        <pre>{JSON.stringify({
                                            hasUpiId: !!paymentSettings.upiId,
                                            upiId: paymentSettings.upiId,
                                            phonePeEnabled: paymentSettings.phonePeEnabled,
                                            phonePeNumber: paymentSettings.phonePeNumber,
                                            paytmEnabled: paymentSettings.paytmEnabled,
                                            paytmNumber: paymentSettings.paytmNumber,
                                            hasQrCode: !!paymentSettings.qrCodeImage,
                                            hasBankDetails: !!paymentSettings.bankDetails?.accountNumber
                                        }, null, 2)}</pre>
                                    </Box>
                                )}
                                
                                <Grid container spacing={2}>
                                    {/* Check if any payment method is available */}
                                    {!paymentSettings.upiId && 
                                     !paymentSettings.phonePeEnabled && 
                                     !paymentSettings.paytmEnabled && 
                                     !paymentSettings.qrCodeImage && 
                                     !paymentSettings.bankDetails?.accountNumber ? (
                                        <Grid item xs={12}>
                                            <Paper sx={{ padding: 3, textAlign: 'center', backgroundColor: '#fff3cd' }}>
                                                <Typography variant="body1" color="textSecondary">
                                                    No payment methods configured yet. Please contact the administrator.
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ) : (
                                        <>
                                            {/* UPI Payment */}
                                            {paymentSettings.upiId && (
                                                <Grid item xs={12}>
                                                    <Paper 
                                                        sx={{ 
                                                            padding: 2, 
                                                            cursor: 'pointer',
                                                            border: paymentMethod === 'UPI' ? '2px solid #1976d2' : '1px solid #ddd'
                                                        }}
                                                        onClick={() => setPaymentMethod('UPI')}
                                                    >
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            UPI Payment
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            UPI ID: {paymentSettings.upiId}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )}

                                            {/* PhonePe */}
                                            {paymentSettings.phonePeEnabled && paymentSettings.phonePeNumber && (
                                                <Grid item xs={12} md={6}>
                                                    <Paper 
                                                        sx={{ 
                                                            padding: 2, 
                                                            cursor: 'pointer',
                                                            border: paymentMethod === 'PhonePe' ? '2px solid #5f259f' : '1px solid #ddd'
                                                        }}
                                                        onClick={() => setPaymentMethod('PhonePe')}
                                                    >
                                                        <Typography variant="subtitle1" fontWeight="bold" color="#5f259f">
                                                            PhonePe
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Number: {paymentSettings.phonePeNumber}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )}

                                            {/* Paytm */}
                                            {paymentSettings.paytmEnabled && paymentSettings.paytmNumber && (
                                                <Grid item xs={12} md={6}>
                                                    <Paper 
                                                        sx={{ 
                                                            padding: 2, 
                                                            cursor: 'pointer',
                                                            border: paymentMethod === 'Paytm' ? '2px solid #00baf2' : '1px solid #ddd'
                                                        }}
                                                        onClick={() => setPaymentMethod('Paytm')}
                                                    >
                                                        <Typography variant="subtitle1" fontWeight="bold" color="#00baf2">
                                                            Paytm
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Number: {paymentSettings.paytmNumber}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )}

                                            {/* QR Code */}
                                            {paymentSettings.qrCodeImage && (
                                                <Grid item xs={12}>
                                                    <Paper sx={{ padding: 2, textAlign: 'center' }}>
                                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                            Scan QR Code to Pay
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                                            <img 
                                                                src={paymentSettings.qrCodeImage} 
                                                                alt="Payment QR Code" 
                                                                style={{ maxWidth: '250px', maxHeight: '250px', border: '2px solid #ddd', borderRadius: '8px' }}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            )}

                                            {/* Bank Transfer */}
                                            {paymentSettings.bankDetails?.accountNumber && (
                                                <Grid item xs={12}>
                                                    <Paper 
                                                        sx={{ 
                                                            padding: 2, 
                                                            cursor: 'pointer',
                                                            border: paymentMethod === 'Bank Transfer' ? '2px solid #1976d2' : '1px solid #ddd'
                                                        }}
                                                        onClick={() => setPaymentMethod('Bank Transfer')}
                                                    >
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            Bank Transfer
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Account: {paymentSettings.bankDetails.accountName}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            A/C No: {paymentSettings.bankDetails.accountNumber}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            IFSC: {paymentSettings.bankDetails.ifscCode}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Bank: {paymentSettings.bankDetails.bankName}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )}
                                        </>
                                    )}
                                </Grid>

                                {/* Instructions */}
                                {paymentSettings.instructions && (
                                    <Box sx={{ marginTop: 3, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Payment Instructions:
                                        </Typography>
                                        <Typography variant="body2">
                                            {paymentSettings.instructions}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Transaction ID */}
                                <TextField
                                    fullWidth
                                    label="Transaction ID / Reference Number"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    margin="normal"
                                    required
                                    helperText="Enter the transaction ID after making the payment"
                                />
                            </Box>
                        ) : (
                            <Box sx={{ marginTop: 3, padding: 3, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="body1" color="textSecondary">
                                    Loading payment methods...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
                    <Button onClick={handlePayment} variant="contained" color="primary">
                        Submit Payment
                    </Button>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default StudentFees;
