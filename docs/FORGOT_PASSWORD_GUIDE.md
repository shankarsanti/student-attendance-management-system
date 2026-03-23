# Forgot Password Feature Guide

## Overview

The forgot password feature allows users to request password resets and enables administrators to reset passwords for all user types (Admin, Teacher, Student).

## Features

### 1. User-Facing Forgot Password
- Accessible from login page via "Forgot password?" link
- Available for Admin and Teacher roles
- Students are directed to contact administrator

### 2. Admin Password Reset Panel
- Admins can reset passwords for any user
- Supports all three roles: Admin, Teacher, Student
- Secure password validation

## How to Use

### For Users (Admin/Teacher)

1. **Access Forgot Password Page**
   - Go to login page
   - Click "Forgot password?" link
   - Enter your email address
   - Submit request

2. **What Happens Next**
   - System verifies your email exists
   - You receive confirmation message
   - Contact your administrator to complete password reset

### For Students

Students should contact their administrator directly with:
- Roll Number
- Full Name
- Request for password reset

### For Administrators

#### Reset Any User Password

1. **Navigate to Reset Password**
   - Login to Admin Dashboard
   - Click "Reset Password" in sidebar (under User section)

2. **Reset Teacher/Admin Password**
   - Select role (Admin or Teacher)
   - Enter email address
   - Enter new password (minimum 6 characters)
   - Confirm password
   - Click "Reset Password"

3. **Reset Student Password**
   - Select role: Student
   - Enter Roll Number
   - Enter Student Name
   - Enter new password (minimum 6 characters)
   - Confirm password
   - Click "Reset Password"

## API Endpoints

### Public Endpoints

#### Forgot Password Request
```
POST /forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "role": "Admin" | "Teacher"
}
```

**Response:**
```json
{
  "message": "Password reset request received. Please contact your administrator.",
  "email": "user@example.com",
  "role": "Admin"
}
```

### Protected Endpoints (Admin Only)

#### Reset User Password
```
POST /reset-password
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "role": "Admin" | "Teacher",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully",
  "email": "user@example.com"
}
```

#### Reset Student Password
```
POST /reset-student-password
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "rollNum": 101,
  "studentName": "John Doe",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Student password reset successfully",
  "rollNum": 101,
  "name": "John Doe"
}
```

## Security Features

1. **Password Requirements**
   - Minimum 6 characters
   - Passwords are hashed using bcrypt
   - Confirmation required before reset

2. **Authorization**
   - Only admins can reset passwords
   - JWT token verification required
   - Role-based access control

3. **Validation**
   - Email format validation
   - User existence verification
   - Password match confirmation

## File Structure

### Frontend Files
```
frontend/src/pages/
├── ForgotPassword.js          # User forgot password page
└── admin/
    └── ResetPassword.js       # Admin password reset panel
```

### Backend Files
```
backend/
├── controllers/
│   └── password-controller.js # Password reset logic
└── routes/
    └── passwordRoutes.js      # Password reset routes
```

## Error Handling

### Common Errors

**User Not Found**
```json
{
  "message": "User not found with this email"
}
```

**Invalid Password**
```json
{
  "message": "Password must be at least 6 characters long"
}
```

**Password Mismatch**
```json
{
  "message": "Passwords do not match"
}
```

**Unauthorized**
```json
{
  "message": "Unauthorized access"
}
```

## Testing

### Test Forgot Password Flow

1. **Test User Request**
   ```bash
   curl -X POST http://localhost:5001/forgot-password \
     -H "Content-Type: application/json" \
     -d '{
       "email": "teacher@example.com",
       "role": "Teacher"
     }'
   ```

2. **Test Admin Reset (requires token)**
   ```bash
   curl -X POST http://localhost:5001/reset-password \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -d '{
       "email": "teacher@example.com",
       "role": "Teacher",
       "newPassword": "newpass123"
     }'
   ```

3. **Test Student Reset (requires token)**
   ```bash
   curl -X POST http://localhost:5001/reset-student-password \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -d '{
       "rollNum": 101,
       "studentName": "John Doe",
       "newPassword": "newpass123"
     }'
   ```

## Troubleshooting

### Issue: "Forgot password?" link not working
**Solution**: Clear browser cache and ensure you're on the latest version

### Issue: Cannot reset password as admin
**Solution**: 
- Verify you're logged in as admin
- Check that JWT token is valid
- Ensure backend server is running

### Issue: Student password reset fails
**Solution**:
- Verify Roll Number is correct
- Ensure Student Name matches exactly (case-sensitive)
- Check that student exists in database

## Future Enhancements

Potential improvements for production:
1. Email integration for password reset links
2. Time-limited reset tokens
3. Password reset history
4. Security questions
5. Two-factor authentication
6. Password strength meter
7. Email notifications on password change

## Best Practices

1. **For Admins**
   - Use strong passwords (8+ characters, mixed case, numbers, symbols)
   - Reset passwords promptly when requested
   - Keep a log of password reset requests
   - Verify user identity before resetting

2. **For Users**
   - Don't share passwords
   - Change default passwords immediately
   - Use unique passwords
   - Contact admin immediately if account compromised

## Support

For issues or questions:
1. Check this documentation
2. Review error messages
3. Contact system administrator
4. Check backend logs for detailed errors

---

**Last Updated**: March 22, 2026
**Version**: 1.0.0
