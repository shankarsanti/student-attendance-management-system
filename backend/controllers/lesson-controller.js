const Lesson = require('../models/lessonSchema');
const Student = require('../models/studentSchema');

// Create a new lesson
const createLesson = async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        const result = await lesson.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all lessons for a teacher
const getLessonsByTeacher = async (req, res) => {
    try {
        const lessons = await Lesson.find({ teacher: req.params.id })
            .populate('subject', 'subName')
            .populate('sclass', 'sclassName')
            .sort({ date: 1, startTime: 1 });
        
        if (lessons.length > 0) {
            res.send(lessons);
        } else {
            res.send({ message: "No lessons found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all lessons for a class
const getLessonsByClass = async (req, res) => {
    try {
        const lessons = await Lesson.find({ sclass: req.params.id })
            .populate('subject', 'subName')
            .populate('teacher', 'name')
            .sort({ date: 1, startTime: 1 });
        
        if (lessons.length > 0) {
            res.send(lessons);
        } else {
            res.send({ message: "No lessons found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get lessons by date range
const getLessonsByDateRange = async (req, res) => {
    const { teacherId, startDate, endDate } = req.query;
    
    try {
        const query = {
            teacher: teacherId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        const lessons = await Lesson.find(query)
            .populate('subject', 'subName')
            .populate('sclass', 'sclassName')
            .sort({ date: 1, startTime: 1 });
        
        res.send(lessons);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get lesson details
const getLessonDetail = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)
            .populate('subject', 'subName')
            .populate('sclass', 'sclassName')
            .populate('teacher', 'name')
            .populate('attendance.student', 'name rollNum');
        
        if (lesson) {
            res.send(lesson);
        } else {
            res.send({ message: "Lesson not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Update lesson
const updateLesson = async (req, res) => {
    try {
        const result = await Lesson.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete lesson
const deleteLesson = async (req, res) => {
    try {
        const result = await Lesson.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Mark lesson attendance
const markLessonAttendance = async (req, res) => {
    const { lessonId, studentId, status } = req.body;
    
    try {
        const lesson = await Lesson.findById(lessonId);
        
        if (!lesson) {
            return res.send({ message: 'Lesson not found' });
        }

        const existingAttendance = lesson.attendance.find(
            a => a.student.toString() === studentId
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            lesson.attendance.push({ student: studentId, status });
        }

        await lesson.save();
        
        // Also update student's attendance record
        const student = await Student.findById(studentId);
        if (student) {
            const attendanceRecord = {
                date: lesson.date,
                status: status === 'Present' || status === 'Late' ? 'Present' : 'Absent',
                subName: lesson.subject
            };
            
            const existingRecord = student.attendance.find(
                a => a.date.toDateString() === lesson.date.toDateString() && 
                     a.subName.toString() === lesson.subject.toString()
            );
            
            if (!existingRecord) {
                student.attendance.push(attendanceRecord);
                await student.save();
            }
        }

        const updatedLesson = await Lesson.findById(lessonId)
            .populate('attendance.student', 'name rollNum');
        
        res.send(updatedLesson);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get today's lessons for a teacher
const getTodayLessons = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const lessons = await Lesson.find({
            teacher: req.params.id,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        })
            .populate('subject', 'subName')
            .populate('sclass', 'sclassName')
            .sort({ startTime: 1 });
        
        res.send(lessons);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get upcoming lessons
const getUpcomingLessons = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lessons = await Lesson.find({
            teacher: req.params.id,
            date: { $gte: today },
            status: 'Scheduled'
        })
            .populate('subject', 'subName')
            .populate('sclass', 'sclassName')
            .sort({ date: 1, startTime: 1 })
            .limit(10);
        
        res.send(lessons);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    createLesson,
    getLessonsByTeacher,
    getLessonsByClass,
    getLessonsByDateRange,
    getLessonDetail,
    updateLesson,
    deleteLesson,
    markLessonAttendance,
    getTodayLessons,
    getUpcomingLessons
};
