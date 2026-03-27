const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    queryDocuments, 
    updateDocument,
    deleteDocument
} = require('../models/firebase/helpers');

const createLesson = async (req, res) => {
    try {
        const lesson = await createDocument(COLLECTIONS.LESSONS, req.body);
        res.send(lesson);
    } catch (err) {
        console.error('Lesson create error:', err);
        res.status(500).json(err);
    }
};

const getLessonsByTeacher = async (req, res) => {
    try {
        // Get teacher's subject
        const teacher = await getDocumentById(COLLECTIONS.TEACHERS, req.params.id);
        
        if (!teacher || !teacher.teachSubject) {
            return res.send({ message: "No subject assigned to teacher" });
        }

        let lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'subject', operator: '==', value: teacher.teachSubject }
        ]);
        
        if (lessons.length > 0) {
            // Populate subject and class details
            for (let lesson of lessons) {
                if (lesson.subject) {
                    lesson.subject = await getDocumentById(COLLECTIONS.SUBJECTS, lesson.subject);
                }
                if (lesson.sclass) {
                    lesson.sclass = await getDocumentById(COLLECTIONS.CLASSES, lesson.sclass);
                }
            }
            res.send(lessons);
        } else {
            res.send({ message: "No lessons found" });
        }
    } catch (err) {
        console.error('Get lessons by teacher error:', err);
        res.status(500).json(err);
    }
};

const getLessonsByClass = async (req, res) => {
    try {
        let lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'sclass', operator: '==', value: req.params.id }
        ]);
        
        if (lessons.length > 0) {
            // Populate subject details
            for (let lesson of lessons) {
                if (lesson.subject) {
                    lesson.subject = await getDocumentById(COLLECTIONS.SUBJECTS, lesson.subject);
                }
            }
            res.send(lessons);
        } else {
            res.send({ message: "No lessons found" });
        }
    } catch (err) {
        console.error('Get lessons by class error:', err);
        res.status(500).json(err);
    }
};

const getLessonsByDateRange = async (req, res) => {
    const { startDate, endDate, classId } = req.query;

    try {
        let lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'sclass', operator: '==', value: classId }
        ]);

        // Filter by date range
        if (startDate && endDate) {
            lessons = lessons.filter(lesson => {
                const lessonDate = new Date(lesson.date);
                return lessonDate >= new Date(startDate) && lessonDate <= new Date(endDate);
            });
        }

        if (lessons.length > 0) {
            // Populate subject details
            for (let lesson of lessons) {
                if (lesson.subject) {
                    lesson.subject = await getDocumentById(COLLECTIONS.SUBJECTS, lesson.subject);
                }
            }
            res.send(lessons);
        } else {
            res.send({ message: "No lessons found" });
        }
    } catch (err) {
        console.error('Get lessons by date range error:', err);
        res.status(500).json(err);
    }
};

const getTodayLessons = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        let lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'sclass', operator: '==', value: req.params.id }
        ]);

        // Filter for today's lessons
        lessons = lessons.filter(lesson => {
            const lessonDate = new Date(lesson.date).toISOString().split('T')[0];
            return lessonDate === today;
        });

        if (lessons.length > 0) {
            // Populate subject details
            for (let lesson of lessons) {
                if (lesson.subject) {
                    lesson.subject = await getDocumentById(COLLECTIONS.SUBJECTS, lesson.subject);
                }
            }
            res.send(lessons);
        } else {
            res.send({ message: "No lessons found for today" });
        }
    } catch (err) {
        console.error('Get today lessons error:', err);
        res.status(500).json(err);
    }
};

const getUpcomingLessons = async (req, res) => {
    try {
        const today = new Date();
        
        let lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'sclass', operator: '==', value: req.params.id }
        ]);

        // Filter for upcoming lessons
        lessons = lessons.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            return lessonDate > today;
        });

        // Sort by date
        lessons.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (lessons.length > 0) {
            // Populate subject details
            for (let lesson of lessons) {
                if (lesson.subject) {
                    lesson.subject = await getDocumentById(COLLECTIONS.SUBJECTS, lesson.subject);
                }
            }
            res.send(lessons);
        } else {
            res.send({ message: "No upcoming lessons found" });
        }
    } catch (err) {
        console.error('Get upcoming lessons error:', err);
        res.status(500).json(err);
    }
};

const getLessonsBySubject = async (req, res) => {
    try {
        let lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'subject', operator: '==', value: req.params.id }
        ]);
        
        if (lessons.length > 0) {
            res.send(lessons);
        } else {
            res.send({ message: "No lessons found" });
        }
    } catch (err) {
        console.error('Get lessons by subject error:', err);
        res.status(500).json(err);
    }
};

const getLessonDetail = async (req, res) => {
    try {
        let lesson = await getDocumentById(COLLECTIONS.LESSONS, req.params.id);
        
        if (lesson) {
            // Populate subject and class details
            if (lesson.subject) {
                lesson.subject = await getDocumentById(COLLECTIONS.SUBJECTS, lesson.subject);
            }
            if (lesson.sclass) {
                lesson.sclass = await getDocumentById(COLLECTIONS.CLASSES, lesson.sclass);
            }
            res.send(lesson);
        } else {
            res.send({ message: "No lesson found" });
        }
    } catch (err) {
        console.error('Get lesson detail error:', err);
        res.status(500).json(err);
    }
};

const updateLesson = async (req, res) => {
    try {
        await updateDocument(COLLECTIONS.LESSONS, req.params.id, req.body);
        let result = await getDocumentById(COLLECTIONS.LESSONS, req.params.id);
        res.send(result);
    } catch (error) {
        console.error('Update lesson error:', error);
        res.status(500).json(error);
    }
};

const markLessonAttendance = async (req, res) => {
    const { lessonId, attendance } = req.body;

    try {
        await updateDocument(COLLECTIONS.LESSONS, lessonId, {
            attendance
        });

        const result = await getDocumentById(COLLECTIONS.LESSONS, lessonId);
        res.send(result);
    } catch (error) {
        console.error('Mark lesson attendance error:', error);
        res.status(500).json(error);
    }
};

const deleteLesson = async (req, res) => {
    try {
        await deleteDocument(COLLECTIONS.LESSONS, req.params.id);
        res.send({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Delete lesson error:', error);
        res.status(500).json(error);
    }
};

const deleteLessons = async (req, res) => {
    try {
        const lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        for (const lesson of lessons) {
            await deleteDocument(COLLECTIONS.LESSONS, lesson.id);
        }
        
        res.send({ message: 'All lessons deleted successfully' });
    } catch (error) {
        console.error('Delete lessons error:', error);
        res.status(500).json(error);
    }
};

const deleteLessonsByClass = async (req, res) => {
    try {
        const lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'sclass', operator: '==', value: req.params.id }
        ]);
        
        for (const lesson of lessons) {
            await deleteDocument(COLLECTIONS.LESSONS, lesson.id);
        }
        
        res.send({ message: 'Class lessons deleted successfully' });
    } catch (error) {
        console.error('Delete lessons by class error:', error);
        res.status(500).json(error);
    }
};

const deleteLessonsBySubject = async (req, res) => {
    try {
        const lessons = await queryDocuments(COLLECTIONS.LESSONS, [
            { field: 'subject', operator: '==', value: req.params.id }
        ]);
        
        for (const lesson of lessons) {
            await deleteDocument(COLLECTIONS.LESSONS, lesson.id);
        }
        
        res.send({ message: 'Subject lessons deleted successfully' });
    } catch (error) {
        console.error('Delete lessons by subject error:', error);
        res.status(500).json(error);
    }
};

module.exports = {
    createLesson,
    getLessonsByTeacher,
    getLessonsByClass,
    getLessonsByDateRange,
    getTodayLessons,
    getUpcomingLessons,
    getLessonsBySubject,
    getLessonDetail,
    updateLesson,
    markLessonAttendance,
    deleteLesson,
    deleteLessons,
    deleteLessonsByClass,
    deleteLessonsBySubject
};
