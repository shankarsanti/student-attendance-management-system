const Test = require('../models/testSchema');
const Student = require('../models/studentSchema');

// Create a new test
const createTest = async (req, res) => {
    try {
        const test = new Test(req.body);
        const result = await test.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all tests for a teacher
const getTestsByTeacher = async (req, res) => {
    try {
        const tests = await Test.find({ teacher: req.params.id })
            .populate('subject', 'subName')
            .populate('sclass', 'sclassName')
            .sort({ date: -1 });
        
        if (tests.length > 0) {
            res.send(tests);
        } else {
            res.send({ message: "No tests found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all tests for a class
const getTestsByClass = async (req, res) => {
    try {
        const tests = await Test.find({ sclass: req.params.id })
            .populate('subject', 'subName')
            .populate('teacher', 'name')
            .sort({ date: -1 });
        
        if (tests.length > 0) {
            res.send(tests);
        } else {
            res.send({ message: "No tests found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get test details
const getTestDetail = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id)
            .populate('subject', 'subName')
            .populate('sclass', 'sclassName')
            .populate('teacher', 'name')
            .populate('results.student', 'name rollNum');
        
        if (test) {
            res.send(test);
        } else {
            res.send({ message: "Test not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Update test
const updateTest = async (req, res) => {
    try {
        const result = await Test.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete test
const deleteTest = async (req, res) => {
    try {
        const result = await Test.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Add or update test result for a student
const updateTestResult = async (req, res) => {
    const { testId, studentId, marksObtained, remarks } = req.body;
    
    try {
        const test = await Test.findById(testId);
        
        if (!test) {
            return res.send({ message: 'Test not found' });
        }

        const existingResult = test.results.find(
            r => r.student.toString() === studentId
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
            existingResult.remarks = remarks || existingResult.remarks;
        } else {
            test.results.push({ student: studentId, marksObtained, remarks });
        }

        await test.save();
        
        // Also update student's exam result
        const student = await Student.findById(studentId);
        if (student) {
            const existingExamResult = student.examResult.find(
                er => er.subName.toString() === test.subject.toString()
            );
            
            if (existingExamResult) {
                existingExamResult.marksObtained += marksObtained;
            } else {
                student.examResult.push({
                    subName: test.subject,
                    marksObtained: marksObtained
                });
            }
            await student.save();
        }

        const updatedTest = await Test.findById(testId)
            .populate('results.student', 'name rollNum');
        
        res.send(updatedTest);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get tests for a student
const getTestsByStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.send({ message: "Student not found" });
        }

        const tests = await Test.find({ sclass: student.sclassName })
            .populate('subject', 'subName')
            .populate('teacher', 'name')
            .sort({ date: -1 });
        
        if (tests.length > 0) {
            res.send(tests);
        } else {
            res.send({ message: "No tests found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    createTest,
    getTestsByTeacher,
    getTestsByClass,
    getTestDetail,
    updateTest,
    deleteTest,
    updateTestResult,
    getTestsByStudent
};
