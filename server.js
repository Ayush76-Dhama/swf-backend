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
const pageContentRoutes = require('./routes/pageContent');
const auth = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    process.exit(1);
}

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/swf', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Public API Routes
app.post('/api/join-us', joinUsController.submitForm);
app.post('/api/contact', contactController.submitForm);
app.post('/api/subscribe', subscribeController.submitForm);
app.post('/api/admin/register', adminController.registerAdmin);
app.post('/api/admin/login', adminController.loginAdmin);

// Protected admin routes
app.use('/api/admin/protected', auth);

// Routes
app.use('/api/admin/page-content', auth, pageContentRoutes);

// Error handling
app.use(middleware.notFound);
app.use(middleware.errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


