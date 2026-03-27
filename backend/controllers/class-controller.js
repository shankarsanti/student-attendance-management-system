const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    updateDocument,
    deleteDocument,
    queryDocuments,
    getAllDocuments 
} = require('../models/firebase/helpers');

const sclassCreate = async (req, res) => {
    try {
        const sclassData = {
            sclassName: req.body.sclassName,
            school: req.body.adminID
        };

        const existingSclassByName = await queryDocuments(COLLECTIONS.CLASSES, [
            { field: 'sclassName', operator: '==', value: req.body.sclassName },
            { field: 'school', operator: '==', value: req.body.adminID }
        ]);

        if (existingSclassByName.length > 0) {
            res.send({ message: 'Sorry this class name already exists' });
        }
        else {
            const result = await createDocument(COLLECTIONS.CLASSES, sclassData);
            res.send(result);
        }
    } catch (err) {
        console.error('Class create error:', err);
        res.status(500).json(err);
    }
};

const sclassList = async (req, res) => {
    try {
        let sclasses = await queryDocuments(COLLECTIONS.CLASSES, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        if (sclasses.length > 0) {
            res.send(sclasses)
        } else {
            res.send({ message: "No sclasses found" });
        }
    } catch (err) {
        console.error('Class list error:', err);
        res.status(500).json(err);
    }
};

const getSclassDetail = async (req, res) => {
    try {
        let sclass = await getDocumentById(COLLECTIONS.CLASSES, req.params.id);
        if (sclass) {
            // Populate school data
            if (sclass.school) {
                const schoolData = await getDocumentById(COLLECTIONS.ADMINS, sclass.school);
                if (schoolData) {
                    sclass.school = {
                        id: schoolData.id,
                        schoolName: schoolData.schoolName
                    };
                }
            }
            res.send(sclass);
        }
        else {
            res.send({ message: "No class found" });
        }
    } catch (err) {
        console.error('Get class detail error:', err);
        res.status(500).json(err);
    }
}

const getSclassStudents = async (req, res) => {
    try {
        let students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'sclassName', operator: '==', value: req.params.id }
        ]);
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                const { password, ...studentWithoutPassword } = student;
                return studentWithoutPassword;
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        console.error('Get class students error:', err);
        res.status(500).json(err);
    }
}

const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await getDocumentById(COLLECTIONS.CLASSES, req.params.id);
        if (!deletedClass) {
            return res.send({ message: "Class not found" });
        }
        
        await deleteDocument(COLLECTIONS.CLASSES, req.params.id);
        
        // Delete related students
        const students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'sclassName', operator: '==', value: req.params.id }
        ]);
        for (const student of students) {
            await deleteDocument(COLLECTIONS.STUDENTS, student.id);
        }
        
        // Delete related subjects
        const subjects = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'sclassName', operator: '==', value: req.params.id }
        ]);
        for (const subject of subjects) {
            await deleteDocument(COLLECTIONS.SUBJECTS, subject.id);
        }
        
        // Delete related teachers
        const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
            { field: 'teachSclass', operator: '==', value: req.params.id }
        ]);
        for (const teacher of teachers) {
            await deleteDocument(COLLECTIONS.TEACHERS, teacher.id);
        }
        
        res.send(deletedClass);
    } catch (error) {
        console.error('Delete class error:', error);
        res.status(500).json(error);
    }
}

const deleteSclasses = async (req, res) => {
    try {
        const classes = await queryDocuments(COLLECTIONS.CLASSES, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (classes.length === 0) {
            return res.send({ message: "No classes found to delete" });
        }
        
        // Delete all classes
        for (const cls of classes) {
            await deleteDocument(COLLECTIONS.CLASSES, cls.id);
        }
        
        // Delete related students
        const students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        for (const student of students) {
            await deleteDocument(COLLECTIONS.STUDENTS, student.id);
        }
        
        // Delete related subjects
        const subjects = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        for (const subject of subjects) {
            await deleteDocument(COLLECTIONS.SUBJECTS, subject.id);
        }
        
        // Delete related teachers
        const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        for (const teacher of teachers) {
            await deleteDocument(COLLECTIONS.TEACHERS, teacher.id);
        }
        
        res.send({ deletedCount: classes.length });
    } catch (error) {
        console.error('Delete classes error:', error);
        res.status(500).json(error);
    }
}

module.exports = { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };
