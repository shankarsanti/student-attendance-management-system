import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    CircularProgress,
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import { Assignment, CalendarToday, Schedule, TrendingUp } from '@mui/icons-material';
import axios from 'axios';

const StudentTests = () => {
    const { currentUser } = useSelector(state => state.user);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/TestsByClass/${currentUser.sclassName._id}`);
            if (!response.data.message) {
                setTests(response.data);
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
        setLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'primary';
            case 'Completed':
                return 'success';
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getMyResult = (test) => {
        return test.results?.find(r => r.student === currentUser._id);
    };

    const upcomingTests = tests.filter(test => {
        const testDate = new Date(test.date);
        const today = new Date();
        return testDate >= today && test.status === 'Scheduled';
    });

    const completedTests = tests.filter(test => test.status === 'Completed');

    const todayTests = tests.filter(test => {
        const testDate = new Date(test.date);
        const today = new Date();
        return testDate.toDateString() === today.toDateString();
    });

    const renderTestTable = (testList, showResults = false) => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Total Marks</TableCell>
                        <TableCell>Duration</TableCell>
                        {showResults && <TableCell>My Marks</TableCell>}
                        {showResults && <TableCell>Percentage</TableCell>}
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={showResults ? 9 : 7} align="center">
                                <Typography color="textSecondary">No tests found</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        testList.map((test) => {
                            const myResult = getMyResult(test);
                            const percentage = myResult ? ((myResult.marksObtained / test.totalMarks) * 100).toFixed(2) : null;
                            
                            return (
                                <TableRow key={test._id}>
                                    <TableCell>{test.title}</TableCell>
                                    <TableCell>{test.subject?.subName}</TableCell>
                                    <TableCell>{test.type}</TableCell>
                                    <TableCell>
                                        {new Date(test.date).toLocaleDateString()}<br />
                                        {new Date(test.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell>{test.totalMarks}</TableCell>
                                    <TableCell>{test.duration} min</TableCell>
                                    {showResults && (
                                        <TableCell>
                                            {myResult ? `${myResult.marksObtained} / ${test.totalMarks}` : '-'}
                                        </TableCell>
                                    )}
                                    {showResults && (
                                        <TableCell>
                                            {percentage ? (
                                                <Chip 
                                                    label={`${percentage}%`}
                                                    color={percentage >= 60 ? 'success' : percentage >= 40 ? 'warning' : 'error'}
                                                    size="small"
                                                />
                                            ) : '-'}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Chip label={test.status} color={getStatusColor(test.status)} size="small" />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Tests & Exams
            </Typography>

            <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(0)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Today's Tests
                                    </Typography>
                                    <Typography variant="h4">
                                        {todayTests.length}
                                    </Typography>
                                </Box>
                                <CalendarToday sx={{ fontSize: 40, color: '#1976d2' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(1)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Upcoming Tests
                                    </Typography>
                                    <Typography variant="h4">
                                        {upcomingTests.length}
                                    </Typography>
                                </Box>
                                <Schedule sx={{ fontSize: 40, color: '#ed6c02' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(2)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Completed Tests
                                    </Typography>
                                    <Typography variant="h4">
                                        {completedTests.length}
                                    </Typography>
                                </Box>
                                <Assignment sx={{ fontSize: 40, color: '#2e7d32' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(3)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Tests
                                    </Typography>
                                    <Typography variant="h4">
                                        {tests.length}
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 40, color: '#9c27b0' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ marginBottom: 2 }}>
                <Tab label={`Today (${todayTests.length})`} />
                <Tab label={`Upcoming (${upcomingTests.length})`} />
                <Tab label={`Completed (${completedTests.length})`} />
                <Tab label={`All Tests (${tests.length})`} />
            </Tabs>

            {tabValue === 0 && renderTestTable(todayTests)}
            {tabValue === 1 && renderTestTable(upcomingTests)}
            {tabValue === 2 && renderTestTable(completedTests, true)}
            {tabValue === 3 && renderTestTable(tests, true)}
        </Box>
    );
};

export default StudentTests;
