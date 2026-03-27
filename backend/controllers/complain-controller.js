const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    updateDocument,
    deleteDocument,
    queryDocuments
} = require('../models/firebase/helpers');

const complainCreate = async (req, res) => {
    try {
        const result = await createDocument(COLLECTIONS.COMPLAINS, req.body);
        res.send(result);
    } catch (err) {
        console.error('Complain create error:', err);
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
        let complains = await queryDocuments(COLLECTIONS.COMPLAINS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (complains.length > 0) {
            // Populate user data
            for (let complain of complains) {
                if (complain.user) {
                    // Try to find user in students, teachers, or admins
                    let userData = await getDocumentById(COLLECTIONS.STUDENTS, complain.user);
                    if (!userData) userData = await getDocumentById(COLLECTIONS.TEACHERS, complain.user);
                    if (!userData) userData = await getDocumentById(COLLECTIONS.ADMINS, complain.user);
                    
                    if (userData) {
                        complain.user = {
                            id: userData.id,
                            name: userData.name
                        };
                    }
                }
            }
            res.send(complains);
        } else {
            res.send({ message: "No complains found" });
        }
    } catch (err) {
        console.error('Complain list error:', err);
        res.status(500).json(err);
    }
};

const updateComplainStatus = async (req, res) => {
    try {
        await updateDocument(COLLECTIONS.COMPLAINS, req.params.id, {
            status: req.body.status
        });
        
        let result = await getDocumentById(COLLECTIONS.COMPLAINS, req.params.id);
        
        // Populate user data
        if (result && result.user) {
            let userData = await getDocumentById(COLLECTIONS.STUDENTS, result.user);
            if (!userData) userData = await getDocumentById(COLLECTIONS.TEACHERS, result.user);
            if (!userData) userData = await getDocumentById(COLLECTIONS.ADMINS, result.user);
            
            if (userData) {
                result.user = {
                    id: userData.id,
                    name: userData.name
                };
            }
        }
        
        res.send(result);
    } catch (error) {
        console.error('Update complain status error:', error);
        res.status(500).json(error);
    }
};

const deleteComplain = async (req, res) => {
    try {
        const result = await getDocumentById(COLLECTIONS.COMPLAINS, req.params.id);
        await deleteDocument(COLLECTIONS.COMPLAINS, req.params.id);
        res.send(result);
    } catch (error) {
        console.error('Delete complain error:', error);
        res.status(500).json(error);
    }
};

const deleteComplains = async (req, res) => {
    try {
        const complains = await queryDocuments(COLLECTIONS.COMPLAINS, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (complains.length === 0) {
            res.send({ message: "No complains found to delete" });
        } else {
            for (const complain of complains) {
                await deleteDocument(COLLECTIONS.COMPLAINS, complain.id);
            }
            res.send({ deletedCount: complains.length });
        }
    } catch (error) {
        console.error('Delete complains error:', error);
        res.status(500).json(error);
    }
};

module.exports = { 
    complainCreate, 
    complainList, 
    updateComplainStatus,
    deleteComplain,
    deleteComplains
};
