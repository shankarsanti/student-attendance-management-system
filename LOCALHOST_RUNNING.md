# 🚀 Application Running on Localhost

## Status: ✅ RUNNING

### Backend Server
- **URL:** http://localhost:5001
- **Status:** Running
- **MongoDB:** Connected
- **Port:** 5001

### Frontend Server
- **URL:** http://localhost:3000
- **Status:** Running
- **Port:** 3000

## Quick Access

### Open in Browser
- **Frontend:** http://localhost:3000
- **Backend Health Check:** http://localhost:5001/health

### Login Pages
- **Admin Login:** http://localhost:3000/Adminlogin
- **Teacher Login:** http://localhost:3000/Teacherlogin
- **Student Login:** http://localhost:3000/Studentlogin

### Register
- **Admin Register:** http://localhost:3000/Adminregister

## Configuration

### Backend (.env)
```
MONGO_URL=mongodb://127.0.0.1:27017/smsproject
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
PORT=5001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_BASE_URL=http://localhost:5001
```

## Authentication Features

✅ JWT token generation on login
✅ Automatic token attachment to requests
✅ Token stored in localStorage
✅ Auto-logout on token expiration
✅ CORS configured for localhost

## How to Use

### First Time Setup
1. Register an admin at: http://localhost:3000/Adminregister
2. Login with admin credentials
3. Create classes, subjects, teachers, and students
4. Test different user logins

### Test Login
- **Admin:** Use email and password
- **Teacher:** Use email and password
- **Student:** Use roll number, name, and password

## Stop Servers

To stop the running servers, you can:
1. Use the Kiro process manager
2. Or run: `pkill -f "node.*index.js"` and `pkill -f "react-scripts"`

## Restart Servers

If you need to restart:

### Backend
```bash
cd MERN-School-Management-System/backend
npm start
```

### Frontend
```bash
cd MERN-School-Management-System/frontend
npm start
```

## Troubleshooting

### Backend not connecting to MongoDB
```bash
# Check if MongoDB is running
pgrep -x mongod

# If not running, start it
mongod --dbpath /path/to/your/data
```

### Port already in use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Clear cache and restart
```bash
# Frontend
cd frontend
rm -rf node_modules/.cache
npm start

# Backend
cd backend
npm start
```

## Features Available

### Admin Dashboard
- Manage classes, subjects, teachers, students
- View attendance and test results
- Payment settings
- Notice management
- Complaint handling

### Teacher Dashboard
- View assigned classes and subjects
- Create and manage lessons
- Create and grade tests
- Mark attendance
- View student performance

### Student Dashboard
- View lessons and materials
- Take tests
- View test results
- Check attendance
- Fee payment

## API Endpoints

### Authentication
- POST /AdminLogin
- POST /TeacherLogin
- POST /StudentLogin
- POST /AdminReg

### Health Check
- GET /health

### Protected Routes
All other routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Development Notes

- Hot reload enabled for both frontend and backend
- Changes to code will automatically refresh
- Check terminal for any errors
- MongoDB must be running for backend to work

## Next Steps

1. Register an admin user
2. Create school structure (classes, subjects)
3. Add teachers and students
4. Test all features
5. Check authentication flow
6. Verify token handling

Enjoy developing! 🎉
