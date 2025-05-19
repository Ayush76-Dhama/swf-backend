const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware/middleware');
const joinUsController = require('./controllers/joinUsController');
const contactController = require('./controllers/contactController');
const adminController = require('./controllers/admincontroller');
const subscribeController = require('./controllers/subscribeController');
const aboutController = require('./controllers/aboutController');


dotenv.config();

// Dummy admin credentials
const ADMIN_EMAIL = 'admin@swf.com';
const ADMIN_PASSWORD = 'Admin@123';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swf';
mongoose.connect(MONGODB_URI, {})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Public API Routes
app.post('/api/join-us', joinUsController.submitForm);
app.post('/api/contact', contactController.submitForm);
app.post('/api/subscribe', subscribeController.submitForm);
app.post('/api/admin/register', adminController.registerAdmin);
app.post('/api/admin/login', adminController.loginAdmin);

// Protected admin routes
app.use('/api/admin/protected', authMiddleware);

// Error handling
app.use(middleware.notFound);
app.use(middleware.errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


