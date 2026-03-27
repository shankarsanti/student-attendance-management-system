const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { initializeFirebase } = require("./config/firebase")

dotenv.config();

const app = express()
const Routes = require("./routes/route.js")
const AuthRoutes = require("./routes/authRoutes.js")
const PasswordRoutes = require("./routes/passwordRoutes.js")

const PORT = process.env.PORT || 5000

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))

// CORS configuration for production and development
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            process.env.FRONTEND_URL,
            'https://studentmanagementsystem014.netlify.app',
            /https:\/\/.*--studentmanagementsystem014\.netlify\.app$/, // Allow Netlify preview URLs
        ].filter(Boolean); // Remove undefined values
        
        // Check if origin matches any allowed origin (string or regex)
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            }
            if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now (change in production)
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions))

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Student Management System API',
        version: '1.0.0',
        endpoints: {
            admin: '/AdminLogin',
            student: '/StudentLogin',
            teacher: '/TeacherLogin'
        }
    });
});

// Initialize Firebase
try {
    initializeFirebase();
} catch (err) {
    console.log("NOT CONNECTED TO FIREBASE", err)
}

app.use('/', Routes);
app.use('/auth', AuthRoutes);
app.use('/', PasswordRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server started at port no. ${PORT}`)
    })
}

// Export for Vercel serverless
module.exports = app;