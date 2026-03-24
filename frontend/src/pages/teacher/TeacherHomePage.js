import { Container, Grid, Paper, Typography, Box, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import styled from 'styled-components';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherHomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

    const [testsTaken, setTestsTaken] = useState(0);
    const [totalLessons, setTotalLessons] = useState(0);
    const [todayLessonsCount, setTodayLessonsCount] = useState(0);

    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
        fetchTestsCount();
        fetchLessonsCount();
        fetchTodayLessonsCount();
    }, [dispatch, subjectID, classID]);

    const fetchTestsCount = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/TestsByTeacher/${currentUser._id}`);
            if (!response.data.message) {
                setTestsTaken(response.data.length);
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    const fetchLessonsCount = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/LessonsByTeacher/${currentUser._id}`);
            if (!response.data.message) {
                setTotalLessons(response.data.length);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const fetchTodayLessonsCount = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/TodayLessons/${currentUser._id}`);
            if (!response.data.message) {
                setTodayLessonsCount(response.data.length);
            }
        } catch (error) {
            console.error('Error fetching today lessons:', error);
        }
    };

    const numberOfStudents = sclassStudents && sclassStudents.length;
    const numberOfSessions = subjectDetails && subjectDetails.sessions ? parseInt(subjectDetails.sessions) : 0;

    // Calculate total hours (assuming each session is 1 hour)
    const totalHours = numberOfSessions * 1;

    // Mock growth data (in real app, calculate from historical data)
    const weeklyLessonsGrowth = 10;
    const monthlyTestsGrowth = 5;
    const weeklyHoursGrowth = 20;

    const statsData = [
        {
            title: 'Total Lessons',
            value: totalLessons,
            icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            bgColor: '#e3f2fd',
            growth: `${todayLessonsCount} scheduled today`,
            suffix: '',
            link: '/Teacher/lessons'
        },
        {
            title: 'Tests Taken',
            value: testsTaken,
            icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
            color: '#2e7d32',
            bgColor: '#e8f5e9',
            growth: `+${monthlyTestsGrowth} this month`,
            suffix: '',
            link: '/Teacher/tests'
        },
        {
            title: 'Total Hours',
            value: totalHours,
            icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            bgColor: '#fff3e0',
            growth: `+${weeklyHoursGrowth} hrs this week`,
            suffix: ' hrs',
            link: '/Teacher/class'
        },
        {
            title: 'Class Students',
            value: numberOfStudents,
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            color: '#9c27b0',
            bgColor: '#f3e5f5',
            growth: 'Active students',
            suffix: '',
            link: '/Teacher/class'
        }
    ];

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                    Teacher Dashboard
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
                                                <CountUp 
                                                    start={0} 
                                                    end={stat.value} 
                                                    duration={2.5} 
                                                    suffix={stat.suffix}
                                                />
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

export default TeacherHomePage