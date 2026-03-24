const PaymentSettings = require('../models/paymentSettingsSchema');

// Get payment settings for a school
const getPaymentSettings = async (req, res) => {
    try {
        console.log('Fetching payment settings for school:', req.params.schoolId);
        let settings = await PaymentSettings.findOne({ school: req.params.schoolId });
        
        if (!settings) {
            console.log('No payment settings found, creating default');
            // Create default settings if not exists
            settings = new PaymentSettings({
                school: req.params.schoolId
            });
            await settings.save();
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
        
        let settings = await PaymentSettings.findOne({ school: req.params.schoolId });
        
        if (!settings) {
            console.log('Creating new payment settings');
            settings = new PaymentSettings({
                school: req.params.schoolId,
                ...req.body
            });
        } else {
            console.log('Updating existing payment settings');
            // Update fields, treating empty strings as valid updates
            if (req.body.upiId !== undefined) settings.upiId = req.body.upiId;
            if (req.body.qrCodeImage !== undefined) settings.qrCodeImage = req.body.qrCodeImage;
            if (req.body.phonePeEnabled !== undefined) settings.phonePeEnabled = req.body.phonePeEnabled;
            if (req.body.phonePeNumber !== undefined) settings.phonePeNumber = req.body.phonePeNumber;
            if (req.body.paytmEnabled !== undefined) settings.paytmEnabled = req.body.paytmEnabled;
            if (req.body.paytmNumber !== undefined) settings.paytmNumber = req.body.paytmNumber;
            if (req.body.bankDetails !== undefined) settings.bankDetails = req.body.bankDetails;
            if (req.body.instructions !== undefined) settings.instructions = req.body.instructions;
        }
        
        await settings.save();
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
