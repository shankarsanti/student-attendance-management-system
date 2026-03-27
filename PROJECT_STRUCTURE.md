# School Management System - Project Structure

## 📁 Clean Project Structure

```
MERN-School-Management-System/
├── backend/                      # Express.js Backend API
│   ├── config/                   # Configuration files
│   │   ├── firebase.js          # Firebase Admin SDK setup
│   │   └── .gitkeep             # Placeholder for serviceAccountKey.json
│   ├── controllers/             # Route controllers (Firebase-based)
│   │   ├── admin-controller.js          ✅ Converted
│   │   ├── auth-controller.js           ✅ Converted
│   │   ├── class-controller.js          ✅ Converted
│   │   ├── complain-controller.js       ✅ Converted
│   │   ├── fee-controller.js            ✅ Converted
│   │   ├── lesson-controller.js         ✅ Converted
│   │   ├── notice-controller.js         ✅ Converted
│   │   ├── password-controller.js       ✅ Converted
│   │   ├── payment-settings-controller.js ✅ Converted
│   │   ├── student_controller.js        ✅ Converted
│   │   ├── subject-controller.js        ✅ Converted
│   │   ├── teacher-controller.js        ✅ Converted
│   │   └── test-controller.js           ✅ Converted
│   ├── middleware/              # Express middleware
│   │   └── auth.js             # JWT authentication
│   ├── models/                  # Data models
│   │   └── firebase/           # Firebase helpers
│   │       ├── collections.js  # Collection name constants
│   │       └── helpers.js      # CRUD helper functions
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js
│   │   ├── passwordRoutes.js
│   │   └── route.js
│   ├── scripts/                 # Utility scripts
│   │   └── test-firebase-connection.js
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── index.js                 # Express app entry point
│   ├── package.json
│   └── vercel.json             # Vercel deployment config
│
├── frontend/                    # React.js Frontend
│   ├── public/                  # Static files
│   │   ├── _redirects          # Netlify redirects
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/                     # React source code
│   │   ├── assets/             # Images and static assets
│   │   ├── components/         # Reusable React components
│   │   ├── config/             # Configuration
│   │   │   └── firebase.js    # Firebase client SDK
│   │   ├── pages/              # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── student/       # Student pages
│   │   │   └── teacher/       # Teacher pages
│   │   ├── redux/              # Redux state management
│   │   ├── App.js              # Main App component
│   │   └── index.js            # React entry point
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── netlify.toml            # Netlify deployment config
│   ├── package.json
│   └── README.md
│
├── .gitignore                   # Root gitignore
├── netlify.toml                 # Netlify config
└── README.md                    # Project documentation
```

## 🔥 Firebase Setup

### Backend Configuration
- **Location**: `backend/config/firebase.js`
- **Required**: `backend/config/serviceAccountKey.json` (download from Firebase Console)
- **Environment**: `backend/.env`

### Frontend Configuration
- **Location**: `frontend/src/config/firebase.js`
- **Environment**: `frontend/.env`

## 🗄️ Database: Firebase Firestore

### Collections:
- `admins` - School administrators
- `students` - Student records
- `teachers` - Teacher records
- `classes` - Class/Grade information
- `subjects` - Subject information
- `notices` - School notices
- `complains` - Complaints/feedback
- `lessons` - Lesson plans
- `tests` - Tests and assessments
- `feeStructures` - Fee structures
- `feePayments` - Fee payments
- `paymentSettings` - Payment gateway settings

## 🚀 Running the Application

### Development

**Backend:**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5001
```

**Frontend:**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Production

**Backend (Vercel):**
```bash
cd backend
vercel --prod
```

**Frontend (Netlify):**
```bash
cd frontend
netlify deploy --prod
```

## 📝 Environment Variables

### Backend (.env)
```env
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
PORT=5001
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_BASE_URL=http://localhost:5001
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 🔧 Key Features

- ✅ Firebase Firestore database
- ✅ JWT authentication
- ✅ Role-based access (Admin, Teacher, Student)
- ✅ Class management
- ✅ Student management
- ✅ Teacher management
- ✅ Attendance tracking
- ✅ Fee management
- ✅ Notice board
- ✅ Complaint system
- ✅ Lesson planning
- ✅ Test management

## 📚 Tech Stack

### Backend
- Node.js
- Express.js
- Firebase Admin SDK
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React.js
- Material-UI
- Redux for state management
- Firebase SDK
- Axios for API calls

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Firebase security rules
- Environment variables for sensitive data
- CORS configuration

## 📦 Dependencies

See `package.json` files in backend and frontend directories for complete dependency lists.

## 🆘 Support

For issues or questions, refer to the README.md file or check the Firebase Console for database status.
