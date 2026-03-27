const { getFirestore } = require('../../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

// Helper functions for Firebase Firestore operations

const createDocument = async (collection, data) => {
    const db = getFirestore();
    const docRef = await db.collection(collection).add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...data };
};

const getDocumentById = async (collection, id) => {
    const db = getFirestore();
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() };
};

const updateDocument = async (collection, id, data) => {
    const db = getFirestore();
    await db.collection(collection).doc(id).update({
        ...data,
        updatedAt: FieldValue.serverTimestamp()
    });
    return { id, ...data };
};

const deleteDocument = async (collection, id) => {
    const db = getFirestore();
    await db.collection(collection).doc(id).delete();
    return { id };
};

const queryDocuments = async (collection, filters = []) => {
    const db = getFirestore();
    let query = db.collection(collection);
    
    filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value);
    });
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getAllDocuments = async (collection) => {
    const db = getFirestore();
    const snapshot = await db.collection(collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Array operations
const arrayUnion = (value) => FieldValue.arrayUnion(value);
const arrayRemove = (value) => FieldValue.arrayRemove(value);

module.exports = {
    createDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    queryDocuments,
    getAllDocuments,
    arrayUnion,
    arrayRemove,
    FieldValue
};
