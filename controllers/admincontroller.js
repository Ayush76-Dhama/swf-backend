const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Admin
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Registration attempt for:', email);

        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            console.log('Admin already exists:', email);
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new Admin({
            email: email.toLowerCase(),
            password: password
        });

        await admin.save();
        console.log('Admin registered successfully:', email);

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering admin' });
    }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    try {
        // Find admin by email
        console.log('Attempting to find admin with email:', email.toLowerCase());
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (!admin) {
            console.log('Admin not found for email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('Admin found, attempting password comparison.');
        // Compare password using bcrypt directly
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch for admin:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('Login successful for:', email);

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};