# Admin Fee Structure Setup Guide

## Step-by-Step Guide for Setting Up Student Fees

### Step 1: Create Fee Structure
1. Login as Admin
2. Navigate to "Fees Collection" in the sidebar
3. Click "Add Fee Structure" button
4. Fill in the required fields:
   - **Fee Name**: e.g., "Annual Tuition Fee", "Monthly Fee", etc.
   - **Fee Type**: Select from dropdown (Tuition Fee, Exam Fee, Transport Fee, Library Fee, Sports Fee, Other)
   - **Amount**: Enter the fee amount (e.g., 10000)
   - **Class**: Select the class this fee applies to (or leave empty for all classes)
   - **Frequency**: Select how often this fee is charged (Monthly, Quarterly, Half-Yearly, Yearly, One-Time)
   - **Due Date**: (Optional) Set a due date for payment
   - **Description**: (Optional) Add any additional details
5. Click "Save" or "Submit"

### Step 2: Configure Payment Methods
1. Navigate to "Payment Settings" in the sidebar
2. Configure at least one payment method:
   - **UPI**: Enter UPI ID (e.g., school@upi)
   - **QR Code**: Upload a QR code image for payments
   - **PhonePe**: Enable and enter PhonePe number
   - **Paytm**: Enable and enter Paytm number
   - **Bank Details**: (Optional) Add bank account details
3. Add payment instructions for students
4. Click "Save Payment Settings"

### Step 3: Verify Student Can See Fees
1. Login as a student (or ask a student to check)
2. Navigate to "Fee Payment" in the sidebar
3. Student should see:
   - Fee summary cards (Total, Paid, Pending, Status)
   - Fee structure details
   - "Make Payment" button (if pending amount > 0)

## Important Notes

### Fee Structure Requirements:
- **Must assign to a class**: Fee structure should be assigned to the student's class
- **Or leave class empty**: To apply fee to all students regardless of class
- **School ID**: Automatically set based on logged-in admin

### Common Issues:

#### Issue: Student sees "No Fee Structure Found"
**Cause**: No fee structure created for student's class
**Solution**: 
- Create fee structure and assign to student's class
- OR create fee structure without class assignment (applies to all)

#### Issue: Student sees fee but no payment methods
**Cause**: Payment methods not configured
**Solution**: Go to Payment Settings and configure at least one method

#### Issue: Payment fails
**Cause**: Missing required fields
**Solution**: Ensure fee structure has:
- Valid amount
- Assigned to correct class
- School ID is set

## Example Fee Structure Setup

### Example 1: Annual Tuition Fee
```
Fee Name: Annual Tuition Fee 2024-25
Fee Type: Tuition Fee
Amount: 50000
Class: Class 10A
Frequency: Yearly
Due Date: 2024-04-30
Description: Annual tuition fee for academic year 2024-25
```

### Example 2: Monthly Fee
```
Fee Name: Monthly Fee - March 2024
Fee Type: Tuition Fee
Amount: 5000
Class: Class 10A
Frequency: Monthly
Due Date: 2024-03-10
Description: Monthly tuition and other charges
```

### Example 3: Transport Fee (All Classes)
```
Fee Name: Transport Fee 2024
Fee Type: Transport Fee
Amount: 12000
Class: (Leave empty for all classes)
Frequency: Yearly
Due Date: 2024-04-15
Description: Annual transport charges
```

## Testing Checklist

- [ ] Fee structure created with all required fields
- [ ] Fee structure assigned to correct class (or all classes)
- [ ] Payment methods configured in Payment Settings
- [ ] Student can see fee structure details
- [ ] Student can see payment methods
- [ ] Student can make payment
- [ ] Payment is recorded in history
- [ ] Pending amount decreases after payment

## Data Flow

1. Admin creates fee structure → Stored in database
2. Student opens Fee Payment page → Fetches fee structures for their class
3. System calculates: Total, Paid, Pending amounts
4. Student makes payment → Records payment with fee structure reference
5. System updates: Paid amount increases, Pending decreases

## Support

If students still cannot see fees after following this guide:
1. Check browser console for errors (F12)
2. Verify backend server is running
3. Check database has fee structure records
4. Verify student's class matches fee structure class
5. Check logs for any error messages
