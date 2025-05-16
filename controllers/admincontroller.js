const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Admin
exports.registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ 
            $or: [{ username }, { email: email.toLowerCase() }] 
        });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering admin' });
    }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ensure email is in lowercase for comparison
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            console.log('Admin not found:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log('Password mismatch for admin:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};