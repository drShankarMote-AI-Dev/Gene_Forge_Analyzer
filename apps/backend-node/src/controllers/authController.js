const User = require('../models/User');
const Log = require('../models/Log');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// OTP Storage (In-memory for simplicity, consider Redis for production)
const otpStore = new Map(); // email -> { otp, expires }

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d' // 30 days persistent login
    });
};

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject,
        text
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Default role is 'user'
        const user = await User.create({
            name,
            email,
            password,
            role: 'user'
        });

        if (user) {
            await Log.create({ userId: user._id, action: 'User Registered' });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a regular user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            await Log.create({ userId: user._id, action: 'User Logged In', ipAddress: req.ip });
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate OTP for Admin Login
// @route   POST /api/auth/admin/send-otp
// @access  Public (Restricted by env check)
exports.sendAdminOtp = async (req, res) => {
    const { email } = req.body;

    // Strict check against env variable
    if (email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Unauthorized access attempt' });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

        otpStore.set(email, { otp, expires });

        await sendEmail(email, 'Your Admin Login OTP', `Your OTP is: ${otp}`);

        res.json({ message: 'OTP sent to registered admin email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// @desc    Verify OTP and Login Admin
// @route   POST /api/auth/admin/verify-otp
// @access  Public
exports.verifyAdminOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const storedOtp = otpStore.get(email);

    if (!storedOtp || storedOtp.otp !== otp) {
        return res.status(401).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > storedOtp.expires) {
        otpStore.delete(email);
        return res.status(401).json({ message: 'OTP expired' });
    }

    otpStore.delete(email); // Invalidate OTP after use

    // Find or create admin user in DB (optional, but good for logging)
    let adminUser = await User.findOne({ email });
    if (!adminUser) {
        // If admin doesn't exist in DB yet, create one securely
        // Password is meant to be unused for OTP login but required by schema
        // Generate a long random password
        const randomPassword = crypto.randomBytes(32).toString('hex');
        adminUser = await User.create({
            name: 'Super Admin',
            email: email,
            password: randomPassword,
            role: 'admin'
        });
    } else if (adminUser.role !== 'admin') {
        // If user exists but not admin, force update to admin if matches env
        adminUser.role = 'admin';
        await adminUser.save();
    }

    await Log.create({ userId: adminUser._id, action: 'Admin Logged In via OTP', ipAddress: req.ip });

    res.json({
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: 'admin',
        token: generateToken(adminUser._id, 'admin')
    });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
