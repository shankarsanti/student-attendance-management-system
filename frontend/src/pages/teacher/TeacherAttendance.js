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
    TextField,
    MenuItem,
    Grid,
    Chip,
    CircularProgress,
    InputAdornment,
    Card,
    CardContent
} from '@mui/material';
import { Search, CalendarToday, CheckCircle, Cancel, TrendingUp } from '@mui/icons-material';
import axios from 'axios';
import Popup from '../../components/Popup';

const TeacherAttendance = () => {
    const { currentUser } = useSelector(state => state.user);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('today');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [students, searchQuery, filterType, startDate, endDate, selectedMonth, selectedYear]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/Sclass/Students/${currentUser.teachSclass._id}`
            );
            if (!response.data.message) {
                setStudents(response.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
        setLoading(false);
    };

    const filterStudents = () => {
        let filtered = [...students];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.map(student => {
                const matchesSearch = 
                    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.rollNum.toString().includes(searchQuery);
                
                return { ...student, matchesSearch };
            }).filter(s => s.matchesSearch);
        }

        // Calculate attendance based on filter type
        filtered = filtered.map(student => {
            const attendanceData = calculateAttendance(student, filterType);
            return { ...student, ...attendanceData };
        });

        setFilteredStudents(filtered);
    };

    const calculateAttendance = (student, type) => {
        if (!student.attendance || student.attendance.length === 0) {
            return { present: 0, absent: 0, total: 0, percentage: 0 };
        }

        let relevantAttendance = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (type) {
            case 'today':
                relevantAttendance = student.attendance.filter(att => {
                    const attDate = new Date(att.date);
                    attDate.setHours(0, 0, 0, 0);
                    return attDate.getTime() === today.getTime();
                });
                break;
            
            case 'monthly':
                relevantAttendance = student.attendance.filter(att => {
                    const attDate = new Date(att.date);
                    return attDate.getMonth() === selectedMonth && 
                           attDate.getFullYear() === selectedYear;
                });
                break;
            
            case 'dateRange':
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    relevantAttendance = student.attendance.filter(att => {
                        const attDate = new Date(att.date);
                        return attDate >= start && attDate <= end;
                    });
                }
                break;
            
            case 'all':
            default:
                relevantAttendance = student.attendance;
                break;
        }

        const present = relevantAttendance.filter(att => att.status === 'Present').length;
        const absent = relevantAttendance.filter(att => att.status === 'Absent').length;
        const total = relevantAttendance.length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

        return { present, absent, total, percentage };
    };

    const getOverallStats = () => {
        const totalPresent = filteredStudents.reduce((sum, s) => sum + s.present, 0);
        const totalAbsent = filteredStudents.reduce((sum, s) => sum + s.absent, 0);
        const totalRecords = totalPresent + totalAbsent;
        const avgPercentage = totalRecords > 0 
            ? ((totalPresent / totalRecords) * 100).toFixed(2) 
            : 0;

        return { totalPresent, totalAbsent, totalRecords, avgPercentage };
    };

    const stats = getOverallStats();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    const getAttendanceColor = (percentage) => {
        if (percentage >= 75) return 'success';
        if (percentage >= 50) return 'warning';
        return 'error';
    };

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
                Student Attendance Report
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Students
                                    </Typography>
                                    <Typography variant="h4">
                                        {filteredStudents.length}
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 40, color: '#1976d2' }} />
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
                                        Total Present
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.totalPresent}
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
                                        Total Absent
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.totalAbsent}
                                    </Typography>
                                </Box>
                                <Cancel sx={{ fontSize: 40, color: '#d32f2f' }} />
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
                                        Average Attendance
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.avgPercentage}%
                                    </Typography>
                                </Box>
                                <CalendarToday sx={{ fontSize: 40, color: '#ed6c02' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search by name or roll number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Filter By"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <MenuItem value="today">Today</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="dateRange">Date Range</MenuItem>
                            <MenuItem value="all">All Time</MenuItem>
                        </TextField>
                    </Grid>

                    {filterType === 'monthly' && (
                        <>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </>
                    )}

                    {filterType === 'dateRange' && (
                        <>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="End Date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </Paper>

            {/* Attendance Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Roll No</TableCell>
                            <TableCell>Student Name</TableCell>
                            <TableCell align="center">Present</TableCell>
                            <TableCell align="center">Absent</TableCell>
                            <TableCell align="center">Total Days</TableCell>
                            <TableCell align="center">Attendance %</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography color="textSecondary">
                                        No students found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student._id}>
                                    <TableCell>{student.rollNum}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={student.present} 
                                            color="success" 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={student.absent} 
                                            color="error" 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell align="center">{student.total}</TableCell>
                                    <TableCell align="center">
                                        <Typography 
                                            variant="h6" 
                                            color={
                                                student.percentage >= 75 ? 'success.main' : 
                                                student.percentage >= 50 ? 'warning.main' : 
                                                'error.main'
                                            }
                                        >
                                            {student.percentage}%
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={
                                                student.percentage >= 75 ? 'Good' : 
                                                student.percentage >= 50 ? 'Average' : 
                                                'Poor'
                                            }
                                            color={getAttendanceColor(student.percentage)}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default TeacherAttendance;
