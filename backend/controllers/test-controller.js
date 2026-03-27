const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    queryDocuments, 
    updateDocument,
    deleteDocument
} = require('../models/firebase/helpers');

const createTest = async (req, res) => {
    try {
        const test = await createDocument(COLLECTIONS.TESTS, req.body);
        res.send(test);
    } catch (err) {
        console.error('Test create error:', err);
        res.status(500).json(err);
    }
};

const getTestsByTeacher = async (req, res) => {
    try {
        // Get teacher's subject
        const teacher = await getDocumentById(COLLECTIONS.TEACHERS, req.params.id);
        
        if (!teacher || !teacher.teachSubject) {
            return res.send({ message: "No subject assigned to teacher" });
        }

        let tests = await queryDocuments(COLLECTIONS.TESTS, [
            { field: 'subject', operator: '==', value: teacher.teachSubject }
        ]);
        
        if (tests.length > 0) {
            // Populate subject and class details
            for (let test of tests) {
                if (test.subject) {
                    test.subject = await getDocumentById(COLLECTIONS.SUBJECTS, test.subject);
                }
                if (test.sclass) {
                    test.sclass = await getDocumentById(COLLECTIONS.CLASSES, test.sclass);
                }
            }
            res.send(tests);
        } else {
            res.send({ message: "No tests found" });
        }
    } catch (err) {
        console.error('Get tests by teacher error:', err);
        res.status(500).json(err);
    }
};

const getTestsByClass = async (req, res) => {
    try {
        let tests = await queryDocuments(COLLECTIONS.TESTS, [
            { field: 'sclass', operator: '==', value: req.params.id }
        ]);
        
        if (tests.length > 0) {
            // Populate subject details
            for (let test of tests) {
                if (test.subject) {
                    test.subject = await getDocumentById(COLLECTIONS.SUBJECTS, test.subject);
                }
            }
            res.send(tests);
        } else {
            res.send({ message: "No tests found" });
        }
    } catch (err) {
        console.error('Get tests by class error:', err);
        res.status(500).json(err);
    }
};

const getTestsByStudent = async (req, res) => {
    try {
        // Get student's class
        const student = await getDocumentById(COLLECTIONS.STUDENTS, req.params.id);
        
        if (!student || !student.sclassName) {
            return res.send({ message: "Student not found or no class assigned" });
        }

        let tests = await queryDocuments(COLLECTIONS.TESTS, [
            { field: 'sclass', operator: '==', value: student.sclassName }
        ]);
        
        if (tests.length > 0) {
            // Populate subject details
            for (let test of tests) {
                if (test.subject) {
                    test.subject = await getDocumentById(COLLECTIONS.SUBJECTS, test.subject);
                }
            }
            res.send(tests);
        } else {
            res.send({ message: "No tests found" });
        }
    } catch (err) {
        console.error('Get tests by student error:', err);
        res.status(500).json(err);
    }
};

const getTestsBySubject = async (req, res) => {
    try {
        let tests = await queryDocuments(COLLECTIONS.TESTS, [
            { field: 'subject', operator: '==', value: req.params.id }
        ]);
        
        if (tests.length > 0) {
            res.send(tests);
        } else {
            res.send({ message: "No tests found" });
        }
    } catch (err) {
        console.error('Get tests by subject error:', err);
        res.status(500).json(err);
    }
};

const getTestDetail = async (req, res) => {
    try {
        let test = await getDocumentById(COLLECTIONS.TESTS, req.params.id);
        
        if (test) {
            // Populate subject and class details
            if (test.subject) {
                test.subject = await getDocumentById(COLLECTIONS.SUBJECTS, test.subject);
            }
            if (test.sclass) {
                test.sclass = await getDocumentById(COLLECTIONS.CLASSES, test.sclass);
            }
            res.send(test);
        } else {
            res.send({ message: "No test found" });
        }
    } catch (err) {
        console.error('Get test detail error:', err);
        res.status(500).json(err);
    }
};

const updateTest = async (req, res) => {
    try {
        await updateDocument(COLLECTIONS.TESTS, req.params.id, req.body);
        let result = await getDocumentById(COLLECTIONS.TESTS, req.params.id);
        res.send(result);
    } catch (error) {
        console.error('Update test error:', error);
        res.status(500).json(error);
    }
};

const updateTestResult = async (req, res) => {
    const { testId, studentId, marks } = req.body;

    try {
        const test = await getDocumentById(COLLECTIONS.TESTS, testId);
        
        if (!test) {
            return res.send({ message: 'Test not found' });
        }

        if (!test.results) {
            test.results = [];
        }

        const existingResult = test.results.find(r => r.studentId === studentId);

        if (existingResult) {
            existingResult.marks = marks;
        } else {
            test.results.push({ studentId, marks });
        }

        await updateDocument(COLLECTIONS.TESTS, testId, {
            results: test.results
        });

        const result = await getDocumentById(COLLECTIONS.TESTS, testId);
        res.send(result);
    } catch (error) {
        console.error('Update test result error:', error);
        res.status(500).json(error);
    }
};

const deleteTest = async (req, res) => {
    try {
        await deleteDocument(COLLECTIONS.TESTS, req.params.id);
        res.send({ message: 'Test deleted successfully' });
    } catch (error) {
        console.error('Delete test error:', error);
        res.status(500).json(error);
    }
};

const deleteTests = async (req, res) => {
    try {
        const tests = await queryDocuments(COLLECTIONS.TESTS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        for (const test of tests) {
            await deleteDocument(COLLECTIONS.TESTS, test.id);
        }
        
        res.send({ message: 'All tests deleted successfully' });
    } catch (error) {
        console.error('Delete tests error:', error);
        res.status(500).json(error);
    }
};

const deleteTestsByClass = async (req, res) => {
    try {
        const tests = await queryDocuments(COLLECTIONS.TESTS, [
            { field: 'sclass', operator: '==', value: req.params.id }
        ]);
        
        for (const test of tests) {
            await deleteDocument(COLLECTIONS.TESTS, test.id);
        }
        
        res.send({ message: 'Class tests deleted successfully' });
    } catch (error) {
        console.error('Delete tests by class error:', error);
        res.status(500).json(error);
    }
};

const deleteTestsBySubject = async (req, res) => {
    try {
        const tests = await queryDocuments(COLLECTIONS.TESTS, [
            { field: 'subject', operator: '==', value: req.params.id }
        ]);
        
        for (const test of tests) {
            await deleteDocument(COLLECTIONS.TESTS, test.id);
        }
        
        res.send({ message: 'Subject tests deleted successfully' });
    } catch (error) {
        console.error('Delete tests by subject error:', error);
        res.status(500).json(error);
    }
};

module.exports = {
    createTest,
    getTestsByTeacher,
    getTestsByClass,
    getTestsByStudent,
    getTestsBySubject,
    getTestDetail,
    updateTest,
    updateTestResult,
    deleteTest,
    deleteTests,
    deleteTestsByClass,
    deleteTestsBySubject
};
