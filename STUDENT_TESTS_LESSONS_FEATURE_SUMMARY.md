# Student Tests & Lessons View Feature

## Overview
Added comprehensive features for students to view upcoming tests/exams and lesson schedules created by their teachers. Students can now see what topics will be taught, when tests are scheduled, and prepare accordingly.

## Features Added

### 1. Student Tests View (`StudentTests.js`)

**Location**: `frontend/src/pages/student/StudentTests.js`

**Features**:
- View all tests scheduled for their class
- Four organized tabs:
  - **Today**: Tests scheduled for today
  - **Upcoming**: Future scheduled tests
  - **Completed**: Past tests with results
  - **All Tests**: Complete test history

**Information Displayed**:
- Test title and description
- Subject name
- Test type (Quiz, Mid-term, Final, Assignment, Other)
- Date and time of test
- Total marks
- Duration in minutes
- Test status (Scheduled/Completed/Cancelled)
- **For completed tests**: Student's marks and percentage
- Color-coded performance indicators (Green: ≥60%, Yellow: 40-59%, Red: <40%)

**Statistics Cards**:
- Today's tests count
- Upcoming tests count
- Completed tests count
- Total tests count

**Benefits for Students**:
- Know when tests are scheduled
- Prepare in advance
- See test duration to manage time
- View their results and performance
- Track academic progress

### 2. Student Lessons View (`StudentLessons.js`)

**Location**: `frontend/src/pages/student/StudentLessons.js`

**Features**:
- View all lessons scheduled by teachers
- Four organized tabs:
  - **Today**: Today's lessons
  - **Upcoming**: Future scheduled lessons
  - **Completed**: Past completed lessons
  - **All Lessons**: Complete lesson history

**Information Displayed for Each Lesson**:
- Lesson title and topic
- Subject name
- Date and time (start and end)
- Duration
- Teacher name
- Chapter and lesson number
- **Learning Objectives**: What students will learn
- **Materials Needed**: What to bring to class
- **Homework**: Assignments given
- Lesson description
- Status (Scheduled/In Progress/Completed/Cancelled)

**Expandable Lesson Cards**:
- Click to expand and see full details
- Organized, easy-to-read layout
- Color-coded status indicators

**Statistics Cards**:
- Today's lessons count
- Upcoming lessons count
- Completed lessons count
- Total lessons count

**Benefits for Students**:
- Know what topics will be taught and when
- Prepare for lessons in advance
- Bring required materials
- Understand learning objectives
- Complete homework on time
- Review completed lessons

## Frontend Changes

### Updated Components

#### `StudentDashboard.js`
- Added routes:
  - `/Student/tests` - View tests and exams
  - `/Student/lessons` - View lesson schedule
- Imported new components

#### `StudentSideBar.js`
- Added two new menu items:
  - **Tests & Exams**: Navigate to tests page
  - **Lessons Schedule**: Navigate to lessons page
- Added icons for better visual identification
- Active state highlighting

## User Experience

### For Students Viewing Tests:

1. **Navigate to "Tests & Exams"** from sidebar
2. **See statistics** at the top showing test counts
3. **Switch between tabs**:
   - Check today's tests
   - View upcoming tests to prepare
   - See completed tests with results
4. **View test details** in organized table format
5. **Track performance** with color-coded percentages

### For Students Viewing Lessons:

1. **Navigate to "Lessons Schedule"** from sidebar
2. **See statistics** showing lesson counts
3. **Switch between tabs**:
   - Check today's schedule
   - View upcoming lessons
   - Review completed lessons
4. **Click on any lesson** to expand and see:
   - What will be taught (objectives)
   - What to bring (materials)
   - Homework assignments
   - Chapter and lesson details
5. **Prepare accordingly** for each lesson

## Technical Implementation

### Data Flow:
1. Teachers create tests and lessons
2. Backend stores data with class reference
3. Students fetch data filtered by their class
4. Frontend displays organized, filtered views
5. Real-time updates when teachers add/modify

### API Endpoints Used:
- `GET /TestsByClass/:id` - Fetch tests for student's class
- `GET /LessonsByClass/:id` - Fetch lessons for student's class

### Features:
- Automatic date filtering (today, upcoming, completed)
- Status-based filtering
- Color-coded indicators
- Responsive design
- Statistics calculation
- Expandable/collapsible lesson details

## Benefits

### Academic Preparation:
- Students know what's coming
- Time to prepare for tests
- Understand lesson objectives
- Bring required materials

### Time Management:
- See test schedules in advance
- Plan study time
- Know lesson durations
- Manage homework deadlines

### Performance Tracking:
- View test results
- See percentage scores
- Track progress over time
- Identify areas for improvement

### Communication:
- Clear expectations from teachers
- Homework assignments visible
- Learning objectives transparent
- Material requirements known

## Integration

### With Teacher Features:
- Teachers create tests → Students see them
- Teachers schedule lessons → Students view schedule
- Teachers enter marks → Students see results
- Teachers add homework → Students get notified

### With Existing Features:
- Complements attendance tracking
- Works with subject management
- Integrates with student profile
- Part of complete student dashboard

## Future Enhancements (Optional)
- Push notifications for upcoming tests
- Reminder system for lessons
- Download lesson materials
- Test preparation resources
- Study group formation
- Calendar integration
- Mobile app notifications
- Parent view of student schedule
- Test result analytics
- Lesson feedback system
