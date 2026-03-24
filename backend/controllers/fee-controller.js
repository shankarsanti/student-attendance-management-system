const FeeStructure = require('../models/feeStructureSchema.js');
const FeePayment = require('../models/feePaymentSchema.js');
const Student = require('../models/studentSchema.js');

// Fee Structure Controllers
const createFeeStructure = async (req, res) => {
    try {
        const feeStructure = new FeeStructure(req.body);
        const result = await feeStructure.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFeeStructures = async (req, res) => {
    try {
        let feeStructures = await FeeStructure.find({ school: req.params.id })
            .populate('class', 'sclassName')
            .sort({ createdAt: -1 });
        if (feeStructures.length > 0) {
            res.send(feeStructures);
        } else {
            res.send({ message: "No fee structures found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFeeStructure = async (req, res) => {
    try {
        let feeStructure = await FeeStructure.findById(req.params.id)
            .populate('class', 'sclassName');
        if (feeStructure) {
            res.send(feeStructure);
        } else {
            res.send({ message: "Fee structure not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateFeeStructure = async (req, res) => {
    try {
        const result = await FeeStructure.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true });
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteFeeStructure = async (req, res) => {
    try {
        const result = await FeeStructure.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Fee Payment Controllers
const recordPayment = async (req, res) => {
    try {
        console.log('Recording payment with data:', req.body);
        
        // Validate required fields
        if (!req.body.student) {
            console.error('Missing student ID');
            return res.status(400).json({ message: 'Student ID is required' });
        }
        if (!req.body.feeStructure) {
            console.error('Missing fee structure ID');
            return res.status(400).json({ message: 'Fee structure ID is required' });
        }
        if (!req.body.amountPaid || req.body.amountPaid <= 0) {
            console.error('Invalid amount:', req.body.amountPaid);
            return res.status(400).json({ message: 'Valid payment amount is required' });
        }
        
        const payment = new FeePayment(req.body);
        console.log('Created payment object:', payment);
        
        const result = await payment.save();
        console.log('Payment saved successfully:', result._id);
        
        res.send(result);
    } catch (err) {
        console.error('Error recording payment:', err);
        console.error('Error details:', err.message);
        res.status(500).json({ 
            message: 'Error recording payment', 
            error: err.message 
        });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        let payments = await FeePayment.find({ school: req.params.id })
            .populate('student', 'name rollNum')
            .populate('feeStructure', 'feeName feeType amount')
            .sort({ paymentDate: -1 });
        if (payments.length > 0) {
            res.send(payments);
        } else {
            res.send({ message: "No payment records found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentPayments = async (req, res) => {
    try {
        let payments = await FeePayment.find({ student: req.params.id })
            .populate('feeStructure', 'feeName feeType amount')
            .sort({ paymentDate: -1 });
        if (payments.length > 0) {
            res.send(payments);
        } else {
            res.send({ message: "No payment records found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentFeeStatus = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('sclassName');
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Get all fee structures for student's class
        const feeStructures = await FeeStructure.find({
            $or: [
                { class: student.sclassName._id },
                { class: null }
            ],
            school: student.school
        }).populate('class', 'sclassName');

        if (feeStructures.length === 0) {
            return res.send({ message: "No fee structure found for this student" });
        }

        // Get all payments made by student
        const payments = await FeePayment.find({ student: req.params.id });

        // Calculate fee status
        const feeStatus = feeStructures.map(fee => {
            const paidAmount = payments
                .filter(p => p.feeStructure.toString() === fee._id.toString())
                .reduce((sum, p) => sum + p.amountPaid, 0);
            
            return {
                feeStructure: fee,
                totalAmount: fee.amount,
                paidAmount: paidAmount,
                pendingAmount: fee.amount - paidAmount,
                status: paidAmount >= fee.amount ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Pending'
            };
        });

        res.send(feeStatus);
    } catch (err) {
        console.error('Error in getStudentFeeStatus:', err);
        res.status(500).json(err);
    }
};

const deletePayment = async (req, res) => {
    try {
        const result = await FeePayment.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Fee Defaulters (for reminders)
const getFeeDefaulters = async (req, res) => {
    try {
        const students = await Student.find({ school: req.params.id })
            .populate('sclassName', 'sclassName');

        const defaulters = [];

        for (let student of students) {
            const feeStructures = await FeeStructure.find({
                $or: [
                    { class: student.sclassName._id },
                    { class: null }
                ],
                school: student.school
            });

            const payments = await FeePayment.find({ student: student._id });

            let totalDue = 0;
            let pendingFees = [];

            feeStructures.forEach(fee => {
                const paidAmount = payments
                    .filter(p => p.feeStructure.toString() === fee._id.toString())
                    .reduce((sum, p) => sum + p.amountPaid, 0);
                
                const pending = fee.amount - paidAmount;
                if (pending > 0) {
                    totalDue += pending;
                    pendingFees.push({
                        feeName: fee.feeName,
                        feeType: fee.feeType,
                        amount: fee.amount,
                        paid: paidAmount,
                        pending: pending
                    });
                }
            });

            if (totalDue > 0) {
                defaulters.push({
                    student: {
                        _id: student._id,
                        name: student.name,
                        rollNum: student.rollNum,
                        class: student.sclassName.sclassName
                    },
                    totalDue: totalDue,
                    pendingFees: pendingFees
                });
            }
        }

        res.send(defaulters);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    createFeeStructure,
    getFeeStructures,
    getFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    recordPayment,
    getPaymentHistory,
    getStudentPayments,
    getStudentFeeStatus,
    deletePayment,
    getFeeDefaulters
};
