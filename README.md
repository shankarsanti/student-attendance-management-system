<h1 align="center">
    STUDENT MANAGEMENT SYSTEM
</h1>

<h3 align="center">
Streamline student management, class organization, and add students and faculty.<br>
Seamlessly track attendance, assess performance, and provide feedback. <br>
Access records, view marks, and communicate effortlessly.
</h3>

<p>
  <a href="https://youtu.be/ol650KwQkgY?si=rKcboqSv3n-e4UbC">Youtube Video</a>
</p>

<p>
  <a href="https://www.linkedin.com/in/yogndrr/">LinkedIn</a>
</p>

# About

The Student Management System is a comprehensive web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It streamlines school management, class organization, and facilitates seamless communication between students, teachers, and administrators.

## 🚀 Quick Links

- **[Quick Deployment Guide](QUICK_DEPLOY.md)** - Deploy in 10 minutes
- **[Detailed Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Fix 404 Errors](VERCEL_DEPLOYMENT_FIX.md)** - Troubleshoot deployment issues
- **[Run Deployment Check](check-deployment.sh)** - Verify your setup before deploying

## ✨ Key Features

### 👥 User Management
- **Three User Roles:** Admin, Teacher, and Student with specific functionalities
- **Admin Dashboard:** Complete control over students, teachers, classes, and subjects
- **Profile Management:** Enhanced profile pages with modern UI for all user types

### 📊 Academic Management

#### For Teachers:
- **Test/Exam Management:** Create, schedule, and conduct tests with automatic result calculation
- **Lesson Scheduling:** Plan and organize lessons with topics, objectives, materials, and homework
- **Attendance Tracking:** Mark and track student attendance with comprehensive reports
- **Performance Assessment:** Provide marks, feedback, and track student progress
- **Attendance Reports:** Filter by date range, view statistics, and search students

#### For Students:
- **Test View:** View scheduled tests, completed tests, marks, and performance
- **Lesson Access:** See today's lessons, upcoming lessons, and lesson details
- **Performance Tracking:** Visualize academic performance through interactive charts
- **Attendance View:** Check attendance records and percentage

### 💰 Fee Management System

#### Admin Features:
- **Fee Structure Management:** Create, update, and delete fee structures
- **Payment Settings:** Configure multiple payment methods (UPI, PhonePe, Paytm, Bank Transfer)
- **Auto QR Code Generation:** Automatically generate QR codes from UPI ID
- **Payment History:** View all payments across the school
- **Fee Defaulters:** Track students with pending fees

#### Student Features:
- **Fee Dashboard:** View all assigned fee structures with individual status
- **Multiple Payment Methods:** Pay via UPI, PhonePe, Paytm, QR Code, or Bank Transfer
- **Payment History:** Track all payments made
- **PDF Receipt Download:** Generate and download professional payment receipts
- **Real-time Updates:** Refresh button to get latest payment settings

### 📄 Payment Receipt System
- **Professional PDF Receipts:** Auto-generated receipts with school branding
- **Complete Information:** Student details, payment info, fee breakdown
- **Amount in Words:** Indian numbering format (Lakhs, Thousands)
- **Unique Filenames:** Timestamped receipts for easy organization
- **Print Ready:** High-quality PDF format for printing

### 📱 Communication
- **Notice Board:** Administrators can post notices for students and teachers
- **Complain System:** Students can submit complaints and track their status
- **Direct Messaging:** Effective communication between all user types

### 📈 Data Visualization
- **Interactive Charts:** Students visualize performance through charts and graphs
- **Attendance Analytics:** Color-coded performance indicators (Green/Yellow/Red)
- **Dashboard Cards:** Modern, clickable cards with real-time data
- **Progress Tracking:** Track academic progress over time

## 🚀 New Features (Latest Update)

### Fee Management Enhancements
- ✅ Multiple fee structures support (Tuition, Exam, Library, etc.)
- ✅ Aggregated fee display showing all fees at once
- ✅ Individual status tracking per fee (Paid/Partial/Pending)
- ✅ Grand total calculation across all fees
- ✅ Delete fee structures with confirmation dialog

### Payment System
- ✅ Auto QR code generation from UPI ID
- ✅ Multiple payment gateway support
- ✅ Real-time payment method updates
- ✅ Professional PDF receipt generation
- ✅ Amount to words conversion (Indian format)

### UI/UX Improvements
- ✅ Enhanced profile pages with gradient headers
- ✅ Modern card-based layouts
- ✅ Color-coded status indicators
- ✅ Responsive design for all screen sizes
- ✅ Improved navigation and user flow

## 🛠 Technologies Used

### Frontend
- **React.js** - UI library
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Router** - Navigation
- **Recharts** - Data visualization
- **jsPDF** - PDF generation
- **QRCode** - QR code generation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📚 Documentation

### Quick Start
- [Quick Start Guide](docs/QUICK_START.md) - Get started in minutes
- [Installation Guide](#installation) - Detailed setup instructions

### Feature Documentation
- [Payment System Guide](PAYMENT_FEATURE_COMPLETE_GUIDE.md) - Complete payment system documentation
- [Payment Receipt Feature](PAYMENT_RECEIPT_FEATURE.md) - Receipt generation guide
- [Test Management](TEST_FEATURE_SUMMARY.md) - Test/exam system documentation
- [Lesson Scheduling](LESSON_SCHEDULING_FEATURE_SUMMARY.md) - Lesson planning guide
- [Student Features](STUDENT_TESTS_LESSONS_FEATURE_SUMMARY.md) - Student-side features

### Technical Documentation
- [Project Structure](docs/PROJECT_STRUCTURE.md) - Directory structure
- [Scripts Guide](docs/SCRIPTS_GUIDE.md) - Utility scripts
- [Seed Data Instructions](docs/SEED_DATA_INSTRUCTIONS.md) - Database seeding
- [MongoDB Connection Fix](MONGODB_CONNECTION_FIX.md) - Database setup troubleshooting

### Bug Fixes & Updates
- [Fee Structure Delete Fix](FEE_STRUCTURE_DELETE_FIX.md)
- [Fee Structure Display Fix](FEE_STRUCTURE_DISPLAY_FIX.md)
- [Payment Troubleshooting](PAYMENT_TROUBLESHOOTING.md)

## 📁 Project Structure

```
MERN-School-Management-System/
├── backend/
│   ├── controllers/          # Business logic
│   │   ├── admin-controller.js
│   │   ├── student_controller.js
│   │   ├── teacher-controller.js
│   │   ├── fee-controller.js
│   │   ├── test-controller.js
│   │   ├── lesson-controller.js
│   │   └── payment-settings-controller.js
│   ├── models/              # Database schemas
│   │   ├── studentSchema.js
│   │   ├── teacherSchema.js
│   │   ├── feeStructureSchema.js
│   │   ├── feePaymentSchema.js
│   │   ├── testSchema.js
│   │   ├── lessonSchema.js
│   │   └── paymentSettingsSchema.js
│   ├── routes/              # API routes
│   ├── middleware/          # Authentication middleware
│   ├── scripts/             # Utility scripts
│   │   ├── seed-data.js
│   │   ├── test-payment-settings.js
│   │   ├── check-student-fees.js
│   │   └── test-mongodb-connection.js
│   └── index.js             # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/       # Admin pages
│   │   │   │   ├── PaymentSettings.js
│   │   │   │   └── feeRelated/
│   │   │   ├── teacher/     # Teacher pages
│   │   │   │   ├── TeacherTests.js
│   │   │   │   ├── TeacherLessons.js
│   │   │   │   └── TeacherAttendance.js
│   │   │   └── student/     # Student pages
│   │   │       ├── StudentFees.js
│   │   │       ├── StudentTests.js
│   │   │       └── StudentLessons.js
│   │   ├── components/      # Reusable components
│   │   ├── redux/           # State management
│   │   └── App.js
│   └── package.json
│
└── docs/                    # Documentation
```

# 🚀 Installation

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Clone the Repository

```bash
git clone https://github.com/shankarsanti/student-attendance-management-system.git
cd MERN-School-Management-System
```

## Backend Setup

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Create `.env` file in backend folder:
```env
MONGO_URL=mongodb://127.0.0.1:27017/smsproject
SECRET_KEY=secret123key
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
FRONTEND_URL=http://localhost:3000
```

3. Start the backend:
```bash
npm start
```

Backend runs at `http://localhost:5001`

## Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Create `.env` file in frontend folder:
```env
REACT_APP_BASE_URL=http://localhost:5001
```

3. Start the frontend:
```bash
npm start
```

Frontend runs at `http://localhost:3000`

## 🗄️ Database Setup

### Option 1: Local MongoDB (Recommended for Development)

1. Install MongoDB Community Server from [mongodb.com](https://mongodb.com/try/download/community)

2. Start MongoDB service:
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

3. Use connection string:
```
MONGO_URL=mongodb://127.0.0.1:27017/smsproject
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get connection string from: Database → Connect → Connect your application
4. Update `.env`:
```
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smsproject?retryWrites=true&w=majority
```

### Seed Database (Optional)

Populate database with sample data:

```bash
cd backend
node scripts/seed-data.js
```

This creates:
- 1 Admin account
- 5 Classes
- 10 Teachers
- 50 Students
- Multiple subjects, tests, and lessons

## 🧪 Testing the Application

### Test MongoDB Connection
```bash
cd backend
node scripts/test-mongodb-connection.js
```

### Test Payment Settings
```bash
cd backend
node scripts/test-payment-settings.js
```

### Check Student Fees
```bash
cd backend
node scripts/check-student-fees.js
```

## 🎯 Quick Start Guide

### 1. Admin Login
- Email: `admin@school.com`
- Password: `admin123`

### 2. Teacher Login
- Email: `teacher@school.com`
- Password: `teacher123`

### 3. Student Login
- Email: `student@school.com`
- Password: `student123`

### 4. Test Payment System
1. Login as Admin
2. Go to "Payment Settings"
3. Configure payment methods (UPI, PhonePe, Paytm)
4. Login as Student
5. Go to "Fee Payment"
6. Make a test payment
7. Download receipt

## 🌟 Key Features Walkthrough

### For Administrators

1. **Dashboard**: Overview of students, teachers, classes, and subjects
2. **Student Management**: Add, edit, delete students
3. **Teacher Management**: Manage teacher accounts and assignments
4. **Class Management**: Create and organize classes
5. **Subject Management**: Add subjects and assign to classes
6. **Fee Management**: 
   - Create fee structures
   - Configure payment methods
   - View payment history
   - Track fee defaulters
7. **Notice Board**: Post announcements
8. **Reports**: Generate various reports

### For Teachers

1. **Dashboard**: Overview of classes and students
2. **Test Management**:
   - Create tests with multiple questions
   - Schedule tests for classes
   - Enter marks and calculate results
   - View test analytics
3. **Lesson Planning**:
   - Schedule lessons with topics and objectives
   - Add materials and homework
   - Track lesson completion
4. **Attendance**:
   - Mark daily attendance
   - View attendance reports
   - Filter by date range
   - Search students
5. **Performance Tracking**: Monitor student progress

### For Students

1. **Dashboard**: Overview of tests, lessons, and attendance
2. **Tests**:
   - View scheduled tests
   - See test results and marks
   - Track performance with color indicators
3. **Lessons**:
   - View today's lessons
   - See upcoming lessons
   - Access lesson materials and homework
4. **Fee Payment**:
   - View all fee structures
   - See payment status (Paid/Partial/Pending)
   - Make payments via multiple methods
   - Download PDF receipts
5. **Attendance**: Check attendance records
6. **Subjects**: View enrolled subjects
7. **Notices**: Read school announcements

## 🎨 UI Features

- **Modern Design**: Clean, professional interface with Material-UI
- **Responsive**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: Prepared for dark mode implementation
- **Color Coding**: 
  - 🟢 Green: Good performance (≥75%)
  - 🟡 Yellow: Average (50-74%)
  - 🔴 Red: Needs improvement (<50%)
- **Interactive Charts**: Visual data representation
- **Real-time Updates**: Live data refresh
- **Smooth Animations**: Enhanced user experience

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt encryption
- **Role-based Access**: Different permissions for each role
- **Protected Routes**: Unauthorized access prevention
- **Input Validation**: Server-side validation
- **XSS Protection**: Sanitized inputs

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 💻 Desktop (1920px and above)
- 💻 Laptop (1366px - 1920px)
- 📱 Tablet (768px - 1366px)
- 📱 Mobile (320px - 768px)

## 🚀 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables from `.env`
7. Deploy

### Frontend Deployment (Netlify)

1. Push code to GitHub
2. Create new site on Netlify
3. Connect repository
4. Set build command: `npm run build`
5. Set publish directory: `build`
6. Add environment variable: `REACT_APP_BASE_URL=https://your-backend-url`
7. Deploy

### Alternative: Vercel

Same process as Netlify with similar configuration.

## 🐛 Troubleshooting

### MongoDB Connection Issues
See [MONGODB_CONNECTION_FIX.md](MONGODB_CONNECTION_FIX.md)

### Payment System Issues
See [PAYMENT_TROUBLESHOOTING.md](PAYMENT_TROUBLESHOOTING.md)

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

**MongoDB not connecting:**
```bash
# Check MongoDB status
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community
```

**Dependencies issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Quick Deployment (10 minutes)

Follow the **[Quick Deployment Guide](QUICK_DEPLOY.md)** for a streamlined deployment process.

### Detailed Deployment

For comprehensive deployment instructions, see **[Deployment Guide](DEPLOYMENT_GUIDE.md)**.

### Troubleshooting

Getting 404 errors after deployment? Check **[Vercel Deployment Fix](VERCEL_DEPLOYMENT_FIX.md)**.

### Pre-Deployment Check

Run the deployment checker before deploying:
```bash
./check-deployment.sh
```

### Deployment Platforms

- **Backend:** Render, Railway, or Heroku
- **Frontend:** Vercel or Netlify
- **Database:** MongoDB Atlas (recommended for production)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Shankar Laxman Santi**
- GitHub: [@shankarsanti](https://github.com/shankarsanti)
- Repository: [student-attendance-management-system](https://github.com/shankarsanti/student-attendance-management-system)

## 🙏 Acknowledgments

- Original project inspiration from [Yogndrr](https://github.com/Yogndrr)
- Material-UI for the component library
- MongoDB for the database
- All contributors and users

## 📞 Support

For support, email shankarsanti@example.com or open an issue on GitHub.

## 🔄 Version History

### v2.0.0 (Latest) - March 2026
- ✅ Complete fee management system
- ✅ Payment gateway integration
- ✅ PDF receipt generation
- ✅ Test/exam management
- ✅ Lesson scheduling
- ✅ Enhanced UI/UX
- ✅ Multiple bug fixes

### v1.0.0 - Initial Release
- Basic student management features
- Student, teacher, admin roles
- Attendance tracking
- Performance assessment

---

<p align="center">Made with ❤️ for better student management</p>
