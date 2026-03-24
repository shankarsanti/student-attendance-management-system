import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Paper, Box, IconButton, Typography, Tab, Tabs } from '@mui/material';
import { getAllFeeStructures, getAllPayments, getFeeDefaulters } from '../../../redux/feeRelated/feeHandle';
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';

const ShowFees = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { feeStructuresList, paymentsList, feeDefaulters, loading } = useSelector((state) => state.fee);

    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        dispatch(getAllFeeStructures(currentUser._id));
        dispatch(getAllPayments(currentUser._id));
        dispatch(getFeeDefaulters(currentUser._id));
    }, [currentUser._id, dispatch]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const feeStructureColumns = [
        { id: 'feeName', label: 'Fee Name', minWidth: 150 },
        { id: 'feeType', label: 'Type', minWidth: 120 },
        { id: 'amount', label: 'Amount', minWidth: 100 },
        { id: 'class', label: 'Class', minWidth: 100 },
        { id: 'frequency', label: 'Frequency', minWidth: 120 },
    ];

    const feeStructureRows = feeStructuresList && feeStructuresList.length > 0 && feeStructuresList.map((fee) => {
        return {
            feeName: fee.feeName,
            feeType: fee.feeType,
            amount: `₹${fee.amount}`,
            class: fee.class ? fee.class.sclassName : 'All Classes',
            frequency: fee.frequency,
            id: fee._id,
        };
    });

    const paymentColumns = [
        { id: 'student', label: 'Student', minWidth: 150 },
        { id: 'rollNum', label: 'Roll No', minWidth: 80 },
        { id: 'feeType', label: 'Fee Type', minWidth: 120 },
        { id: 'amount', label: 'Amount Paid', minWidth: 100 },
        { id: 'paymentDate', label: 'Payment Date', minWidth: 120 },
        { id: 'paymentMethod', label: 'Method', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];

    const paymentRows = paymentsList && paymentsList.length > 0 && paymentsList.map((payment) => {
        return {
            student: payment.student?.name || 'N/A',
            rollNum: payment.student?.rollNum || 'N/A',
            feeType: payment.feeStructure?.feeType || 'N/A',
            amount: `₹${payment.amountPaid}`,
            paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
            paymentMethod: payment.paymentMethod,
            status: payment.status,
            id: payment._id,
        };
    });

    const defaulterColumns = [
        { id: 'name', label: 'Student Name', minWidth: 150 },
        { id: 'rollNum', label: 'Roll No', minWidth: 80 },
        { id: 'class', label: 'Class', minWidth: 100 },
        { id: 'totalDue', label: 'Total Due', minWidth: 100 },
        { id: 'pendingFees', label: 'Pending Fees', minWidth: 200 },
    ];

    const defaulterRows = feeDefaulters && feeDefaulters.length > 0 && feeDefaulters.map((defaulter) => {
        const pendingFeesText = defaulter.pendingFees.map(f => `${f.feeType}: ₹${f.pending}`).join(', ');
        return {
            name: defaulter.student.name,
            rollNum: defaulter.student.rollNum,
            class: defaulter.student.class,
            totalDue: `₹${defaulter.totalDue}`,
            pendingFees: pendingFeesText,
            id: defaulter.student._id,
        };
    });

    const PaymentButtonHaver = ({ row }) => {
        return (
            <IconButton onClick={() => navigate(`/Admin/fees/payment/${row.id}`)}>
                <PostAddIcon color="primary" />
            </IconButton>
        );
    };

    const FeeStructureButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => navigate(`/Admin/fees/structure/${row.id}`)}>
                    <PostAddIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => deleteHandler(row.id, "FeeStructure")}>
                    <DeleteIcon color="error" />
                </IconButton>
            </>
        );
    };

    const DefaulterButtonHaver = ({ row }) => {
        return (
            <BlueButton
                variant="contained"
                onClick={() => navigate(`/Admin/students/student/${row.id}`)}
            >
                View Details
            </BlueButton>
        );
    };

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
    };

    const actions = [
        {
            icon: <AddIcon color="primary" />, name: 'Add Fee Structure',
            action: () => navigate("/Admin/fees/addstructure")
        },
        {
            icon: <PostAddIcon color="success" />, name: 'Record Payment',
            action: () => navigate("/Admin/fees/recordpayment")
        },
    ];

    return (
        <>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Fee Structures" />
                    <Tab label="Payment History" />
                    <Tab label="Fee Defaulters" />
                </Tabs>

                {tabValue === 0 && (
                    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <>
                                {Array.isArray(feeStructuresList) && feeStructuresList.length > 0 &&
                                    <TableTemplate buttonHaver={FeeStructureButtonHaver} columns={feeStructureColumns} rows={feeStructureRows} />
                                }
                                {(!feeStructuresList || feeStructuresList.length === 0) &&
                                    <Box sx={{ padding: 3, textAlign: 'center' }}>
                                        <Typography>No fee structures found</Typography>
                                        <GreenButton variant="contained" onClick={() => navigate("/Admin/fees/addstructure")}>
                                            Add Fee Structure
                                        </GreenButton>
                                    </Box>
                                }
                            </>
                        )}
                    </Paper>
                )}

                {tabValue === 1 && (
                    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <>
                                {Array.isArray(paymentsList) && paymentsList.length > 0 &&
                                    <TableTemplate buttonHaver={PaymentButtonHaver} columns={paymentColumns} rows={paymentRows} />
                                }
                                {(!paymentsList || paymentsList.length === 0) &&
                                    <Box sx={{ padding: 3, textAlign: 'center' }}>
                                        <Typography>No payment records found</Typography>
                                    </Box>
                                }
                            </>
                        )}
                    </Paper>
                )}

                {tabValue === 2 && (
                    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <>
                                {Array.isArray(feeDefaulters) && feeDefaulters.length > 0 &&
                                    <TableTemplate buttonHaver={DefaulterButtonHaver} columns={defaulterColumns} rows={defaulterRows} />
                                }
                                {(!feeDefaulters || feeDefaulters.length === 0) &&
                                    <Box sx={{ padding: 3, textAlign: 'center' }}>
                                        <Typography>No fee defaulters found. All students are up to date!</Typography>
                                    </Box>
                                }
                            </>
                        )}
                    </Paper>
                )}
            </Box>
            <SpeedDialTemplate actions={actions} />
        </>
    );
};

export default ShowFees;
