const bcrypt = require('bcrypt');
const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    queryDocuments, 
    updateDocument,
    deleteDocument,
    getAllDocuments,
    arrayUnion,
    arrayRemove
} = require('../models/firebase/helpers');

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const studentData = {
            ...req.body,
            password: hashedPass,
            role: 'Student',
            examResult: [],
            attendance: []
        };

        // Check if student already exists
        const existingStudent = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'rollNum', operator: '==', value: req.body.rollNum },
            { field: 'school', operator: '==', value: req.body.school }
        ]);

        if (existingStudent.length > 0) {
            res.send({ message: 'Roll Number already exists' });
        } else {
            let result = await createDocument(COLLECTIONS.STUDENTS, studentData);
            delete result.password;
            res.send(result);
        }
    } catch (err) {
        console.error('Student registration error:', err);
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        const students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'rollNum', operator: '==', value: req.body.rollNum },
            { field: 'name', operator: '==', value: req.body.studentName }
        ]);

        if (students.length > 0) {
            const student = students[0];
            const validated = await bcrypt.compare(req.body.password, student.password);
            
            if (validated) {
                // Get class details
                const sclass = await getDocumentById(COLLECTIONS.CLASSES, student.sclassName);
                
                delete student.password;
                res.send({ ...student, sclassName: sclass });
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        console.error('Student login error:', err);
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (students.length > 0) {
            // Populate class details
            for (let student of students) {
                if (student.sclassName) {
                    const sclass = await getDocumentById(COLLECTIONS.CLASSES, student.sclassName);
                    student.sclassName = sclass;
                }
            }
            res.send(students);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        console.error('Get students error:', err);
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await getDocumentById(COLLECTIONS.STUDENTS, req.params.id);
        
        if (student) {
            // Populate class details
            if (student.sclassName) {
                student.sclassName = await getDocumentById(COLLECTIONS.CLASSES, student.sclassName);
            }
            
            // Populate exam results with subject details
            if (student.examResult && student.examResult.length > 0) {
                for (let result of student.examResult) {
                    if (result.subName) {
                        result.subName = await getDocumentById(COLLECTIONS.SUBJECTS, result.subName);
                    }
                }
            }
            
            // Populate attendance with subject details
            if (student.attendance && student.attendance.length > 0) {
                for (let att of student.attendance) {
                    if (att.subName) {
                        att.subName = await getDocumentById(COLLECTIONS.SUBJECTS, att.subName);
                    }
                }
            }
            
            delete student.password;
            res.send(student);
        } else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        console.error('Get student detail error:', err);
        res.status(500).json(err);
    }
};

const deleteStudent = async (req, res) => {
    try {
        await deleteDocument(COLLECTIONS.STUDENTS, req.params.id);
        res.send({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json(error);
    }
};

const deleteStudents = async (req, res) => {
    try {
        const students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        for (const student of students) {
            await deleteDocument(COLLECTIONS.STUDENTS, student.id);
        }
        
        res.send({ message: 'All students deleted successfully' });
    } catch (error) {
        console.error('Delete students error:', error);
        res.status(500).json(error);
    }
};

const deleteStudentsByClass = async (req, res) => {
    try {
        const students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'sclassName', operator: '==', value: req.params.id }
        ]);
        
        for (const student of students) {
            await deleteDocument(COLLECTIONS.STUDENTS, student.id);
        }
        
        res.send({ message: 'Class students deleted successfully' });
    } catch (error) {
        console.error('Delete students by class error:', error);
        res.status(500).json(error);
    }
};

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        
        await updateDocument(COLLECTIONS.STUDENTS, req.params.id, req.body);
        let result = await getDocumentById(COLLECTIONS.STUDENTS, req.params.id);
        
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json(error);
    }
};

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await getDocumentById(COLLECTIONS.STUDENTS, req.params.id);
        
        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingResult = student.examResult?.find(
            (result) => result.subName === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            if (!student.examResult) {
                student.examResult = [];
            }
            student.examResult.push({ subName, marksObtained });
        }

        await updateDocument(COLLECTIONS.STUDENTS, req.params.id, {
            examResult: student.examResult
        });

        const result = await getDocumentById(COLLECTIONS.STUDENTS, req.params.id);
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Update exam result error:', error);
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await getDocumentById(COLLECTIONS.STUDENTS, req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingAttendance = student.attendance?.find(
            (a) => a.date === date && a.subName === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            if (!student.attendance) {
                student.attendance = [];
            }
            student.attendance.push({ date, status, subName });
        }

        await updateDocument(COLLECTIONS.STUDENTS, req.params.id, {
            attendance: student.attendance
        });

        const result = await getDocumentById(COLLECTIONS.STUDENTS, req.params.id);
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Student attendance error:', error);
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const students = await getAllDocuments(COLLECTIONS.STUDENTS);

        for (const student of students) {
            if (student.attendance) {
                student.attendance = student.attendance.filter(
                    (a) => a.subName !== subName
                );
                await updateDocument(COLLECTIONS.STUDENTS, student.id, {
                    attendance: student.attendance
                });
            }
        }

        res.send({ message: 'Attendance cleared for all students in subject' });
    } catch (error) {
        console.error('Clear attendance by subject error:', error);
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id;

    try {
        const students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'school', operator: '==', value: schoolId }
        ]);

        for (const student of students) {
            await updateDocument(COLLECTIONS.STUDENTS, student.id, {
                attendance: []
            });
        }

        res.send({ message: 'Attendance cleared for all students' });
    } catch (error) {
        console.error('Clear all attendance error:', error);
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId;

    try {
        const student = await getDocumentById(COLLECTIONS.STUDENTS, studentId);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        student.attendance = student.attendance?.filter(
            (a) => a.subName !== subName
        ) || [];

        await updateDocument(COLLECTIONS.STUDENTS, studentId, {
            attendance: student.attendance
        });

        const result = await getDocumentById(COLLECTIONS.STUDENTS, studentId);
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Remove student attendance by subject error:', error);
        res.status(500).json(error);
    }
};

const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        await updateDocument(COLLECTIONS.STUDENTS, studentId, {
            attendance: []
        });

        const result = await getDocumentById(COLLECTIONS.STUDENTS, studentId);
        delete result.password;
        res.send(result);
    } catch (error) {
        console.error('Remove student attendance error:', error);
        res.status(500).json(error);
    }
};

module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudent,
    deleteStudents,
    deleteStudentsByClass,
    updateStudent,
    updateExamResult,
    studentAttendance,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};
