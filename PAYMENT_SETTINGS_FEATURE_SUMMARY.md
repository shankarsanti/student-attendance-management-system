# Payment Settings & Student Fee Payment Feature

## Overview
Complete payment gateway configuration system allowing admins to set up multiple payment methods (PhonePe, Paytm, UPI, QR Code, Bank Transfer) that students can use to pay their fees.

## Features Implemented

### Admin Side - Payment Settings Configuration
**File**: `frontend/src/pages/admin/PaymentSettings.js`

#### Features:
1. **UPI Payment Configuration**
   - Admin can add/edit UPI ID
   - Displayed to students during payment

2. **QR Code Upload**
   - Admin can upload payment QR code image
   - Image stored as base64 in database
   - Preview shown in admin panel
   - Students can scan QR code to make payment

3. **PhonePe Integration**
   - Enable/disable toggle
   - PhonePe number configuration
   - Branded with PhonePe purple color (#5f259f)

4. **Paytm Integration**
   - Enable/disable toggle
   - Paytm number configuration
   - Branded with Paytm blue color (#00baf2)

5. **Bank Details (Optional)**
   - Account holder name
   - Account number
   - IFSC code
   - Bank name
   - Branch name

6. **Payment Instructions**
   - Custom instructions for students
   - Displayed in payment dialog

#### UI Components:
- Modern card-based layout
- Icon-based sections (Payment, QrCode, AccountBalance)
- Toggle switches for enabling/disabling methods
- Image upload with preview
- Save button with success/error feedback

### Student Side - Fee Payment
**File**: `frontend/src/pages/student/StudentFees.js`

#### Features:
1. **Fee Summary Dashboard**
   - Total Fee card
   - Paid Amount card (green)
   - Pending Amount card (red)
   - Payment Status chip (Paid/Partial/Pending)

2. **Fee Structure Display**
   - Academic year
   - Class information
   - Breakdown: Tuition, Transport, Library, Lab, Other fees
   - Total amount calculation

3. **Payment Dialog**
   - Amount input (max: pending amount)
   - Dynamic payment method cards based on admin settings
   - Only enabled methods are shown
   - Visual selection with border highlight

4. **Payment Methods Display**
   - **UPI**: Shows UPI ID if configured
   - **PhonePe**: Shows number if enabled
   - **Paytm**: Shows number if enabled
   - **QR Code**: Large scannable image if uploaded
   - **Bank Transfer**: Complete bank details if configured

5. **Payment Instructions**
   - Admin-configured instructions displayed
   - Highlighted in gray box

6. **Transaction Recording**
   - Transaction ID/Reference number input (required)
   - Payment method selection
   - Amount validation
   - Success/error feedback

7. **Payment History**
   - Table view of all payments
   - Date, Amount, Method, Transaction ID
   - Download receipt button (placeholder)

### Backend Implementation

#### Payment Settings Schema
**File**: `backend/models/paymentSettingsSchema.js`

```javascript
{
  school: ObjectId (ref: Admin),
  upiId: String,
  qrCodeImage: String (base64),
  phonePeEnabled: Boolean,
  phonePeNumber: String,
  paytmEnabled: Boolean,
  paytmNumber: String,
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String
  },
  instructions: String
}
```

#### Payment Settings Controller
**File**: `backend/controllers/payment-settings-controller.js`

**Functions**:
1. `getPaymentSettings(schoolId)` - Get settings for a school (creates default if not exists)
2. `updatePaymentSettings(schoolId)` - Update payment settings

#### Routes
**File**: `backend/routes/route.js`

```javascript
GET  /PaymentSettings/:schoolId  - Get payment settings
PUT  /PaymentSettings/:schoolId  - Update payment settings
```

### Admin Dashboard Integration

#### AdminDashboard.js
- Added import for PaymentSettings component
- Added route: `/Admin/paymentsettings`

#### SideBar.js
- Added "Payment Settings" menu item
- Icon: SettingsIcon
- Positioned after "Fees Collection"
- Active state highlighting

## User Flow

### Admin Configuration Flow:
1. Admin logs in
2. Navigates to "Payment Settings" from sidebar
3. Configures desired payment methods:
   - Enters UPI ID
   - Uploads QR code image
   - Enables PhonePe/Paytm and enters numbers
   - Optionally adds bank details
   - Adds payment instructions
4. Clicks "Save Payment Settings"
5. Settings are stored and available to all students

### Student Payment Flow:
1. Student logs in
2. Navigates to "Fee Payment" from dashboard or sidebar
3. Views fee summary and structure
4. Clicks "Make Payment" button
5. Enters payment amount
6. Sees only enabled payment methods from admin settings
7. Selects preferred payment method
8. Makes payment using displayed details (UPI/PhonePe/Paytm/QR/Bank)
9. Enters transaction ID/reference number
10. Submits payment
11. Payment recorded in history

## Technical Details

### Data Flow:
1. Admin saves settings → Stored in PaymentSettings collection (linked to school)
2. Student opens fee page → Fetches settings using school ID
3. Payment dialog → Displays only configured methods
4. Student submits → Creates FeePayment record with selected method

### Security:
- School-specific settings (one per school)
- Student can only see their own school's payment methods
- Transaction ID required for payment verification

### UI/UX Features:
- Color-coded status indicators
- Clickable payment method cards
- Visual feedback on selection
- Responsive grid layout
- Image preview for QR codes
- Enable/disable toggles for optional methods
- Validation on amount input

## Files Modified/Created

### Frontend:
- ✅ `frontend/src/pages/admin/PaymentSettings.js` (Created)
- ✅ `frontend/src/pages/admin/AdminDashboard.js` (Modified - added route)
- ✅ `frontend/src/pages/admin/SideBar.js` (Modified - added menu item)
- ✅ `frontend/src/pages/student/StudentFees.js` (Modified - integrated payment methods)

### Backend:
- ✅ `backend/models/paymentSettingsSchema.js` (Created)
- ✅ `backend/controllers/payment-settings-controller.js` (Created)
- ✅ `backend/routes/route.js` (Modified - added routes)

## Testing Checklist

### Admin Side:
- [ ] Navigate to Payment Settings page
- [ ] Add UPI ID and verify save
- [ ] Upload QR code image and verify preview
- [ ] Enable PhonePe, add number, verify save
- [ ] Enable Paytm, add number, verify save
- [ ] Add bank details and verify save
- [ ] Add payment instructions and verify save
- [ ] Disable PhonePe/Paytm and verify they don't show to students

### Student Side:
- [ ] View fee summary cards
- [ ] View fee structure breakdown
- [ ] Click "Make Payment" button
- [ ] Verify only enabled payment methods are shown
- [ ] Verify UPI ID is displayed correctly
- [ ] Verify QR code is displayed and scannable
- [ ] Verify PhonePe number (if enabled)
- [ ] Verify Paytm number (if enabled)
- [ ] Verify bank details (if configured)
- [ ] Verify payment instructions are shown
- [ ] Select payment method and verify border highlight
- [ ] Enter amount and transaction ID
- [ ] Submit payment and verify success message
- [ ] Verify payment appears in history table

## Future Enhancements
1. Actual payment gateway integration (PhonePe/Paytm APIs)
2. Automatic payment verification
3. Receipt generation and download
4. Email notifications on payment
5. Payment reminders
6. Installment payment support
7. Payment gateway webhooks
8. Refund management

## Status
✅ **COMPLETED** - All features implemented and integrated
