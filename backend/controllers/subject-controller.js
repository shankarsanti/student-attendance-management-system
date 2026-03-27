const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    queryDocuments, 
    updateDocument,
    deleteDocument
} = require('../models/firebase/helpers');

const subjectCreate = async (req, res) => {
    try {
        // Check if subject already exists for this class
        const existingSubject = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'subName', operator: '==', value: req.body.subName },
            { field: 'sclassName', operator: '==', value: req.body.sclassName }
        ]);

        if (existingSubject.length > 0) {
            res.send({ message: 'Subject already exists for this class' });
        } else {
            const subject = await createDocument(COLLECTIONS.SUBJECTS, req.body);
            res.send(subject);
        }
    } catch (err) {
        console.error('Subject create error:', err);
        res.status(500).json(err);
    }
};

const classSubjects = async (req, res) => {
    try {
        let subjects = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'sclassName', operator: '==', value: req.params.id }
        ]);
        
        if (subjects.length > 0) {
            // Populate teacher details for each subject
            for (let subject of subjects) {
                const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
                    { field: 'teachSubject', operator: '==', value: subject.id }
                ]);
                subject.teacher = teachers.length > 0 ? teachers[0] : null;
            }
            res.send(subjects);
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        console.error('Get class subjects error:', err);
        res.status(500).json(err);
    }
};

const freeSubjectList = async (req, res) => {
    try {
        let subjects = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'sclassName', operator: '==', value: req.params.id }
        ]);
        
        // Filter subjects that don't have a teacher assigned
        const freeSubjects = [];
        for (let subject of subjects) {
            const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
                { field: 'teachSubject', operator: '==', value: subject.id }
            ]);
            if (teachers.length === 0) {
                freeSubjects.push(subject);
            }
        }
        
        if (freeSubjects.length > 0) {
            res.send(freeSubjects);
        } else {
            res.send({ message: "No free subjects found" });
        }
    } catch (err) {
        console.error('Get free subject list error:', err);
        res.status(500).json(err);
    }
};

const allSubjects = async (req, res) => {
    try {
        let subjects = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (subjects.length > 0) {
            // Populate class and teacher details
            for (let subject of subjects) {
                if (subject.sclassName) {
                    subject.sclassName = await getDocumentById(COLLECTIONS.CLASSES, subject.sclassName);
                }
                
                const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
                    { field: 'teachSubject', operator: '==', value: subject.id }
                ]);
                subject.teacher = teachers.length > 0 ? teachers[0] : null;
            }
            res.send(subjects);
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        console.error('Get all subjects error:', err);
        res.status(500).json(err);
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        let subject = await getDocumentById(COLLECTIONS.SUBJECTS, req.params.id);
        
        if (subject) {
            // Populate class details
            if (subject.sclassName) {
                subject.sclassName = await getDocumentById(COLLECTIONS.CLASSES, subject.sclassName);
            }
            
            // Get teacher for this subject
            const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
                { field: 'teachSubject', operator: '==', value: subject.id }
            ]);
            subject.teacher = teachers.length > 0 ? teachers[0] : null;
            
            res.send(subject);
        } else {
            res.send({ message: "No subject found" });
        }
    } catch (err) {
        console.error('Get subject detail error:', err);
        res.status(500).json(err);
    }
};

const deleteSubject = async (req, res) => {
    try {
        // Delete subject
        await deleteDocument(COLLECTIONS.SUBJECTS, req.params.id);
        
        // Update teachers teaching this subject
        const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
            { field: 'teachSubject', operator: '==', value: req.params.id }
        ]);
        
        for (const teacher of teachers) {
            await updateDocument(COLLECTIONS.TEACHERS, teacher.id, {
                teachSubject: null
            });
        }
        
        res.send({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Delete subject error:', error);
        res.status(500).json(error);
    }
};

const deleteSubjects = async (req, res) => {
    try {
        const subjects = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        for (const subject of subjects) {
            await deleteDocument(COLLECTIONS.SUBJECTS, subject.id);
            
            // Update teachers
            const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
                { field: 'teachSubject', operator: '==', value: subject.id }
            ]);
            
            for (const teacher of teachers) {
                await updateDocument(COLLECTIONS.TEACHERS, teacher.id, {
                    teachSubject: null
                });
            }
        }
        
        res.send({ message: 'All subjects deleted successfully' });
    } catch (error) {
        console.error('Delete subjects error:', error);
        res.status(500).json(error);
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        const subjects = await queryDocuments(COLLECTIONS.SUBJECTS, [
            { field: 'sclassName', operator: '==', value: req.params.id }
        ]);
        
        for (const subject of subjects) {
            await deleteDocument(COLLECTIONS.SUBJECTS, subject.id);
            
            // Update teachers
            const teachers = await queryDocuments(COLLECTIONS.TEACHERS, [
                { field: 'teachSubject', operator: '==', value: subject.id }
            ]);
            
            for (const teacher of teachers) {
                await updateDocument(COLLECTIONS.TEACHERS, teacher.id, {
                    teachSubject: null
                });
            }
        }
        
        res.send({ message: 'Class subjects deleted successfully' });
    } catch (error) {
        console.error('Delete subjects by class error:', error);
        res.status(500).json(error);
    }
};

module.exports = {
    subjectCreate,
    classSubjects,
    freeSubjectList,
    allSubjects,
    getSubjectDetail,
    deleteSubject,
    deleteSubjects,
    deleteSubjectsByClass
};
