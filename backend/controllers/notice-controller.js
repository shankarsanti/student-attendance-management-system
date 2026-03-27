const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    updateDocument,
    deleteDocument,
    queryDocuments
} = require('../models/firebase/helpers');

const noticeCreate = async (req, res) => {
    try {
        const noticeData = {
            ...req.body,
            school: req.body.adminID
        };
        const result = await createDocument(COLLECTIONS.NOTICES, noticeData);
        res.send(result);
    } catch (err) {
        console.error('Notice create error:', err);
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        let notices = await queryDocuments(COLLECTIONS.NOTICES, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        if (notices.length > 0) {
            res.send(notices);
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        console.error('Notice list error:', err);
        res.status(500).json(err);
    }
};

const getNoticeDetail = async (req, res) => {
    try {
        let notice = await getDocumentById(COLLECTIONS.NOTICES, req.params.id);
        if (notice) {
            res.send(notice);
        } else {
            res.send({ message: "No notice found" });
        }
    } catch (err) {
        console.error('Get notice detail error:', err);
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        await updateDocument(COLLECTIONS.NOTICES, req.params.id, req.body);
        const result = await getDocumentById(COLLECTIONS.NOTICES, req.params.id);
        res.send(result);
    } catch (error) {
        console.error('Update notice error:', error);
        res.status(500).json(error);
    }
}

const deleteNotice = async (req, res) => {
    try {
        const result = await getDocumentById(COLLECTIONS.NOTICES, req.params.id);
        await deleteDocument(COLLECTIONS.NOTICES, req.params.id);
        res.send(result);
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json(error);
    }
}

const deleteNotices = async (req, res) => {
    try {
        const notices = await queryDocuments(COLLECTIONS.NOTICES, [
            { field: 'school', operator: '==', value: req.params.id }
        ]);
        
        if (notices.length === 0) {
            res.send({ message: "No notices found to delete" });
        } else {
            for (const notice of notices) {
                await deleteDocument(COLLECTIONS.NOTICES, notice.id);
            }
            res.send({ deletedCount: notices.length });
        }
    } catch (error) {
        console.error('Delete notices error:', error);
        res.status(500).json(error);
    }
}

module.exports = { noticeCreate, noticeList, getNoticeDetail, updateNotice, deleteNotice, deleteNotices };
