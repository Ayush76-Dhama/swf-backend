const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const middleware = require('./middleware/middleware');
const joinUsController = require('./controllers/joinUsController');
const contactController = require('./controllers/contactController');
const subscribeController = require('./controllers/subscribeController');

dotenv.config();

if (!process.env.MONGO_URI) {
    process.env.MONGO_URI = 'mongodb+srv://localhost:27017/swf';
    console.log('Warning: MONGO_URI is not defined in the environment variables. Using default value.');
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Example: Mount your API routes if you have any
// app.use('/api', controller);

// JoinUs form submission route
app.post('/api/join-us', joinUsController.submitForm);
app.post('/api/contact', contactController.submitForm);
app.post('/api/subscribe', subscribeController.submitForm);

// app.get('/', (req, res) => { 
//     res.send('Hello World');
// });

// Not found and error handler should be after all routes
app.use(middleware.notFound);
app.use(middleware.errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


