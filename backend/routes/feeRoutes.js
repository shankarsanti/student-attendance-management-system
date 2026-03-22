const router = require('express').Router();

const {
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
} = require('../controllers/fee-controller.js');

// Fee Structure Routes
router.post('/FeeStructureCreate', createFeeStructure);
router.get('/FeeStructures/:id', getFeeStructures);
router.get('/FeeStructure/:id', getFeeStructure);
router.put('/FeeStructure/:id', updateFeeStructure);
router.delete('/FeeStructure/:id', deleteFeeStructure);

// Fee Payment Routes
router.post('/FeePaymentCreate', recordPayment);
router.get('/FeePayments/:id', getPaymentHistory);
router.get('/StudentPayments/:id', getStudentPayments);
router.get('/StudentFeeStatus/:id', getStudentFeeStatus);
router.delete('/FeePayment/:id', deletePayment);

// Fee Defaulters Route
router.get('/FeeDefaulters/:id', getFeeDefaulters);

module.exports = router;
