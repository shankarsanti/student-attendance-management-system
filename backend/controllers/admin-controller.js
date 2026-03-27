const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getFirestore } = require('../config/firebase');
const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    queryDocuments, 
    updateDocument,
    deleteDocument 
} = require('../models/firebase/helpers');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: 'Admin', email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const adminRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const adminData = {
            ...req.body,
            password: hashedPass,
            role: 'Admin',
            isActive: true
        };

        // Check if email already exists
        const existingAdminByEmail = await queryDocuments(COLLECTIONS.ADMINS, [
            { field: 'email', operator: '==', value: req.body.email }
        ]);

        // Check if school name already exists
        const existingSchool = await queryDocuments(COLLECTIONS.ADMINS, [
            { field: 'schoolName', operator: '==', value: req.body.schoolName }
        ]);

        if (existingAdminByEmail.length > 0) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingSchool.length > 0) {
            res.send({ message: 'School name already exists' });
        }
        else {
            let result = await createDocument(COLLECTIONS.ADMINS, adminData);
            delete result.password;
            
            // Generate JWT token
            const token = generateToken(result);
            
            res.send({ ...result, token, role: 'Admin' });
        }
    } catch (err) {
        console.error('Admin registration error:', err);
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        try {
            const admins = await queryDocuments(COLLECTIONS.ADMINS, [
                { field: 'email', operator: '==', value: req.body.email }
            ]);

            if (admins.length > 0) {
                const admin = admins[0];
                const validated = await bcrypt.compare(req.body.password, admin.password);
                
                if (validated) {
                    // Update last login
                    await updateDocument(COLLECTIONS.ADMINS, admin.id, {
                        lastLogin: new Date().toISOString()
                    });
                    
                    delete admin.password;
                    
                    // Generate JWT token
                    const token = generateToken(admin);
                    
                    res.send({ ...admin, token, role: 'Admin' });
                } else {
                    res.send({ message: "Invalid password" });
                }
            } else {
                res.send({ message: "User not found" });
            }
        } catch (err) {
            console.error('Admin login error:', err);
            res.status(500).json(err);
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await getDocumentById(COLLECTIONS.ADMINS, req.params.id);
        if (admin) {
            delete admin.password;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        console.error('Get admin detail error:', err);
        res.status(500).json(err);
    }
}

// Uncomment and update these functions as needed
// const deleteAdmin = async (req, res) => {
//     try {
//         await deleteDocument(COLLECTIONS.ADMINS, req.params.id);
//
//         // Delete all related documents
//         const db = getFirestore();
//         const schoolId = req.params.id;
//         
//         // Delete classes
//         const classes = await queryDocuments(COLLECTIONS.CLASSES, [
//             { field: 'school', operator: '==', value: schoolId }
//         ]);
//         for (const cls of classes) {
//             await deleteDocument(COLLECTIONS.CLASSES, cls.id);
//         }
//         
//         // Delete students
//         const students = await queryDocuments(COLLECTIONS.STUDENTS, [
//             { field: 'school', operator: '==', value: schoolId }
//         ]);
//         for (const student of students) {
//             await deleteDocument(COLLECTIONS.STUDENTS, student.id);
//         }
//         
//         // Similar for teachers, subjects, notices, complains
//
//         res.send({ message: 'Admin and related data deleted successfully' });
//     } catch (error) {
//         console.error('Delete admin error:', error);
//         res.status(500).json(error);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         const updates = { ...req.body };
//         
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10);
//             updates.password = await bcrypt.hash(req.body.password, salt);
//         }
//         
//         await updateDocument(COLLECTIONS.ADMINS, req.params.id, updates);
//         let result = await getDocumentById(COLLECTIONS.ADMINS, req.params.id);
//         
//         delete result.password;
//         res.send(result);
//     } catch (error) {
//         console.error('Update admin error:', error);
//         res.status(500).json(error);
//     }
// }

module.exports = { adminRegister, adminLogIn, getAdminDetail };
