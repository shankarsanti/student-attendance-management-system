import React, { useEffect, useState } from 'react'
import { Container, Grid, Paper, Typography, Box, Chip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [todayTests, setTodayTests] = useState(0);
    const [upcomingTests, setUpcomingTests] = useState(0);
    const [todayLessons, setTodayLessons] = useState(0);
    const [upcomingLessons, setUpcomingLessons] = useState(0);

    const classID = currentUser.sclassName._id

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
        fetchTestsData();
        fetchLessonsData();
    }, [dispatch, currentUser._id, classID]);

    const fetchTestsData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/TestsByClass/${classID}`);
            if (!response.data.message) {
                const tests = response.data;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const todayCount = tests.filter(test => {
                    const testDate = new Date(test.date);
                    testDate.setHours(0, 0, 0, 0);
                    return testDate.getTime() === today.getTime();
                }).length;
                
                const upcomingCount = tests.filter(test => {
                    const testDate = new Date(test.date);
                    return testDate >= today && test.status === 'Scheduled';
                }).length;
                
                setTodayTests(todayCount);
                setUpcomingTests(upcomingCount);
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    const fetchLessonsData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/LessonsByClass/${classID}`);
            if (!response.data.message) {
                const lessons = response.data;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const todayCount = lessons.filter(lesson => {
                    const lessonDate = new Date(lesson.date);
                    lessonDate.setHours(0, 0, 0, 0);
                    return lessonDate.getTime() === today.getTime();
                }).length;
                
                const upcomingCount = lessons.filter(lesson => {
                    const lessonDate = new Date(lesson.date);
                    return lessonDate >= today && lesson.status === 'Scheduled';
                }).length;
                
                setTodayLessons(todayCount);
                setUpcomingLessons(upcomingCount);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const numberOfSubjects = subjectsList && subjectsList.length;

    const calculateAttendancePercentage = () => {
        if (!userDetails || !userDetails.attendance || userDetails.attendance.length === 0) return 0;
        const present = userDetails.attendance.filter(att => att.status === 'Present').length;
        return ((present / userDetails.attendance.length) * 100).toFixed(1);
    };

    const overallAttendancePercentage = calculateAttendancePercentage();

    const statsData = [
        {
            title: 'Total Subjects',
            value: numberOfSubjects || 0,
            icon: <img src={Subject} alt="Subjects" style={{ width: 60, height: 60 }} />,
            color: '#1976d2',
            bgColor: '#e3f2fd',
            growth: 'Active subjects',
            link: '/Student/subjects'
        },
        {
            title: "Today's Tests",
            value: todayTests,
            icon: <AssignmentTurnedInIcon sx={{ fontSize: 60 }} />,
            color: '#d32f2f',
            bgColor: '#ffebee',
            growth: `${upcomingTests} upcoming`,
            link: '/Student/tests'
        },
        {
            title: "Today's Lessons",
            value: todayLessons,
            icon: <MenuBookIcon sx={{ fontSize: 60 }} />,
            color: '#2e7d32',
            bgColor: '#e8f5e9',
            growth: `${upcomingLessons} upcoming`,
            link: '/Student/lessons'
        },
        {
            title: 'Attendance',
            value: `${overallAttendancePercentage}%`,
            icon: <CalendarTodayIcon sx={{ fontSize: 60 }} />,
            color: '#ed6c02',
            bgColor: '#fff3e0',
            growth: 'Overall attendance',
            link: '/Student/attendance'
        }
    ];

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                    Student Dashboard
                </Typography>
                <Grid container spacing={3}>
                    {statsData.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <StyledCard onClick={() => navigate(stat.link)}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <CardTitle>{stat.title}</CardTitle>
                                            <CardValue color={stat.color}>
                                                {typeof stat.value === 'number' ? (
                                                    <CountUp start={0} end={stat.value} duration={2.5} />
                                                ) : (
                                                    stat.value
                                                )}
                                            </CardValue>
                                            <GrowthChip 
                                                icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                                                label={stat.growth}
                                                size="small"
                                            />
                                        </Box>
                                        <IconWrapper bgcolor={stat.bgColor} color={stat.color}>
                                            {stat.icon}
                                        </IconWrapper>
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                    
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

const ChartContainer = styled.div`
  padding: 2px;
  display: flex;
  flex-direction: column;
  height: 240px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const StyledCard = styled(Paper)`
  padding: 0;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`;

const CardContent = styled.div`
  padding: 24px;
`;

const CardTitle = styled(Typography)`
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 8px;
  line-height: 1;
`;

const IconWrapper = styled(Box)`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.bgcolor};
  color: ${props => props.color};
`;

const GrowthChip = styled(Chip)`
  && {
    height: 24px;
    font-size: 0.75rem;
    background-color: #e8f5e9;
    color: #2e7d32;
    font-weight: 500;
    
    .MuiChip-icon {
      color: #2e7d32;
    }
  }
`;

export default StudentHomePage