const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
// const bodyParser = require("body-parser")

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
            process.env.FRONTEND_URL
        ].filter(Boolean); // Remove undefined values
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins in development
        }
    },
    credentials: true,
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

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

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