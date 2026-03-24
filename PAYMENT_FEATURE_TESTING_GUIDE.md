# Payment Feature Testing Guide

## Quick Start Testing

### Step 1: Admin Configuration
1. Login as Admin
2. Click "Payment Settings" in sidebar
3. Configure payment methods:
   - Add UPI ID: `school@upi`
   - Upload QR code image
   - Enable PhonePe, add number: `+91 9876543210`
   - Enable Paytm, add number: `+91 9876543211`
   - Add bank details (optional)
   - Add instructions: "Please enter correct transaction ID"
4. Click "Save Payment Settings"
5. Verify success message

### Step 2: Student Payment
1. Login as Student
2. Click "Fee Payment" in sidebar or dashboard
3. View fee summary cards
4. Click "Make Payment" button
5. Enter amount (e.g., 5000)
6. Verify all configured payment methods are visible
7. Select a payment method
8. Make payment using displayed details
9. Enter transaction ID
10. Click "Submit Payment"
11. Verify success message
12. Check payment appears in history

## Expected Results
- Admin sees all payment configuration options
- Student sees only enabled payment methods
- QR code is displayed and scannable
- Payment is recorded with selected method
- Payment history shows all transactions

## Common Issues
- If payment methods don't show: Check admin enabled them
- If QR code doesn't show: Verify image was uploaded
- If save fails: Check backend server is running
