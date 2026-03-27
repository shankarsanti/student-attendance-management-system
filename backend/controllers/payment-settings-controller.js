const COLLECTIONS = require('../models/firebase/collections');
const { 
    createDocument, 
    getDocumentById, 
    updateDocument,
    queryDocuments
} = require('../models/firebase/helpers');

// Get payment settings for a school
const getPaymentSettings = async (req, res) => {
    try {
        console.log('Fetching payment settings for school:', req.params.schoolId);
        
        const settingsArray = await queryDocuments(COLLECTIONS.PAYMENT_SETTINGS, [
            { field: 'school', operator: '==', value: req.params.schoolId }
        ]);
        
        let settings = settingsArray[0];
        
        if (!settings) {
            console.log('No payment settings found, creating default');
            // Create default settings if not exists
            settings = await createDocument(COLLECTIONS.PAYMENT_SETTINGS, {
                school: req.params.schoolId,
                upiId: '',
                qrCodeImage: '',
                phonePeEnabled: false,
                phonePeNumber: '',
                paytmEnabled: false,
                paytmNumber: '',
                bankDetails: '',
                instructions: ''
            });
        }
        
        console.log('Returning payment settings:', {
            upiId: settings.upiId,
            hasQrCode: !!settings.qrCodeImage,
            phonePeEnabled: settings.phonePeEnabled,
            paytmEnabled: settings.paytmEnabled
        });
        
        res.send(settings);
    } catch (err) {
        console.error('Error fetching payment settings:', err);
        res.status(500).json(err);
    }
};

// Update payment settings
const updatePaymentSettings = async (req, res) => {
    try {
        console.log('Updating payment settings for school:', req.params.schoolId);
        console.log('Request body:', req.body);
        
        const settingsArray = await queryDocuments(COLLECTIONS.PAYMENT_SETTINGS, [
            { field: 'school', operator: '==', value: req.params.schoolId }
        ]);
        
        let settings = settingsArray[0];
        
        if (!settings) {
            console.log('Creating new payment settings');
            settings = await createDocument(COLLECTIONS.PAYMENT_SETTINGS, {
                school: req.params.schoolId,
                ...req.body
            });
        } else {
            console.log('Updating existing payment settings');
            const updates = {};
            
            // Update fields, treating empty strings as valid updates
            if (req.body.upiId !== undefined) updates.upiId = req.body.upiId;
            if (req.body.qrCodeImage !== undefined) updates.qrCodeImage = req.body.qrCodeImage;
            if (req.body.phonePeEnabled !== undefined) updates.phonePeEnabled = req.body.phonePeEnabled;
            if (req.body.phonePeNumber !== undefined) updates.phonePeNumber = req.body.phonePeNumber;
            if (req.body.paytmEnabled !== undefined) updates.paytmEnabled = req.body.paytmEnabled;
            if (req.body.paytmNumber !== undefined) updates.paytmNumber = req.body.paytmNumber;
            if (req.body.bankDetails !== undefined) updates.bankDetails = req.body.bankDetails;
            if (req.body.instructions !== undefined) updates.instructions = req.body.instructions;
            
            await updateDocument(COLLECTIONS.PAYMENT_SETTINGS, settings.id, updates);
            settings = await getDocumentById(COLLECTIONS.PAYMENT_SETTINGS, settings.id);
        }
        
        console.log('Payment settings saved successfully');
        console.log('Saved settings:', {
            upiId: settings.upiId,
            hasQrCode: !!settings.qrCodeImage,
            phonePeEnabled: settings.phonePeEnabled,
            phonePeNumber: settings.phonePeNumber,
            paytmEnabled: settings.paytmEnabled,
            paytmNumber: settings.paytmNumber
        });
        res.send(settings);
    } catch (err) {
        console.error('Error updating payment settings:', err);
        res.status(500).json(err);
    }
};

module.exports = {
    getPaymentSettings,
    updatePaymentSettings
};
