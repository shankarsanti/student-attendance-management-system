const bcrypt = require('bcrypt');
const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    queryDocuments, 
    updateDocument,
    deleteDocument
} = require('../models/firebase/helpers');

const teacherRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const teacherData = {
            ...req.body,
            password: hashedPass,
            role: 'Teacher'
        };

        // Check if teacher email already exists
        const existingTeacher = await queryDocuments(COLLECTIONS.TEACHERS, [
            { field: 'email', operator: '==', value: req.body.email }
        ]);

        if (existingTeacher.length > 0) {
            res.send({ message: 'Email already exists' });
        } else {
            let result = await createDocument(COLLECTIONS.TEACHERS, teacherData);
            delete result.password;
            res.send(result);
        }
    } catch (err) {
        console.error('Teacher registration error:', err);
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
            { field: 'email', operator: '==', value: req.body.email }
        ]);

        if (teachers.length > 0) {
            const teacher = teachers[0];
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            
            if (validated) {
                // Populate subject details
                if (teacher.teachSubject) {
                    teacher.teachSubject = await getDocumentById(COLLECTIONS.SUBJECTS, teacher.teachSubject);
                    
                    // Populate class details within subject
                    if (teacher.teachSubject && teacher.teachSubject.sclassName) {
                        teacher.teachSubject.sclassName = await getDocumentById(COLLECTIONS.CLASSES, teacher.teachSubject.sclassName);
                    }
                }
                
                // Populate school details
                if (teacher.school) {
                    teacher.school = await getDocumentById(COLLECTIONS.ADMINS, teacher.school);
                }
                
                delete teacher.password;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        console.error('Teacher login error:', err);
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (teachers.length > 0) {
            // Populate subject details for each teacher
            for (let teacher of teachers) {
                if (teacher.teachSubject) {
                    const subject = await getDocumentById(COLLECTIONS.SUBJECTS, teacher.teachSubject);
                    teacher.teachSubject = subject;
                    
                    // Populate class details
                    if (subject && subject.sclassName) {
                        subject.sclassName = await getDocumentById(COLLECTIONS.CLASSES, subject.sclassName);
                    }
                }
            }
            res.send(teachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        console.error('Get teachers error:', err);
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await getDocumentById(COLLECTIONS.TEACHERS, req.params.id);
        
        if (teacher) {
            // Populate subject details
            if (teacher.teachSubject) {
                teacher.teachSubject = await getDocumentById(COLLECTIONS.SUBJECTS, teacher.teachSubject);
                
                // Populate class details
                if (teacher.teachSubject && teacher.teachSubject.sclassName) {
                    teacher.teachSubject.sclassName = await getDocumentById(COLLECTIONS.CLASSES, teacher.teachSubject.sclassName);
                }
            }
            
            // Populate school details
            if (teacher.school) {
                teacher.school = await getDocumentById(COLLECTIONS.ADMINS, teacher.school);
            }
            
            delete teacher.password;
            res.send(teacher);
        } else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        console.error('Get teacher detail error:', err);
        res.status(500).json(err);
    }
};

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    
    try {
        const updatedTeacher = await updateDocument(COLLECTIONS.TEACHERS, teacherId, {
            teachSubject
        });
        
        const result = await getDocumentById(COLLECTIONS.TEACHERS, teacherId);
        
        // Populate subject details
        if (result.teachSubject) {
            result.teachSubject = await getDocumentById(COLLECTIONS.SUBJECTS, result.teachSubject);
        }
        
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Update teacher subject error:', error);
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        await deleteDocument(COLLECTIONS.TEACHERS, req.params.id);
        res.send({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        for (const teacher of teachers) {
            await deleteDocument(COLLECTIONS.TEACHERS, teacher.id);
        }
        
        res.send({ message: 'All teachers deleted successfully' });
    } catch (error) {
        console.error('Delete teachers error:', error);
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        // First get all subjects for this class
        const subjects = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'sclassName', operator: '==', value: req.params.id }
        ]);
        
        const subjectIds = subjects.map(s => s.id);
        
        // Delete teachers teaching these subjects
        for (const subjectId of subjectIds) {
            const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
                { field: 'teachSubject', operator: '==', value: subjectId }
            ]);
            
            for (const teacher of teachers) {
                await deleteDocument(COLLECTIONS.TEACHERS, teacher.id);
            }
        }
        
        res.send({ message: 'Class teachers deleted successfully' });
    } catch (error) {
        console.error('Delete teachers by class error:', error);
        res.status(500).json(error);
    }
};

const updateTeacher = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        
        await updateDocument(COLLECTIONS.TEACHERS, req.params.id, req.body);
        let result = await getDocumentById(COLLECTIONS.TEACHERS, req.params.id);
        
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Update teacher error:', error);
        res.status(500).json(error);
    }
};

// Add/Remove teacher subject (for backward compatibility)
const addTeacherSubject = async (req, res) => {
    return updateTeacherSubject(req, res);
};

const removeTeacherSubject = async (req, res) => {
    const { teacherId } = req.body;
    
    try {
        await updateDocument(COLLECTIONS.TEACHERS, teacherId, {
            teachSubject: null
        });
        
        const result = await getDocumentById(COLLECTIONS.TEACHERS, teacherId);
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Remove teacher subject error:', error);
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    // Teacher attendance functionality
    const { status, date } = req.body;
    const teacherId = req.params.id;

    try {
        const teacher = await getDocumentById(COLLECTIONS.TEACHERS, teacherId);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        if (!teacher.attendance) {
            teacher.attendance = [];
        }

        const existingAttendance = teacher.attendance.find(a => a.date === date);

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        await updateDocument(COLLECTIONS.TEACHERS, teacherId, {
            attendance: teacher.attendance
        });

        const result = await getDocumentById(COLLECTIONS.TEACHERS, teacherId);
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Teacher attendance error:', error);
        res.status(500).json(error);
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    addTeacherSubject,
    removeTeacherSubject,
    teacherAttendance,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    updateTeacher
};
