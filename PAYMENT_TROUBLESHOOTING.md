# Payment Feature Troubleshooting Guide

## Issue: Student Cannot See Payment Methods

### Possible Causes & Solutions:

#### 1. Admin Has Not Configured Payment Methods
**Symptom**: Student sees "No payment methods configured yet"

**Solution**:
- Login as Admin
- Navigate to "Payment Settings" in sidebar
- Configure at least one payment method:
  - Add UPI ID, OR
  - Upload QR Code, OR
  - Enable PhonePe/Paytm with number, OR
  - Add bank details
- Click "Save Payment Settings"

#### 2. School ID Not Found
**Symptom**: Console error "School ID not found"

**Solution**:
- Check if student record has `school` field populated
- Verify student is properly linked to a school/admin

#### 3. Backend Server Not Running
**Symptom**: Network errors in console

**Solution**:
- Start backend server: `cd backend && npm start`
- Verify server is running on correct port
- Check `.env` file has correct `REACT_APP_BASE_URL`

#### 4. Payment Settings API Error
**Symptom**: Console error "Error fetching payment settings"

**Solution**:
- Check backend routes are properly configured
- Verify `/PaymentSettings/:schoolId` endpoint exists
- Check MongoDB connection is active

### How to Test:

1. **Admin Side**:
   ```
   - Login as admin
   - Go to Payment Settings
   - Add UPI ID: test@upi
   - Click Save
   - Verify success message
   ```

2. **Student Side**:
   ```
   - Login as student
   - Go to Fee Payment
   - Click "Make Payment"
   - Should see UPI payment option
   ```

### Debug Steps:

1. Open browser console (F12)
2. Go to Network tab
3. Click "Make Payment" button
4. Check for API calls:
   - `/PaymentSettings/:schoolId` - Should return 200
   - Response should contain payment settings object

5. Check Console tab for errors:
   - "School ID not found" - Student not linked to school
   - "Error fetching payment settings" - Backend issue
   - Network error - Backend not running

### Expected Behavior:

- If NO payment methods configured: Yellow box with message
- If payment methods configured: Cards showing each method
- If loading: "Loading payment methods..." message

### Quick Fix Checklist:

- [ ] Backend server is running
- [ ] Admin has saved payment settings
- [ ] At least one payment method is enabled
- [ ] Student is linked to correct school
- [ ] No console errors
- [ ] API calls returning 200 status
