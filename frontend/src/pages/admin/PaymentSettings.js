import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    Divider,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import { Save, QrCode, AccountBalance, Payment } from '@mui/icons-material';
import axios from 'axios';
import Popup from '../../components/Popup';
import QRCode from 'qrcode';

const PaymentSettings = () => {
    const { currentUser } = useSelector(state => state.user);
    const [settings, setSettings] = useState({
        upiId: '',
        qrCodeImage: '',
        phonePeEnabled: false,
        phonePeNumber: '',
        paytmEnabled: false,
        paytmNumber: '',
        bankDetails: {
            accountName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: ''
        },
        instructions: ''
    });
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [qrPreview, setQrPreview] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/PaymentSettings/${currentUser._id}`
            );
            const fetchedSettings = response.data;
            // Ensure bankDetails exists with default values
            setSettings({
                ...fetchedSettings,
                bankDetails: fetchedSettings.bankDetails || {
                    accountName: '',
                    accountNumber: '',
                    ifscCode: '',
                    bankName: '',
                    branch: ''
                }
            });
            setQrPreview(fetchedSettings.qrCodeImage || '');
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            // Generate QR code from UPI ID if UPI ID is provided
            let qrCodeImage = settings.qrCodeImage;
            if (settings.upiId && settings.upiId.trim() !== '') {
                // Generate UPI payment URL
                const upiUrl = `upi://pay?pa=${settings.upiId}&pn=School&cu=INR`;
                // Generate QR code as base64 image
                qrCodeImage = await QRCode.toDataURL(upiUrl, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
            }

            await axios.put(
                `${process.env.REACT_APP_BASE_URL}/PaymentSettings/${currentUser._id}`,
                {
                    ...settings,
                    qrCodeImage: qrCodeImage
                }
            );
            setMessage('Payment settings updated successfully! QR code generated from UPI ID.');
            setShowPopup(true);
            // Update preview with generated QR code
            setQrPreview(qrCodeImage);
        } catch (error) {
            console.error('Error updating settings:', error);
            setMessage('Error updating settings');
            setShowPopup(true);
        }
    };

    const handleQRCodeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setSettings({ ...settings, qrCodeImage: base64String });
                setQrPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Payment Gateway Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom sx={{ marginBottom: 3 }}>
                Configure payment methods that students can use to pay fees
            </Typography>

            <Grid container spacing={3}>
                {/* UPI Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                                <Payment color="primary" />
                                <Typography variant="h6">UPI Payment</Typography>
                            </Box>
                            <Divider sx={{ marginBottom: 2 }} />
                            <TextField
                                fullWidth
                                label="UPI ID"
                                value={settings.upiId}
                                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                                placeholder="example@upi"
                                margin="normal"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* QR Code */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                                <QrCode color="primary" />
                                <Typography variant="h6">QR Code (Auto-Generated)</Typography>
                            </Box>
                            <Divider sx={{ marginBottom: 2 }} />
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                QR code will be automatically generated from your UPI ID when you save.
                            </Typography>
                            {qrPreview && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                    <img 
                                        src={qrPreview} 
                                        alt="QR Code Preview" 
                                        style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '8px' }}
                                    />
                                </Box>
                            )}
                            {!qrPreview && settings.upiId && (
                                <Box sx={{ marginTop: 2, padding: 2, backgroundColor: '#e3f2fd', borderRadius: 1, textAlign: 'center' }}>
                                    <Typography variant="body2" color="primary">
                                        QR code will be generated when you click Save
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* PhonePe Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ bgcolor: '#5f259f' }}>P</Avatar>
                                    <Typography variant="h6">PhonePe</Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.phonePeEnabled}
                                            onChange={(e) => setSettings({ ...settings, phonePeEnabled: e.target.checked })}
                                        />
                                    }
                                    label="Enable"
                                />
                            </Box>
                            <Divider sx={{ marginBottom: 2 }} />
                            <TextField
                                fullWidth
                                label="PhonePe Number"
                                value={settings.phonePeNumber}
                                onChange={(e) => setSettings({ ...settings, phonePeNumber: e.target.value })}
                                placeholder="+91 XXXXXXXXXX"
                                disabled={!settings.phonePeEnabled}
                                margin="normal"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Paytm Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ bgcolor: '#00baf2' }}>P</Avatar>
                                    <Typography variant="h6">Paytm</Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.paytmEnabled}
                                            onChange={(e) => setSettings({ ...settings, paytmEnabled: e.target.checked })}
                                        />
                                    }
                                    label="Enable"
                                />
                            </Box>
                            <Divider sx={{ marginBottom: 2 }} />
                            <TextField
                                fullWidth
                                label="Paytm Number"
                                value={settings.paytmNumber}
                                onChange={(e) => setSettings({ ...settings, paytmNumber: e.target.value })}
                                placeholder="+91 XXXXXXXXXX"
                                disabled={!settings.paytmEnabled}
                                margin="normal"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Bank Details */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                                <AccountBalance color="primary" />
                                <Typography variant="h6">Bank Details (Optional)</Typography>
                            </Box>
                            <Divider sx={{ marginBottom: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Account Holder Name"
                                        value={settings.bankDetails?.accountName || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            bankDetails: { ...settings.bankDetails, accountName: e.target.value }
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Account Number"
                                        value={settings.bankDetails?.accountNumber || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            bankDetails: { ...settings.bankDetails, accountNumber: e.target.value }
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="IFSC Code"
                                        value={settings.bankDetails?.ifscCode || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            bankDetails: { ...settings.bankDetails, ifscCode: e.target.value }
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Bank Name"
                                        value={settings.bankDetails?.bankName || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            bankDetails: { ...settings.bankDetails, bankName: e.target.value }
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Branch"
                                        value={settings.bankDetails?.branch || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            bankDetails: { ...settings.bankDetails, branch: e.target.value }
                                        })}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Payment Instructions */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Payment Instructions for Students
                            </Typography>
                            <Divider sx={{ marginBottom: 2 }} />
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Instructions"
                                value={settings.instructions}
                                onChange={(e) => setSettings({ ...settings, instructions: e.target.value })}
                                placeholder="Enter instructions for students on how to make payments..."
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Save Button */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Save />}
                        onClick={handleSave}
                        fullWidth
                    >
                        Save Payment Settings
                    </Button>
                </Grid>
            </Grid>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default PaymentSettings;
