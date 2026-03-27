const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    queryDocuments, 
    updateDocument,
    deleteDocument
} = require('../models/firebase/helpers');

// Fee Structure Controllers
const createFeeStructure = async (req, res) => {
    try {
        const feeStructure = await createDocument(COLLECTIONS.FEE_STRUCTURES, req.body);
        res.send(feeStructure);
    } catch (err) {
        console.error('Create fee structure error:', err);
        res.status(500).json(err);
    }
};

const getFeeStructures = async (req, res) => {
    try {
        let feeStructures = await queryDocuments(COLLECTIONS.FEE_STRUCTURES, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (feeStructures.length > 0) {
            // Populate class details
            for (let fee of feeStructures) {
                if (fee.sclass) {
                    fee.sclass = await getDocumentById(COLLECTIONS.CLASSES, fee.sclass);
                }
            }
            res.send(feeStructures);
        } else {
            res.send({ message: "No fee structures found" });
        }
    } catch (err) {
        console.error('Get fee structures error:', err);
        res.status(500).json(err);
    }
};

const getFeeStructure = async (req, res) => {
    try {
        let feeStructure = await getDocumentById(COLLECTIONS.FEE_STRUCTURES, req.params.id);
        
        if (feeStructure) {
            // Populate class details
            if (feeStructure.sclass) {
                feeStructure.sclass = await getDocumentById(COLLECTIONS.CLASSES, feeStructure.sclass);
            }
            res.send(feeStructure);
        } else {
            res.send({ message: "No fee structure found" });
        }
    } catch (err) {
        console.error('Get fee structure error:', err);
        res.status(500).json(err);
    }
};

const getFeeStructureByClass = async (req, res) => {
    try {
        let feeStructures = await queryDocuments(COLLECTIONS.FEE_STRUCTURES, [
            { field: 'sclass', operator: '==', value: req.params.id }
        ]);
        
        if (feeStructures.length > 0) {
            res.send(feeStructures[0]);
        } else {
            res.send({ message: "No fee structure found for this class" });
        }
    } catch (err) {
        console.error('Get fee structure by class error:', err);
        res.status(500).json(err);
    }
};

const updateFeeStructure = async (req, res) => {
    try {
        await updateDocument(COLLECTIONS.FEE_STRUCTURES, req.params.id, req.body);
        let result = await getDocumentById(COLLECTIONS.FEE_STRUCTURES, req.params.id);
        res.send(result);
    } catch (error) {
        console.error('Update fee structure error:', error);
        res.status(500).json(error);
    }
};

const deleteFeeStructure = async (req, res) => {
    try {
        await deleteDocument(COLLECTIONS.FEE_STRUCTURES, req.params.id);
        res.send({ message: 'Fee structure deleted successfully' });
    } catch (error) {
        console.error('Delete fee structure error:', error);
        res.status(500).json(error);
    }
};

// Fee Payment Controllers
const recordPayment = async (req, res) => {
    try {
        const payment = await createDocument(COLLECTIONS.FEE_PAYMENTS, req.body);
        res.send(payment);
    } catch (err) {
        console.error('Record payment error:', err);
        res.status(500).json(err);
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        let payments = await queryDocuments(COLLECTIONS.FEE_PAYMENTS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (payments.length > 0) {
            // Populate student details
            for (let payment of payments) {
                if (payment.student) {
                    payment.student = await getDocumentById(COLLECTIONS.STUDENTS, payment.student);
                }
            }
            res.send(payments);
        } else {
            res.send({ message: "No payments found" });
        }
    } catch (err) {
        console.error('Get payment history error:', err);
        res.status(500).json(err);
    }
};

const getStudentPayments = async (req, res) => {
    try {
        let payments = await queryDocuments(COLLECTIONS.FEE_PAYMENTS, [
            { field: 'student', operator: '==', value: req.params.id }
        ]);
        
        if (payments.length > 0) {
            res.send(payments);
        } else {
            res.send({ message: "No payments found for this student" });
        }
    } catch (err) {
        console.error('Get student payments error:', err);
        res.status(500).json(err);
    }
};

const getStudentFeeStatus = async (req, res) => {
    try {
        const student = await getDocumentById(COLLECTIONS.STUDENTS, req.params.id);
        
        if (!student) {
            return res.send({ message: "Student not found" });
        }

        // Get fee structure for student's class
        const feeStructures = await queryDocuments(COLLECTIONS.FEE_STRUCTURES, [
            { field: 'sclass', operator: '==', value: student.sclassName }
        ]);

        if (feeStructures.length === 0) {
            return res.send({ message: "No fee structure found for this class" });
        }

        const feeStructure = feeStructures[0];

        // Get all payments by this student
        const payments = await queryDocuments(COLLECTIONS.FEE_PAYMENTS, [
            { field: 'student', operator: '==', value: req.params.id }
        ]);

        const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        const totalFee = feeStructure.totalAmount || 0;
        const balance = totalFee - totalPaid;

        res.send({
            student,
            feeStructure,
            payments,
            totalPaid,
            totalFee,
            balance,
            status: balance <= 0 ? 'Paid' : 'Pending'
        });
    } catch (err) {
        console.error('Get student fee status error:', err);
        res.status(500).json(err);
    }
};

const deletePayment = async (req, res) => {
    try {
        await deleteDocument(COLLECTIONS.FEE_PAYMENTS, req.params.id);
        res.send({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Delete payment error:', error);
        res.status(500).json(error);
    }
};

const getFeeDefaulters = async (req, res) => {
    try {
        const schoolId = req.params.id;

        // Get all students in the school
        const students = await queryDocuments(COLLECTIONS.STUDENTS, [
            { field: 'school', operator: '==', value: schoolId }
        ]);

        const defaulters = [];

        for (const student of students) {
            // Get fee structure for student's class
            const feeStructures = await queryDocuments(COLLECTIONS.FEE_STRUCTURES, [
                { field: 'sclass', operator: '==', value: student.sclassName }
            ]);

            if (feeStructures.length === 0) continue;

            const feeStructure = feeStructures[0];

            // Get payments by this student
            const payments = await queryDocuments(COLLECTIONS.FEE_PAYMENTS, [
                { field: 'student', operator: '==', value: student.id }
            ]);

            const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
            const totalFee = feeStructure.totalAmount || 0;
            const balance = totalFee - totalPaid;

            if (balance > 0) {
                defaulters.push({
                    student,
                    totalFee,
                    totalPaid,
                    balance
                });
            }
        }

        res.send(defaulters);
    } catch (err) {
        console.error('Get fee defaulters error:', err);
        res.status(500).json(err);
    }
};

module.exports = {
    createFeeStructure,
    getFeeStructures,
    getFeeStructure,
    getFeeStructureByClass,
    updateFeeStructure,
    deleteFeeStructure,
    recordPayment,
    getPaymentHistory,
    getStudentPayments,
    getStudentFeeStatus,
    deletePayment,
    getFeeDefaulters
};
