const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const normalizedEmail = email.toLowerCase();
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            isVerified: true
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('❌ Registration Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Google Login
exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub: googleId } = ticket.getPayload();

        if (!email) return res.status(400).json({ message: 'Email required' });

        const normalizedEmail = email.toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            // Link google ID if not linked
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            // Auto verify if not
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        } else {
            // Create new Google user
            user = await User.create({
                name,
                email: normalizedEmail,
                password: await require('bcryptjs').hash(Math.random().toString(36), 10), // Random password
                avatar: picture,
                googleId,
                isVerified: true,
                role: 'user'
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users (Admin only)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
